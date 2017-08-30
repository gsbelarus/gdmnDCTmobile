export default class OperationModel {

  static NAME_MAX_LENGTH = 60
  static CODE_MAX_LENGTH = 20

  static FIELD_ID = '_id'
  static FIELD_NAME = '_name'
  static FIELD_CODE = '_code'
  static FIELD_SORT_NUMBER = '_sortNumber'
  static FIELD_DISABLED = '_disabled'

  static schema = {
    name: OperationModel.name,
    primaryKey: OperationModel.FIELD_ID,
    properties: {
      [OperationModel.FIELD_ID]: {type: 'int'},
      [OperationModel.FIELD_NAME]: {type: 'string'},
      [OperationModel.FIELD_CODE]: {type: 'string', optional: true},
      [OperationModel.FIELD_SORT_NUMBER]: {type: 'string', optional: true},
      [OperationModel.FIELD_DISABLED]: {type: 'bool'}
    }
  }

  static newInstance (id, name, code, sortNumber, disabled) {
    let instance = new OperationModel()
    instance.id = id
    instance.name = name
    instance.code = code
    instance.sortNumber = sortNumber
    instance.disabled = disabled
    return instance
  }

  static create (realm, update, name, code, sortNumber, disabled) {
    let max = 0
    realm.objects(OperationModel.name).forEach((i) => {max < i.id ? max = i.id : 0})
    return realm.create(OperationModel.name, OperationModel.newInstance(max + 1, name, code, sortNumber, disabled), update)
  }

  static getEnabledObjects (realm) {
    return realm.objects(OperationModel.name)
      .filtered(`${OperationModel.FIELD_DISABLED} = false`)
  }

  static getSortedBySortNumber (realm, reverse) {
    return OperationModel.getEnabledObjects(realm)
      .sorted(OperationModel.FIELD_SORT_NUMBER, reverse)
  }

  get id () {
    return this[OperationModel.FIELD_ID]
  }

  set id (value) {
    this[OperationModel.FIELD_ID] = value
  }

  get name () {
    return this[OperationModel.FIELD_NAME]
  }

  set name (value) {
    if (value && value.length > OperationModel.NAME_MAX_LENGTH) {
      throw new Error(`Length must be less than ${OperationModel.NAME_MAX_LENGTH}`)
    }
    this[OperationModel.FIELD_NAME] = value
  }

  get code () {
    return this[OperationModel.FIELD_CODE]
  }

  set code (value) {
    if (value && value.length > OperationModel.CODE_MAX_LENGTH) {
      throw new Error(`Length must be less than ${OperationModel.CODE_MAX_LENGTH}`)
    }
    this[OperationModel.FIELD_CODE] = value
  }

  get sortNumber () {
    return this[OperationModel.FIELD_SORT_NUMBER]
  }

  set sortNumber (value) {
    this[OperationModel.FIELD_SORT_NUMBER] = value
  }

  get disabled () {
    return this[OperationModel.FIELD_DISABLED]
  }

  set disabled (value) {
    this[OperationModel.FIELD_DISABLED] = value
  }
}