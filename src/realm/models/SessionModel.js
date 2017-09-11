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

  static FIELD_CODES = '_codes'

  static schema = {
    name: SessionModel.name,
    primaryKey: SessionModel.FIELD_ID,
    properties: {
      [SessionModel.FIELD_ID]: {type: 'int'},
      [SessionModel.FIELD_TIME]: {type: 'date'},
      [SessionModel.FIELD_OPERATOR]: {type: OperatorModel.name, optional: true},
      [SessionModel.FIELD_STORING_PLACE]: {type: StoringPlaceModel.name, optional: true},
      [SessionModel.FIELD_OPERATION]: {type: OperationModel.name, optional: true},
      [SessionModel.FIELD_DISABLED]: {type: 'bool'},
      [SessionModel.FIELD_CODES]: {type: 'list', objectType: CodeModel.name}
    }
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
    let max = 0
    realm.objects(SessionModel.name).forEach((i) => {max < i.id ? max = i.id : 0})
    return realm.create(SessionModel.name, SessionModel.newInstance(max + 1, time, operator, storingPlace, operation,
      disabled, codes))
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

  static findCodeByKey (session, codeKey) {
    if (session) {
      let collisionCode = session.codes.filtered(`${CodeModel.FIELD_ID} = '${codeKey}'`)
      if (collisionCode.length) return collisionCode[0]
    }
    return null
  }

  static findCodeByName (session, codeName) {
    if (session) {
      let collisionCode = session.codes.filtered(`${CodeModel.FIELD_NAME} = '${codeName}'`)
      if (collisionCode.length) return collisionCode[0]
    }
    return null
  }

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

  get codes () {
    return this[SessionModel.FIELD_CODES]
  }

  set codes (value) {
    this[SessionModel.FIELD_CODES] = value
  }
}