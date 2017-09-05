import Realm from 'realm'
import SessionModel from './models/SessionModel'
import OperatorModel from './models/OperatorModel'
import StoringPlaceModel from './models/StoringPlaceModel'
import OperationModel from './models/OperationModel'
import CodeModel from './models/CodeModel'
import createDemoData from './demoData'

export async function openRealm () {
  const realm = await Realm.open({
    schema: [SessionModel, OperatorModel, StoringPlaceModel, OperationModel, CodeModel],
    schemaVersion: 22,
    shouldCompactOnLaunch: (totalBytes, usedBytes) => true
  })

  createDemoData(realm)

  return realm
}