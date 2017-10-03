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
import CodeModel from '../realm/models/CodeModel'

class Scanner extends PureComponent {

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

export default connectRealm(
  (realm, ownProps) => ({
    realm,
    items: SessionModel.getOpenedSession(realm).codes,
    renderItem: ({item}) => (
      <ListItem
        id={item.id}
        primaryText={item.name}
        iconRightName={'clear'}
        onItemPress={() => showInputDialog(realm, item)}
        onItemIconRightPress={() => realm.write(() => realm.delete(item))}/>
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
        let code = SessionModel.findCodeByName(SessionModel.getOpenedSession(realm), scanResult.value)
        if (code) showInputDialog(realm, code)
      }
    }
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData})
)(Scanner)

function showInputDialog (realm, code) {
  let dialog = new DialogAndroid()
  dialog.set({
    title: code ? strings(STRING_CODE_EDITING) : strings(STRING_CODE_CREATING),
    positiveText: strings(STRING_ACTION_OK),
    negativeText: strings(STRING_ACTION_CANCEL),
    neutralText: code ? strings(STRING_ACTION_DELETE) : null,
    onNeutral: () => realm.write(() => realm.delete(code)),
    input: {
      hint: strings(STRING_CODE_ENTER),
      prefill: code ? code.name : '',
      maxLength: CodeModel.NAME_MAX_LENGTH,
      allowEmptyInput: false,
      type: 2,
      callback: (input) => {
        if (code && input === code.name) return

        const session = SessionModel.getOpenedSession(realm)
        if (SessionModel.findCodeByName(session, input)) {
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
          realm.write(() => code.name = input)
        } else {
          realm.write(() => session.codes.unshift(CodeModel.create(realm, input)))
        }
      }
    }
  })
  dialog.show()
}