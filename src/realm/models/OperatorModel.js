export default class OperatorModel {

  static NAME_MAX_LENGTH = 20

  static FIELD_ID = '_id'
  static FIELD_NAME = '_name'
  static FIELD_DISABLED = '_disabled'

  static schema = {
    name: OperatorModel.name,
    primaryKey: OperatorModel.FIELD_ID,
    properties: {
      [OperatorModel.FIELD_ID]: {type: 'int'},
      [OperatorModel.FIELD_NAME]: {type: 'string'},
      [OperatorModel.FIELD_DISABLED]: {type: 'bool'}
    }
  }

  static newInstance (id, name, disabled) {
    let instance = new OperatorModel()
    instance.id = id
    instance.name = name
    instance.disabled = disabled
    return instance
  }

  static create (realm, name, disabled) {
    let max = 0
    realm.objects(OperatorModel.name).forEach((i) => {max < i.id ? max = i.id : 0})
    return realm.create(OperatorModel.name, OperatorModel.newInstance(max + 1, name, disabled))
  }

  static getSortedByName (realm, reverse) {
    return realm.objects(OperatorModel.name)
      .sorted(OperatorModel.FIELD_NAME, reverse)
      .sorted(OperatorModel.FIELD_DISABLED)
  }

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
}