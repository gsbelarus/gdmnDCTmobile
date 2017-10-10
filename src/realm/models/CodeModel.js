export default class CodeModel {

  static NAME_MAX_LENGTH = 60

  static FIELD_ID = '_id'
  static FIELD_NAME = '_name'

  get id () {
    return this[CodeModel.FIELD_ID]
  }

  set id (value) {
    this[CodeModel.FIELD_ID] = value
  }

  get name () {
    return this[CodeModel.FIELD_NAME]
  }

  set name (value) {
    if (value && value.length > CodeModel.NAME_MAX_LENGTH) {
      throw new Error(`Length must be less than ${CodeModel.NAME_MAX_LENGTH}`)
    }
    this[CodeModel.FIELD_NAME] = value
  }

  static newInstance (id, name) {
    let instance = new CodeModel()
    instance.id = id
    instance.name = name
    return instance
  }

  static create (realm, name) {
    let max = realm.objects(CodeModel.name).max(CodeModel.FIELD_ID) || 0
    return realm.create(CodeModel.name, CodeModel.newInstance(max + 1, name))
  }
}

CodeModel.schema = {
  name: CodeModel.name,
  primaryKey: CodeModel.FIELD_ID,
  properties: {
    [CodeModel.FIELD_ID]: {type: 'int'},
    [CodeModel.FIELD_NAME]: {type: 'string'}
  }
}