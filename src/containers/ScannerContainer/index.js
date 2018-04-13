import React from 'react'
import { Text, TextInput, View } from 'react-native'
import ScannerApi from 'react-native-android-scanner'
import DialogAndroid from 'react-native-dialogs'
import Snackbar from 'react-native-snackbar'
import { connect } from 'react-redux'
import HeaderSearchBar from '../../components/HeaderSearchBar/index'
import List from '../../components/List/index'
import ListItem from '../../components/ListItem/index'
import PopupModal from '../../components/PopupModal/index'
import TouchableView from '../../components/TouchableView'
import strings, {
  STRING_ACTION_CANCEL,
  STRING_ACTION_CONFIRM,
  STRING_ACTION_DELETE,
  STRING_ACTION_HIDE,
  STRING_ERROR_REPEAT_CODE,
  STRING_ERROR_SCANNING,
  STRING_NOTIFICATION,
  STRING_TITLE_SELECT_STORING_PLACE
} from '../../localization/strings'
import { connectRealm } from '../../realm/contextRealm'
import CodeModel from '../../realm/models/CodeModel'
import SessionModel from '../../realm/models/SessionModel'
import {
  changeCode,
  dismissEditor,
  showEditor,
  toggleSelector,
  updateSelectorSearch,
  updateStoringPlace
} from '../../redux/actions/scannerActions'
import scannerCallbackTask from '../../scannerCallbackTask'
import SelectStoringPlaceContainer from '../SelectStoringPlaceContainer'
import styles from './styles'

function showDeleteConfirmDialog (onConfirm) {
  let dialog = new DialogAndroid()
  dialog.set({
    title: strings(STRING_NOTIFICATION),
    content: strings(STRING_ACTION_DELETE) + '?',
    positiveText: strings(STRING_ACTION_CONFIRM),
    negativeText: strings(STRING_ACTION_CANCEL),
    onPositive: onConfirm
  })
  dialog.show()
}

function showRepeatError () {
  Snackbar.show({
    title: strings(STRING_ERROR_REPEAT_CODE),
    duration: Snackbar.LENGTH_LONG,
    action: {
      title: strings(STRING_ACTION_HIDE),
      color: 'red',
      onPress: Snackbar.dismiss,
    }
  })
}

@connectRealm(
  (realm, ownProps) => ({
    realm,
    items: SessionModel.getOpenedSession(realm).codes
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData})
)
@connect(
  (state) => ({scannerState: state.scannerState}),
  (dispatch, ownProps) => ({
    onChangeText: (value) => dispatch(changeCode(value)),
    onItemPress: (item) => {
      dispatch(showEditor(item.name))
      if (item.storingPlace) dispatch(updateStoringPlace(item.storingPlace))
    },
    onItemRightPress: (item) => {
      showDeleteConfirmDialog(() => {
        ownProps.realm.write(() => ownProps.realm.delete(item))
      })
    },
    onActionPress: () => {
      dispatch(updateStoringPlace(CodeModel.getDefaultStoringPlace(ownProps.realm)))
      dispatch(showEditor())
    },
    onCancelPress: () => dispatch(dismissEditor()),
    onRequestClose: () => dispatch(dismissEditor()),
    onSelectorRequestClose: () => dispatch(toggleSelector(false)),
    onSoringPlacePress: () => dispatch(toggleSelector(true)),
    onUpdateStoringPlace: (storingPlace) => {
      dispatch(updateStoringPlace(storingPlace))
      dispatch(toggleSelector(false))
    },
    updateSelectorSearch: (value) => dispatch(updateSelectorSearch(value)),
    onScanned: async (scanResult) => {
      if (scanResult.value === ScannerApi.SCANNER_READ_FAIL) {
        Snackbar.show({
          title: strings(STRING_ERROR_SCANNING),
          duration: Snackbar.LENGTH_LONG,
          action: {
            title: strings(STRING_ACTION_HIDE),
            color: 'red',
            onPress: Snackbar.dismiss,
          }
        })
      } else {
        const session = SessionModel.getOpenedSession(ownProps.realm)
        if (session.codes.find((item) => item.name === scanResult.value)) {
          return showRepeatError()
        }

        await scannerCallbackTask(scanResult)
        let code = session.codes.find((item) => item.name === scanResult.value)
        if (code) {
          dispatch(showEditor(code.name))
          if (code.storingPlace) dispatch(updateStoringPlace(code.storingPlace))
        }
      }
    }
  }),
  (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    onNeutralPress: () => {
      let code = ownProps.items.find((item) => item.name === stateProps.scannerState.tmpCode)
      ownProps.realm.write(() => ownProps.realm.delete(code))
      dispatchProps.onRequestClose()
    },
    onPositivePress: () => {
      const {code: codeName, tmpCode: newCodeName, storingPlace: newStoringPlace} = stateProps.scannerState
      if (!newCodeName) return

      if (codeName) {
        const oldCode = ownProps.items.find((item) => item.name === codeName)
        if (!oldCode) {
          console.warn('oldCode not found')

        } else if (oldCode.name === newCodeName) {
          if (oldCode.storingPlace.id !== newStoringPlace.id) {
            ownProps.realm.write(() => oldCode.storingPlace = newStoringPlace)
          }
          dispatchProps.onRequestClose()
        } else if (ownProps.items.find((item) => item.name === newCodeName)) {
          showRepeatError()

        } else {
          ownProps.realm.write(() => {
            oldCode.name = newCodeName
            oldCode.storingPlace = newStoringPlace
          })
          dispatchProps.onRequestClose()
        }

      } else if (ownProps.items.find((item) => item.name === newCodeName)) {
        showRepeatError()

      } else {
        ownProps.realm.write(() => {
          ownProps.items.unshift(CodeModel.create(ownProps.realm, newCodeName, newStoringPlace))
        })
        dispatchProps.onRequestClose()
      }
    }
  })
)
export default class ScannerContainer extends React.PureComponent {

