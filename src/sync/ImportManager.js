import restful from 'restful.js/dist/restful.standalone'
import OperatorModel from '../realm/models/OperatorModel'
import StoringPlaceModel from '../realm/models/StoringPlaceModel'
import OperationModel from '../realm/models/OperationModel'
import SettingModel from '../realm/models/SettingsModel'

export default class ImportManager {

  constructor (realm) {
    this._realm = realm
  }

  get realm () {
    return this._realm
  }

  set realm (value) {
    this.realm = value
  }

  get _api () {
    let settings = SettingModel.getSettings(this.realm)
    return restful(settings.fullUrl)
  }

  async importAll () {
    try {
      this.realm.beginTransaction()

      await this._importOperations()
      await this._importStoringPlaces()
      await this._importOperators()

      this.realm.commitTransaction()
    } catch (error) {
      this.realm.cancelTransaction()
      throw error
    }
  }

  async _importOperators () {
    const response = await this._api.all('operators').getAll()
    const operators = response.body()

    const operatorModels = operators.map((operator) => (
      OperatorModel.newInstance(
        operator[OperatorModel.FIELD_ID],
        operator[OperatorModel.FIELD_NAME],
        operator[OperatorModel.FIELD_DISABLED]
      )
    ))
    operatorModels.forEach((operator) => {
      this.realm.create(OperatorModel.name, operator, true)
    })
  }

  async _importStoringPlaces () {
    const response = await this._api.all('storingPlaces').getAll()
    const storingPlaces = response.body()

    const storingPlaceModels = storingPlaces.map((storingPlace) => (
      StoringPlaceModel.newInstance(
        storingPlace[StoringPlaceModel.FIELD_ID],
        storingPlace[StoringPlaceModel.FIELD_NAME],
        storingPlace[StoringPlaceModel.FIELD_CODE],
        storingPlace[StoringPlaceModel.FIELD_DISABLED]
      )
    ))
    storingPlaceModels.forEach((storingPlace) => {
      this.realm.create(StoringPlaceModel.name, storingPlace, true)
    })
  }

  async _importOperations () {
    const response = await this._api.all('operations').getAll()
    const operations = response.body()

    const operationModels = operations.map((operation) => (
      OperationModel.newInstance(
        operation[OperationModel.FIELD_ID],
        operation[OperationModel.FIELD_NAME],
        operation[OperationModel.FIELD_CODE],
        operation[OperationModel.FIELD_SORT_NUMBER],
        operation[OperationModel.FIELD_DISABLED]
      )
    ))
    operationModels.forEach((operation) => {
      this.realm.create(OperationModel.name, operation, true)
    })
  }
}