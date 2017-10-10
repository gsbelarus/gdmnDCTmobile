import Realm from 'realm'
import SessionModel from './models/SessionModel'
import OperatorModel from './models/OperatorModel'
import StoringPlaceModel from './models/StoringPlaceModel'
import OperationModel from './models/OperationModel'
import CodeModel from './models/CodeModel'
import SettingModel from './models/SettingsModel'
import createDemoData from './utils'

let realm

export async function openRealm () {
  if (!realm) {
    realm = await Realm.open({
      schema: [SettingModel, SessionModel, OperatorModel, StoringPlaceModel, OperationModel, CodeModel],
      schemaVersion: 100,
      shouldCompactOnLaunch: (totalBytes, usedBytes) => true
    }).progress(console.log)

    createDemoData(realm)
  }
  return realm
}