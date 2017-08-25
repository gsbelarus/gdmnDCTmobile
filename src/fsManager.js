import RNFS from 'react-native-fs'
import { formatDate } from './localization/utils'
import OperatorModel from './realm/models/OperatorModel'
import StoringPlaceModel from './realm/models/StoringPlaceModel'
import OperationModel from './realm/models/OperationModel'

export class ExportManager {

  static DIR = RNFS.ExternalDirectoryPath + '/export'
  static ENCODING = 'utf8'

  static getFileNameSession (session) {
    return `${formatDate(session.time, 'YYMMDDHHmmss', 'en')}.txt`
  }

  static async exportSession (session) {
    const filePath = ExportManager.DIR + '/' + ExportManager.getFileNameSession(session)

    const data = session.codes.map((code) => (
      new ExportItem(
        code.name,
        session.storingPlace.id,
        session.operation.id,
        session.operator.id,
        session.time,
        ExportManager.getFileNameSession(session)
      )
    ))

    await RNFS.mkdir(ExportManager.DIR)
    await RNFS.writeFile(filePath, JSON.stringify(data), ExportManager.ENCODING)
  }

  static async exportTest (realm) {
    const operatorFilePath = ImportManager.DIR + '/' + ImportManager.FILE_NAME_OPERATORS
    const operators = OperatorModel.getSortedByName(realm)
    await RNFS.mkdir(ImportManager.DIR)
    await RNFS.writeFile(operatorFilePath, JSON.stringify(Array.from(operators)), ExportManager.ENCODING)

    const storingPlaceFilePath = ImportManager.DIR + '/' + ImportManager.FILE_NAME_STORING_PLACES
    const storingPlaces = StoringPlaceModel.getSortedByName(realm)
    await RNFS.mkdir(ImportManager.DIR)
    await RNFS.writeFile(storingPlaceFilePath, JSON.stringify(Array.from(storingPlaces)), ExportManager.ENCODING)

    const operationFilePath = ImportManager.DIR + '/' + ImportManager.FILE_NAME_OPERATIONS
    const operations = OperationModel.getSortedByName(realm)
    await RNFS.mkdir(ImportManager.DIR)
    await RNFS.writeFile(operationFilePath, JSON.stringify(Array.from(operations)), ExportManager.ENCODING)
  }
}

export class ImportManager {

  static DIR = RNFS.ExternalDirectoryPath + '/import'
  static ENCODING = 'utf8'
  static FILE_NAME_OPERATORS = 'operators.txt'
  static FILE_NAME_STORING_PLACES = 'storing_places.txt'
  static FILE_NAME_OPERATIONS = 'operations.txt'

  static async importAll (realm) {
    await ImportManager.importOperators(realm)
    await ImportManager.importStoringPlaces(realm)
    await ImportManager.importOperations(realm)
  }

  static async importOperators (realm) {
    const filePath = ImportManager.DIR + '/' + ImportManager.FILE_NAME_OPERATORS

    if (await RNFS.exists(filePath)) {
      const operators = JSON.parse(await RNFS.readFile(filePath, ImportManager.ENCODING))
      const operatorModels = operators.map((operator) => (
        OperatorModel.newInstance(
          operator[OperatorModel.FIELD_ID],
          operator[OperatorModel.FIELD_NAME],
          operator[OperatorModel.FIELD_DISABLED]
        )
      ))
      realm.write(() => {
        operatorModels.forEach((operator) => {
          realm.create(OperationModel.name, operator, true)
        })
      })

      await RNFS.unlink(filePath)
    }
  }

  static async importStoringPlaces (realm) {
    const filePath = ImportManager.DIR + '/' + ImportManager.FILE_NAME_STORING_PLACES

    if (await RNFS.exists(filePath)) {
      const storingPlaces = JSON.parse(await RNFS.readFile(filePath, ImportManager.ENCODING))
      const storingPlaceModels = storingPlaces.map((storingPlace) => (
        StoringPlaceModel.newInstance(
          storingPlace[StoringPlaceModel.FIELD_ID],
          storingPlace[StoringPlaceModel.FIELD_NAME],
          storingPlace[StoringPlaceModel.FIELD_CODE],
          storingPlace[StoringPlaceModel.FIELD_DISABLED]
        )
      ))
      realm.write(() => {
        storingPlaceModels.forEach((storingPlace) => {
          realm.create(StoringPlaceModel.name, storingPlace, true)
        })
      })

      await RNFS.unlink(filePath)
    }
  }

  static async importOperations (realm) {
    const filePath = ImportManager.DIR + '/' + ImportManager.FILE_NAME_OPERATIONS

    if (await RNFS.exists(filePath)) {
      const operations = JSON.parse(await RNFS.readFile(filePath, ImportManager.ENCODING))
      const operationModels = operations.map((operation) => (
        OperationModel.newInstance(
          operation[OperationModel.FIELD_ID],
          operation[OperationModel.FIELD_NAME],
          operation[OperationModel.FIELD_CODE],
          operation[OperationModel.FIELD_SORT_NUMBER],
          operation[OperationModel.FIELD_DISABLED]
        )
      ))
      realm.write(() => {
        operationModels.forEach((operation) => {
          realm.create(OperationModel.name, operation, true)
        })
      })

      await RNFS.unlink(filePath)
    }
  }
}

class ExportItem {

  codeName
  storingPlaceKey
  operationKey
  operatorKey
  sessionTime
  fileName

  constructor (codeName, storingPlaceKey, operationKey, operatorKey, sessionTime, fileName) {
    this.codeName = codeName
    this.storingPlaceKey = storingPlaceKey
    this.operationKey = operationKey
    this.operatorKey = operatorKey
    this.sessionTime = sessionTime
    this.fileName = fileName
  }
}