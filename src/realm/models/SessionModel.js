import OperatorModel from './OperatorModel'
import StoringPlaceModel from './StoringPlaceModel'
import OperationModel from './OperationModel'
import CodeModel from './CodeModel'

export default class SessionModel {

  static FIELD_ID = '_id'
  static FIELD_TIME = '_time'
  static FIELD_OPERATOR = '_operator'
  static FIELD_STORING_PLACE = '_storing_place'
  static FIELD_OPERATION = '_operation'
  static FIELD_DISABLED = '_disabled'
  static FIELD_EXPORTED = '_exported'

  static FIELD_CODES = '_codes'

  get id () {
    return this[SessionModel.FIELD_ID]
  }

  set id (value) {
    this[SessionModel.FIELD_ID] = value
  }

  get time () {
    return this[SessionModel.FIELD_TIME]
  }

  set time (value) {
    this[SessionModel.FIELD_TIME] = value
  }

  get operator () {
    return this[SessionModel.FIELD_OPERATOR]
  }

  set operator (value) {
    this[SessionModel.FIELD_OPERATOR] = value
  }

  get storingPlace () {
    return this[SessionModel.FIELD_STORING_PLACE]
  }

  set storingPlace (value) {
    this[SessionModel.FIELD_STORING_PLACE] = value
  }

  get operation () {
    return this[SessionModel.FIELD_OPERATION]
  }

  set operation (value) {
    this[SessionModel.FIELD_OPERATION] = value
  }

  get disabled () {
    return this[SessionModel.FIELD_DISABLED]
  }

  set disabled (value) {
    this[SessionModel.FIELD_DISABLED] = value
  }

  get exported () {
    return this[SessionModel.FIELD_EXPORTED]
  }

  set exported (value) {
    this[SessionModel.FIELD_EXPORTED] = value
  }

  get codes () {
    return this[SessionModel.FIELD_CODES]
  }

  set codes (value) {
    this[SessionModel.FIELD_CODES] = value
  }

  static newInstance (id, time, operator, storingPlace, operation, disabled, codes) {
    let instance = new SessionModel()
    instance.id = id
    instance.time = time
    instance.operator = operator
    instance.storingPlace = storingPlace
    instance.operation = operation
    instance.disabled = disabled
    instance.codes = codes
    return instance
  }

  static create (realm, time, operator, storingPlace, operation, disabled, codes) {
    let max = realm.objects(SessionModel.name).max(SessionModel.FIELD_ID) || 0
    return realm.create(SessionModel.name,
      SessionModel.newInstance(max + 1, time, operator, storingPlace, operation, disabled, codes))
  }

  static getSortedByDate (realm, reverse) {
    return realm.objects(SessionModel.name).sorted(SessionModel.FIELD_TIME, reverse)
  }

  static getOpenedSession (realm) {
    let sessions = SessionModel.getSortedByDate(realm, true).filtered(`${SessionModel.FIELD_DISABLED} = false`)
    if (sessions.length) return sessions[0]
    else return null
  }

  static findSessionByKey (realm, sessionKey) {
    return realm.objectForPrimaryKey(SessionModel.name, sessionKey)
  }

  static findCodeByName (session, codeName) {
    if (session) {
      let collisionCode = session.codes.filtered(`${CodeModel.FIELD_NAME} = '${codeName}'`)
      if (collisionCode.length) return collisionCode[0]
    }
    return null
  }
}

SessionModel.schema = {
  name: SessionModel.name,
  primaryKey: SessionModel.FIELD_ID,
  properties: {
    [SessionModel.FIELD_ID]: {type: 'int'},
    [SessionModel.FIELD_TIME]: {type: 'date'},
    [SessionModel.FIELD_OPERATOR]: {type: OperatorModel.name},
    [SessionModel.FIELD_STORING_PLACE]: {type: StoringPlaceModel.name},
    [SessionModel.FIELD_OPERATION]: {type: OperationModel.name},
    [SessionModel.FIELD_DISABLED]: {type: 'bool'},
    [SessionModel.FIELD_CODES]: {type: 'list', objectType: CodeModel.name}
  }
}