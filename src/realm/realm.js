import Realm from 'realm'
import SessionModel from './models/SessionModel'
import OperatorModel from './models/OperatorModel'
import StoringPlaceModel from './models/StoringPlaceModel'
import OperationModel from './models/OperationModel'
import CodeModel from './models/CodeModel'
import SettingModel from './models/SettingsModel'

let realm

export async function openRealm () {
  if (!realm) {
    realm = await Realm.open({
      schema: [SettingModel, SessionModel, OperatorModel, StoringPlaceModel, OperationModel, CodeModel],
      schemaVersion: 107,
      shouldCompactOnLaunch: (totalBytes, usedBytes) => true
    }).progress(console.log)

    // realm.write(() => realm.deleteAll())     //TODO remove
    // createDemoData(realm)                //TODO remove
  }
  return realm
}