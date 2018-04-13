import OperatorModel from './OperatorModel'
import OperationModel from './OperationModel'
import CodeModel from './CodeModel'

export default class SessionModel {

  static DEFAULT_EXPORTED = false

  static FIELD_ID = '_id'
  static FIELD_TIME = '_time'
  static FIELD_OPERATOR = '_operator'
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

  static newInstance (id,
                      time,
                      operator,
                      operation,
                      disabled = false,
                      codes = [],
                      exported = SessionModel.DEFAULT_EXPORTED) {
    let instance = new SessionModel()
    instance.id = id
    instance.time = time
    instance.operator = operator
    instance.operation = operation
    instance.disabled = disabled
    instance.exported = exported
    instance.codes = codes
    return instance
  }

  static create (realm, time, operator, operation, disabled, codes) {
    let max = realm.objects(SessionModel.schema.name).max(SessionModel.FIELD_ID) || 0
    return realm.create(SessionModel.schema.name,
      SessionModel.newInstance(max + 1, time, operator, operation, disabled, codes))
  }

  static getSortedByDate (realm, reverse) {
    const s = realm.objects(SessionModel.schema.name)
    return s.sorted(SessionModel.FIELD_TIME, reverse)
  }

  static getExported (realm) {
    return SessionModel.getSortedByDate(realm).filter((item) => item.exported)
  }

  static getOpenedSession (realm) {
    let sessions = SessionModel.getSortedByDate(realm, true).filtered(`${SessionModel.FIELD_DISABLED} = false`)
    if (sessions.length) return sessions[0]
    else return null
  }

  static findSessionByKey (realm, sessionKey) {
    return realm.objectForPrimaryKey(SessionModel.schema.name, sessionKey)
  }
}

SessionModel.schema = {
  name: 'SessionModel',
  primaryKey: SessionModel.FIELD_ID,
  properties: {
    [SessionModel.FIELD_ID]: 'int',
    [SessionModel.FIELD_TIME]: 'date',
    [SessionModel.FIELD_OPERATOR]: `${OperatorModel.schema.name}`,
    [SessionModel.FIELD_OPERATION]: `${OperationModel.schema.name}`,
    [SessionModel.FIELD_DISABLED]: 'bool',
    [SessionModel.FIELD_EXPORTED]: 'bool',
    [SessionModel.FIELD_CODES]: `${CodeModel.schema.name}[]`
  }
}