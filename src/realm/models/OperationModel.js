export default class OperationModel {

  static NAME_MAX_LENGTH = 60
  static CODE_MAX_LENGTH = 20

  static FIELD_ID = '_id'
  static FIELD_NAME = '_name'
  static FIELD_CODE = '_code'
  static FIELD_SORT_NUMBER = '_sortNumber'
  static FIELD_DISABLED = '_disabled'

  static FIELD_SEARCH_FIELD = '_searchField'

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
    this.bindSearchTextField()
  }

  get code () {
    return this[OperationModel.FIELD_CODE]
  }

  set code (value) {
    if (value && value.length > OperationModel.CODE_MAX_LENGTH) {
      throw new Error(`Length must be less than ${OperationModel.CODE_MAX_LENGTH}`)
    }
    this[OperationModel.FIELD_CODE] = value
    this.bindSearchTextField()
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

  get searchField () {
    return this[OperationModel.FIELD_SEARCH_FIELD]
  }

  set searchField (value) {
    this[OperationModel.FIELD_SEARCH_FIELD] = value
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
    let max = realm.objects(OperationModel.name).max(OperationModel.FIELD_ID) || 0
    return realm.create(OperationModel.name,
      OperationModel.newInstance(max + 1, name, code, sortNumber, disabled),
      update)
  }

  static getEnabledObjects (realm) {
    return realm.objects(OperationModel.name)
      .filtered(`${OperationModel.FIELD_DISABLED} = false`)
  }

  static getSortedBySortNumber (realm, reverse) {
    return OperationModel.getEnabledObjects(realm)
      .sorted(OperationModel.FIELD_SORT_NUMBER, reverse)
  }

  static search (items, search) {
    if (!search) return items
    return items.filtered(`${OperationModel.FIELD_SEARCH_FIELD} CONTAINS[c] "${search.toLowerCase()}"`)
  }

  bindSearchTextField () {
    this.searchField =
      (this.name && this.name.toLowerCase()) +
      (this.code && this.code.toLowerCase())
  }
}

OperationModel.schema = {
  name: OperationModel.name,
  primaryKey: OperationModel.FIELD_ID,
  properties: {
    [OperationModel.FIELD_ID]: {type: 'int'},
    [OperationModel.FIELD_NAME]: {type: 'string'},
    [OperationModel.FIELD_CODE]: {type: 'string', optional: true},
    [OperationModel.FIELD_SORT_NUMBER]: {type: 'int', optional: true},
    [OperationModel.FIELD_DISABLED]: {type: 'bool'},

    [OperationModel.FIELD_SEARCH_FIELD]: {type: 'string'}
  }
}