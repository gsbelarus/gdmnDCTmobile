import RNFS from 'react-native-fs'
import FSWatcher from 'react-native-android-fs-watcher'
import { formatDate } from './localization/utils'
import OperatorModel from './realm/models/OperatorModel'
import StoringPlaceModel from './realm/models/StoringPlaceModel'
import OperationModel from './realm/models/OperationModel'

export { FSWatcher }

export class ExportManager {

  static DIR = RNFS.ExternalDirectoryPath + '/export'
  static ENCODING = 'utf8'

  static getFileNameSession (session) {
    return `${formatDate(session.time, 'YYMMDDHHmmss', 'en')}.txt`
  }

  static async exportSession (session) {
    const filePath = this.DIR + '/' + this.getFileNameSession(session)

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

    await RNFS.mkdir(this.DIR)
    await RNFS.writeFile(filePath, JSON.stringify(data), this.ENCODING)
    await FSWatcher.scanFile(filePath)
  }

  static async exportTest (realm) {
    const operatorFilePath = ImportManager.DIR + '/' + ImportManager.FILE_NAME_OPERATORS
    const operators = OperatorModel.getSortedByName(realm)
    await RNFS.mkdir(ImportManager.DIR)
    await RNFS.writeFile(operatorFilePath, JSON.stringify(Array.from(operators)), ExportManager.ENCODING)
    await FSWatcher.scanFile(operatorFilePath)

    const storingPlaceFilePath = ImportManager.DIR + '/' + ImportManager.FILE_NAME_STORING_PLACES
    const storingPlaces = StoringPlaceModel.getSortedByName(realm)
    await RNFS.mkdir(ImportManager.DIR)
    await RNFS.writeFile(storingPlaceFilePath, JSON.stringify(Array.from(storingPlaces)), ExportManager.ENCODING)
    await FSWatcher.scanFile(storingPlaceFilePath)

    const operationFilePath = ImportManager.DIR + '/' + ImportManager.FILE_NAME_OPERATIONS
    const operations = OperationModel.getSortedBySortNumber(realm)
    await RNFS.mkdir(ImportManager.DIR)
    await RNFS.writeFile(operationFilePath, JSON.stringify(Array.from(operations)), ExportManager.ENCODING)
    await FSWatcher.scanFile(operationFilePath)
  }
}

export class ImportManager {

  static DIR = RNFS.ExternalDirectoryPath + '/import'
  static ENCODING = 'utf8'
  static FILE_NAME_OPERATORS = 'operators.txt'
  static FILE_NAME_STORING_PLACES = 'storing_places.txt'
  static FILE_NAME_OPERATIONS = 'operations.txt'

  static watchCallbacks = []

  static watch (callback) {
    this.watchCallbacks.push(callback)
    FSWatcher.addToWatching(this.DIR)
    FSWatcher.addListener(onFileEvent)
  }

  static unwatch (callback) {
    this.watchCallbacks.splice(this.watchCallbacks.findIndex(callback), 1)
    FSWatcher.removeFromWatching(this.DIR)
    FSWatcher.removeListener(onFileEvent)
  }

  static async importByFileName (realm, fileName) {
    switch (fileName) {
      case this.FILE_NAME_OPERATORS:
        await this.importOperators(realm)
        break
      case this.FILE_NAME_STORING_PLACES:
        await this.importStoringPlaces(realm)
        break
      case this.FILE_NAME_OPERATIONS:
        await this.importOperations(realm)
        break
    }
  }

  static async importAll (realm) {
    await this.importOperators(realm)
    await this.importStoringPlaces(realm)
    await this.importOperations(realm)
  }

  static async importOperators (realm) {
    const filePath = this.DIR + '/' + this.FILE_NAME_OPERATORS

    if (await RNFS.exists(filePath)) {
      const operators = JSON.parse(await RNFS.readFile(filePath, this.ENCODING))
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
      console.log('imported', filePath)
      await RNFS.unlink(filePath)
      await FSWatcher.scanFile(filePath)
      console.log('deleted', filePath)
    }
  }

  static async importStoringPlaces (realm) {
    const filePath = this.DIR + '/' + this.FILE_NAME_STORING_PLACES

    if (await RNFS.exists(filePath)) {
      const storingPlaces = JSON.parse(await RNFS.readFile(filePath, this.ENCODING))
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
      console.log('imported', filePath)
      await RNFS.unlink(filePath)
      await FSWatcher.scanFile(filePath)
      console.log('deleted', filePath)
    }
  }

  static async importOperations (realm) {
    const filePath = this.DIR + '/' + this.FILE_NAME_OPERATIONS

    if (await RNFS.exists(filePath)) {
      const operations = JSON.parse(await RNFS.readFile(filePath, this.ENCODING))
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
      console.log('imported', filePath)
      await RNFS.unlink(filePath)
      await FSWatcher.scanFile(filePath)
      console.log('deleted', filePath)
    }
  }
}

function onFileEvent (event) {
  switch (event.key) {
    // case FSWatcher.KEY_CREATE:
    case FSWatcher.KEY_MODIFY:
    case FSWatcher.KEY_MOVED_TO:
      console.log(event)
      switch (event.fileName) {
        case ImportManager.FILE_NAME_OPERATORS:
        case ImportManager.FILE_NAME_OPERATIONS:
        case ImportManager.FILE_NAME_STORING_PLACES:
          ImportManager.watchCallbacks.forEach(callback => callback(event.fileName))
          break
      }
      break
  }
}

class ExportItem {

  constructor (codeName, storingPlaceKey, operationKey, operatorKey, sessionTime, fileName) {
    this._codeName = codeName
    this._storingPlaceKey = storingPlaceKey
    this._operationKey = operationKey
    this._operatorKey = operatorKey
    this._sessionTime = sessionTime
    this._fileName = fileName
  }
}