import Realm from 'realm'
import CodeModel from './models/CodeModel'
import OperationModel from './models/OperationModel'
import OperatorModel from './models/OperatorModel'
import SessionModel from './models/SessionModel'
import SettingModel from './models/SettingsModel'
import StoringPlaceModel from './models/StoringPlaceModel'

let realm

export async function openRealm () {
  if (!realm) {
    realm = await Realm.open({
      schema: [SettingModel, SessionModel, OperatorModel, StoringPlaceModel, OperationModel, CodeModel],
      schemaVersion: 112,
      deleteRealmIfMigrationNeeded: true,
      shouldCompactOnLaunch: (totalBytes, usedBytes) => true
    })

    // realm.write(() => realm.deleteAll())     //TODO remove
    // createDemoData(realm)                //TODO remove
  }
  return realm
}