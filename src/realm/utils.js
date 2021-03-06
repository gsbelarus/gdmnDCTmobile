import SettingsModel from './models/SettingsModel'
import OperatorModel from './models/OperatorModel'
import StoringPlaceModel from './models/StoringPlaceModel'
import OperationModel from './models/OperationModel'
import SessionModel from './models/SessionModel'

export default function createDemoData (realm) {
  realm.write(() => {

    realm.create(OperatorModel.schema.name, OperatorModel.newInstance(1, 'Оператор 1', false), true)
    realm.create(OperatorModel.schema.name, OperatorModel.newInstance(2, 'Оператор 2', false), true)
    realm.create(OperatorModel.schema.name, OperatorModel.newInstance(3, 'Оператор 3', true), true)
    realm.create(OperatorModel.schema.name, OperatorModel.newInstance(4, 'Оператор 4', false), true)

    realm.create(StoringPlaceModel.schema.name, StoringPlaceModel.newInstance(1, 'Место 1', '321', false), true)
    realm.create(StoringPlaceModel.schema.name, StoringPlaceModel.newInstance(2, 'Место 2', '432', false), true)
    realm.create(StoringPlaceModel.schema.name, StoringPlaceModel.newInstance(3, 'Место 3', '543', true), true)

    realm.create(OperationModel.schema.name, OperationModel.newInstance(1, 'Операция 1', '321', 1, false), true)
    realm.create(OperationModel.schema.name, OperationModel.newInstance(2, 'Операция 2', '432', 3, false), true)
    realm.create(OperationModel.schema.name, OperationModel.newInstance(3, 'Операция 3', '543', 2, true), true)

    let settings = SettingsModel.getSettings(realm)
    updateStoredSessionsQuantity(realm, settings.maxCountSession)
  })
}

export function updateStoredSessionsQuantity (realm, count) {
  if (count === 0) return

  let sessions = SessionModel.getExported(realm)
  const exportedSessions = sessions.filter((session) => session.exported)
  if (exportedSessions.length > count) {
    sessions.slice(count, sessions.length).forEach((item) => {
      realm.delete(item.codes)
      realm.delete(item)
    })
  }
}