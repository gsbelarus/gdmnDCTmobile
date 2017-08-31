import { createAction } from 'redux-actions'
import Snackbar from 'react-native-snackbar'
import ScannerApi from 'react-native-android-scanner'
import strings, {
  STRING_ACTION_HIDE,
  STRING_ERROR_REPEAT_CODE,
  STRING_ERROR_SCANNING
} from '../../localization/strings'
import SessionModel from '../../realm/models/SessionModel'
import CodeModel from '../../realm/models/CodeModel'
import scannerCallbackTask from '../../scannerCallbackTask'

export const showEditor = createAction('SHOW_EDITOR')
export const dismissEditor = createAction('DISMISS_EDITOR')

export function saveAndDismissEditor (realm, text) {
  return (dispatch, getState) => {
    const {scannerState} = getState()

    const session = SessionModel.getOpenedSession(realm)
    if (SessionModel.findCodeByName(session, text)) {
      Snackbar.show({
        title: strings(STRING_ERROR_REPEAT_CODE),
        duration: Snackbar.LENGTH_LONG,
        action: {
          title: strings(STRING_ACTION_HIDE),
          color: 'red',
          onPress: Snackbar.dismiss,
        }
      })

    } else if (scannerState.editableItemKey) {
      const code = SessionModel.findCodeByKey(session, scannerState.editableItemKey)
      if (code) realm.write(() => code.name = text)
      dispatch(dismissEditor())

    } else {
      realm.write(() => session.codes.unshift(CodeModel.create(realm, text)))
      dispatch(dismissEditor())
    }
  }
}

export function deleteAndDismissEditor (realm) {
  return (dispatch, getState) => {
    const {scannerState} = getState()

    if (scannerState.editableItemKey) {
      const session = SessionModel.getOpenedSession(realm)
      const code = SessionModel.findCodeByKey(session, scannerState.editableItemKey)
      realm.write(() => realm.delete(code))
      dispatch(dismissEditor())
    }
  }
}

export function onScanned (realm, scanResult) {
  return async (dispatch, getState) => {
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
      if (code) dispatch(showEditor(code))
    }
  }
}