  constructor (props, context) {
    super(props, context)

    this._renderItem = this._renderItem.bind(this)
  }

  _renderItem ({item, index}) {
    return (
      <ListItem
        id={item.id}
        primaryText={item.name}
        secondaryText={item.storingPlace && item.storingPlace.name}
        iconRightName={'delete'}
        onItemPress={() => this.props.onItemPress(item)}
        onItemIconRightPress={() => this.props.onItemRightPress(item)}/>
    )
  }

  componentDidMount () {
    ScannerApi.addListener(this.props.onScanned)
  }

  componentWillUnmount () {
    ScannerApi.removeListener(this.props.onScanned)
  }

  render () {
    return (
      <View style={styles.container}>
        <PopupModal
          visible={this.props.scannerState.editorVisible}
          title={this.props.scannerState.editorTitle}
          closeOnPressAway={true}
          showPositive={true}
          showCancel={true}
          showNeutral={this.props.scannerState.editorCanDelete}
          neutralText={strings(STRING_ACTION_DELETE)}
          onRequestClose={this.props.onRequestClose}
          onCancelPress={this.props.onCancelPress}
          onPositivePress={this.props.onPositivePress}
          onNeutralPress={this.props.onNeutralPress}>
          <TouchableView
            delayPressIn={0}
            rippleColor={'white'}
            onPress={this.props.onSoringPlacePress}
            style={styles.storingPlaceContainer}>
            <Text
              numberOfLines={1}
              style={styles.storingPlaceText}>
              {this.props.scannerState.storingPlace
                ? this.props.scannerState.storingPlace.name
                : strings(STRING_TITLE_SELECT_STORING_PLACE)}
            </Text>
          </TouchableView>
          <TextInput
            autoFocus={true}
            value={this.props.scannerState.tmpCode}
            onChangeText={this.props.onChangeText}
            keyboardType={'numeric'}
            underlineColorAndroid={'black'}
            maxLength={CodeModel.NAME_MAX_LENGTH}
            style={styles.codeInputText}/>
        </PopupModal>
        <PopupModal
          visible={this.props.scannerState.selectorVisible}
          title={strings(STRING_TITLE_SELECT_STORING_PLACE)}
          closeOnPressAway={true}
          onRequestClose={this.props.onSelectorRequestClose}
          dialogStyle={styles.selectorContainer}
          contentStyle={styles.selectorContentContainer}>
          <HeaderSearchBar
            value={this.props.scannerState.selectorSearch}
            onChangeText={this.props.updateSelectorSearch}/>
          <SelectStoringPlaceContainer
            search={this.props.scannerState.selectorSearch}
            selectedKey={this.props.scannerState.storingPlace && this.props.scannerState.storingPlace.id}
            onItemPress={this.props.onUpdateStoringPlace}/>
        </PopupModal>
        <List
          extra={this.props.extra}
          items={this.props.items}
          renderItem={this._renderItem}
          actionVisible={true}
          onActionPress={this.props.onActionPress}
          style={styles.container}/>
      </View>
    )
  }
}