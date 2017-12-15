export default class StoringPlaceModel {

  static NAME_MAX_LENGTH = 180
  static CODE_MAX_LENGTH = 20

  static FIELD_ID = '_id'
  static FIELD_NAME = '_name'
  static FIELD_CODE = '_code'
  static FIELD_DISABLED = '_disabled'

  static FIELD_SEARCH_FIELD = '_searchField'

  get id () {
    return this[StoringPlaceModel.FIELD_ID]
  }

  set id (value) {
    this[StoringPlaceModel.FIELD_ID] = value
  }

  get name () {
    return this[StoringPlaceModel.FIELD_NAME]
  }

  set name (value) {
    if (value && value.length > StoringPlaceModel.NAME_MAX_LENGTH) {
      throw new Error(`Length must be less than ${StoringPlaceModel.NAME_MAX_LENGTH}`)
    }
    this[StoringPlaceModel.FIELD_NAME] = value
    this.bindSearchTextField()
  }

  get code () {
    return this[StoringPlaceModel.FIELD_CODE]
  }

  set code (value) {
    if (value && value.length > StoringPlaceModel.CODE_MAX_LENGTH) {
      throw new Error(`Length must be less than ${StoringPlaceModel.CODE_MAX_LENGTH}`)
    }
    this[StoringPlaceModel.FIELD_CODE] = value
    this.bindSearchTextField()
  }

  get disabled () {
    return this[StoringPlaceModel.FIELD_DISABLED]
  }

  set disabled (value) {
    this[StoringPlaceModel.FIELD_DISABLED] = value
  }

  get searchField () {
    return this[StoringPlaceModel.FIELD_SEARCH_FIELD]
  }

  set searchField (value) {
    this[StoringPlaceModel.FIELD_SEARCH_FIELD] = value
  }

  static newInstance (id, name, code, disabled) {
    let instance = new StoringPlaceModel()
    instance.id = id
    instance.name = name
    instance.code = code
    instance.disabled = disabled
    return instance
  }

  static create (realm, name, code, disabled) {
    let max = realm.objects(StoringPlaceModel.schema.name).max(StoringPlaceModel.FIELD_ID) || 0
    return realm.create(StoringPlaceModel.schema.name, StoringPlaceModel.newInstance(max + 1, name, code, disabled))
  }

  static getEnabledObjects (realm) {
    return realm.objects(StoringPlaceModel.schema.name)
      .filtered(`${StoringPlaceModel.FIELD_DISABLED} = false`)
  }

  static getSortedByName (realm, reverse) {
    return StoringPlaceModel.getEnabledObjects(realm)
      .sorted(StoringPlaceModel.FIELD_NAME, reverse)
  }

  static getObject(realm, key) {
    return realm.objectForPrimaryKey(StoringPlaceModel.schema.name, key)
  }

  static search (items, search) {
    if (!search) return items
    return items.filtered(`${StoringPlaceModel.FIELD_SEARCH_FIELD} CONTAINS[c] "${search.toLowerCase()}"`)
  }

  bindSearchTextField () {
    this.searchField =
      (this.name && this.name.toLowerCase()) +
      (this.code && this.code.toLowerCase())
  }
}

StoringPlaceModel.schema = {
  name: 'StoringPlaceModel',
  primaryKey: StoringPlaceModel.FIELD_ID,
  properties: {
    [StoringPlaceModel.FIELD_ID]: 'int',
    [StoringPlaceModel.FIELD_NAME]: 'string',
    [StoringPlaceModel.FIELD_CODE]: 'string?',
    [StoringPlaceModel.FIELD_DISABLED]: 'bool?',

    [StoringPlaceModel.FIELD_SEARCH_FIELD]: 'string'
  }
}