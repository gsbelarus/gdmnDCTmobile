import { createAction } from 'redux-actions'
import Snackbar from 'react-native-snackbar'
import ScannerApi from 'react-native-android-scanner'
import SessionModel from '../../realm/models/SessionModel'
import CodeModel from '../../realm/models/CodeModel'
import scannerCallbackTask from '../../scannerCallbackTask'

export const showEditor = createAction('SHOW_EDITOR')
export const dismissEditor = createAction('DISMISS_EDITOR')

export function saveAndDismissEditor (realm, text) {
  return (dispatch, getState) => {
    const {scannerState} = getState()
    realm.write(() => {
      if (scannerState.editableItem) {
        scannerState.editableItem.name = text
        dispatch(dismissEditor())
      } else {
        let session = SessionModel.getOpenedSession(realm)
        if (!SessionModel.findCodeByName(session, text)) {
          session.codes.unshift(CodeModel.create(realm, text))
          dispatch(dismissEditor())
        }
      }
    })
  }
}

export function deleteAndDismissEditor (realm) {
  return (dispatch, getState) => {
    const {scannerState} = getState()
    realm.write(() => {
      if (scannerState.editableItem) realm.delete(scannerState.editableItem)
      dispatch(dismissEditor())
    })
  }
}

export function onScanned (realm, scanResult) {
  return async (dispatch, getState) => {
    if (scanResult.value === ScannerApi.SCANNER_READ_FAIL) {
      Snackbar.show({
        title: 'Не удалось считать код',
        duration: Snackbar.LENGTH_SHORT,
        action: {
          title: 'Скрыть',
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