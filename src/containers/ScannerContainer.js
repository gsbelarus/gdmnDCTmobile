import React, { PureComponent } from 'react'
import Snackbar from 'react-native-snackbar/src/index'
import DialogAndroid from 'react-native-dialogs'
import strings, {
  STRING_ACTION_CANCEL,
  STRING_ACTION_DELETE,
  STRING_ACTION_HIDE,
  STRING_ACTION_OK,
  STRING_CODE_CREATING,
  STRING_CODE_EDITING,
  STRING_CODE_ENTER,
  STRING_ERROR_REPEAT_CODE,
  STRING_ERROR_SCANNING
} from '../localization/strings'
import ScannerApi from '../../react-native-android-scanner/src/ScannerApi'
import scannerCallbackTask from '../scannerCallbackTask'
import connectRealm from '../realm/react/connectRealm'
import SessionModel from '../realm/models/SessionModel'
import List from '../components/List/index'
import ListItem from '../components/ListItem/index'

@connectRealm(
  (realm, ownProps) => ({
    realm,
    items: SessionModel.getOpenedSession(realm).codes,
    renderItem: ({item, index}) => (
      <ListItem
        id={index}
        primaryText={item}
        iconRightName={'clear'}
        onItemPress={() => showInputDialog(realm, item)}
        onItemIconRightPress={() => deleteCode(realm, item)}/>
    ),
    actionVisible: true,
    onActionPress: () => showInputDialog(realm),
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
        await scannerCallbackTask(scanResult)
        const session = SessionModel.getOpenedSession(realm)
        let code = session.codes.find((item) => item === scanResult.value)
        if (code) showInputDialog(realm, code)
      }
    }
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData})
)
export default class ScannerContainer extends PureComponent {

  componentDidMount () {
    ScannerApi.addListener(this.props.onScanned)
  }

  componentWillUnmount () {
    ScannerApi.removeListener(this.props.onScanned)
  }

  render () {
    return <List {...this.props}/>
  }
}

function showInputDialog (realm, code) {
  let dialog = new DialogAndroid()
  dialog.set({
    title: code ? strings(STRING_CODE_EDITING) : strings(STRING_CODE_CREATING),
    positiveText: strings(STRING_ACTION_OK),
    negativeText: strings(STRING_ACTION_CANCEL),
    neutralText: code ? strings(STRING_ACTION_DELETE) : null,
    onNeutral: () => deleteCode(realm, code),
    input: {
      hint: strings(STRING_CODE_ENTER),
      prefill: code || '',
      allowEmptyInput: false,
      type: 2,
      callback: (input) => {
        if (code && input === code) return

        const session = SessionModel.getOpenedSession(realm)
        if (session.codes.find((item) => item === input)) {
          setTimeout(() => Snackbar.show({    //TODO workaround
            title: strings(STRING_ERROR_REPEAT_CODE),
            duration: Snackbar.LENGTH_LONG,
            action: {
              title: strings(STRING_ACTION_HIDE),
              color: 'red',
              onPress: Snackbar.dismiss,
            }
          }), 300)
        } else if (code) {
          let index = session.codes.findIndex((item) => item === code)
          realm.write(() => session.codes[index] = input)
        } else {
          realm.write(() => session.codes.unshift(input))
        }
      }
    }
  })
  dialog.show()
}

function deleteCode (realm, code) {
  const session = SessionModel.getOpenedSession(realm)
  let index = session.codes.findIndex((item) => item === code)
  realm.write(() => session.codes.splice(index, 1))
}