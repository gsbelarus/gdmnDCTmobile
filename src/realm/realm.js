import Realm from 'realm'
import SessionModel from './models/SessionModel'
import OperatorModel from './models/OperatorModel'
import StoringPlaceModel from './models/StoringPlaceModel'
import OperationModel from './models/OperationModel'
import SettingModel from './models/SettingsModel'
import CodeModel from './models/CodeModel'

let realm

export async function openRealm () {
  if (!realm) {
    realm = await Realm.open({
      schema: [SettingModel, SessionModel, OperatorModel, StoringPlaceModel, OperationModel, CodeModel],
      schemaVersion: 112,
      deleteRealmIfMigrationNeeded: true,
      shouldCompactOnLaunch: (totalBytes, usedBytes) => true
    }).progress(console.log)

    // realm.write(() => realm.deleteAll())     //TODO remove
    // createDemoData(realm)                //TODO remove
  }
  return realm
}