import ScannerApi from 'react-native-android-scanner'
import { openRealm } from './realm/realm'
import SessionModel from './realm/models/SessionModel'
import CodeModel from './realm/models/CodeModel'

export default async (taskData) => {
  if (taskData.value !== ScannerApi.SCANNER_READ_FAIL) {
    const realm = await openRealm()
    if (realm) {
      let session = SessionModel.getOpenedSession(realm)
      if (!session.codes.find((item) => item.name === taskData.value)) {
        realm.write(() => session.codes.unshift(CodeModel.create(realm, taskData.value)))
      }
    }
  }
}