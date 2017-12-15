export default class OperatorModel {

  static NAME_MAX_LENGTH = 60

  static FIELD_ID = '_id'
  static FIELD_NAME = '_name'
  static FIELD_DISABLED = '_disabled'

  get id () {
    return this[OperatorModel.FIELD_ID]
  }

  set id (value) {
    this[OperatorModel.FIELD_ID] = value
  }

  get name () {
    return this[OperatorModel.FIELD_NAME]
  }

  set name (value) {
    if (value && value.length > OperatorModel.NAME_MAX_LENGTH) {
      throw new Error(`Length must be less than ${OperatorModel.NAME_MAX_LENGTH}`)
    }
    this[OperatorModel.FIELD_NAME] = value
  }

  get disabled () {
    return this[OperatorModel.FIELD_DISABLED]
  }

  set disabled (value) {
    this[OperatorModel.FIELD_DISABLED] = value
  }

  static newInstance (id, name, disabled) {
    let instance = new OperatorModel()
    instance.id = id
    instance.name = name
    instance.disabled = disabled
    return instance
  }

  static create (realm, name, disabled) {
    let max = realm.objects(OperatorModel.schema.name).max(OperatorModel.FIELD_ID) || 0
    return realm.create(OperatorModel.schema.name, OperatorModel.newInstance(max + 1, name, disabled))
  }

  static getEnabledObjects (realm) {
    return realm.objects(OperatorModel.schema.name)
      .filtered(`${OperatorModel.FIELD_DISABLED} = false`)
  }

  static getSortedByName (realm, reverse) {
    return OperatorModel.getEnabledObjects(realm)
      .sorted(OperatorModel.FIELD_NAME, reverse)
  }
}

OperatorModel.schema = {
  name: 'OperatorModel',
  primaryKey: OperatorModel.FIELD_ID,
  properties: {
    [OperatorModel.FIELD_ID]: 'int',
    [OperatorModel.FIELD_NAME]: 'string',
    [OperatorModel.FIELD_DISABLED]: 'bool'
  }
}