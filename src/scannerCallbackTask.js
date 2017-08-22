import realm from './realm/realm'
import CodeModel from './realm/models/CodeModel'
import SessionModel from './realm/models/SessionModel'
import ScannerApi from './ScannerApi'

export default async (taskData) => {
  if (taskData.value !== ScannerApi.SCANNER_READ_FAIL) {
    let session = SessionModel.getOpenedSession(realm)
    if (!SessionModel.findCodeByName(session, taskData.value)) {
      realm.write(() => {
        let code = CodeModel.create(realm, taskData.value)
        session.codes.unshift(code)
      })
    }
  }
}