import StoringPlaceModel from './StoringPlaceModel'
import SessionModel from './SessionModel'

export default class CodeModel {

  static NAME_MAX_LENGTH = 60

  static FIELD_ID = '_id'
  static FIELD_NAME = '_name'
  static FIELD_STORING_PLACE = '_storingPlace'

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

  get storingPlace () {
    return this[CodeModel.FIELD_STORING_PLACE]
  }

  set storingPlace (value) {
    this[CodeModel.FIELD_STORING_PLACE] = value
  }

  static newInstance (id, name, storingPlace) {
    let instance = new CodeModel()
    instance.id = id
    instance.name = name
    instance.storingPlace = storingPlace
    return instance
  }

  static create (realm, name, storingPlace) {
    let max = realm.objects(CodeModel.schema.name).max(CodeModel.FIELD_ID) || 0
    if (!storingPlace) {
      storingPlace = this.getDefaultStoringPlace(realm)
    }
    return realm.create(CodeModel.schema.name, CodeModel.newInstance(max + 1, name, storingPlace))
  }

  static getDefaultStoringPlace (realm) {
    const session = SessionModel.getOpenedSession(realm)
    if (session && session.codes.length) {
      const lastCode = session.codes[0]
      return lastCode.storingPlace
    } else {
      const storingPlaces = StoringPlaceModel.getSortedByName(realm)
      if (storingPlaces.length) {
        return storingPlaces[0]
      }
    }
  }
}

CodeModel.schema = {
  name: 'CodeModel',
  primaryKey: CodeModel.FIELD_ID,
  properties: {
    [CodeModel.FIELD_ID]: 'int',
    [CodeModel.FIELD_NAME]: 'string',
    [CodeModel.FIELD_STORING_PLACE]: `${StoringPlaceModel.schema.name}`,
  }
}