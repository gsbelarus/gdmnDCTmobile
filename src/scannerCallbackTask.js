import ScannerApi from 'react-native-android-scanner'
import { openRealm } from './realm/realm'
import CodeModel from './realm/models/CodeModel'
import SessionModel from './realm/models/SessionModel'

export default async (taskData) => {
  if (taskData.value !== ScannerApi.SCANNER_READ_FAIL) {
    const realm = await openRealm()
    if (realm) {
      let session = SessionModel.getOpenedSession(realm)
      if (!SessionModel.findCodeByName(session, taskData.value)) {
        realm.write(() => {
          let code = CodeModel.create(realm, taskData.value)
          session.codes.unshift(code)
        })
      }
    }
  }
}