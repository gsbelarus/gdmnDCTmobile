import Realm from 'realm'
import SessionModel from './models/SessionModel'
import OperatorModel from './models/OperatorModel'
import StoringPlaceModel from './models/StoringPlaceModel'
import OperationModel from './models/OperationModel'
import CodeModel from './models/CodeModel'
import createDemoData from './utils'
import SettingModel from './models/SettingsModel'

let realm

export async function openRealm () {
  if (!realm) {
    realm = await Realm.open({
      schema: [SettingModel, SessionModel, OperatorModel, StoringPlaceModel, OperationModel, CodeModel],
      schemaVersion: 22,
      shouldCompactOnLaunch: (totalBytes, usedBytes) => true
    })

    createDemoData(realm)
  }
  return realm
}