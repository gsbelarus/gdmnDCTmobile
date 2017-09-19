export default class SettingsModel {

  static DEFAULT_ID = 1
  static DEFAULT_MAX_COUNT_SESSION = 50

  static FIELD_ID = '_id'
  static FIELD_MAX_COUNT_SESSION = '_maxCountSession'

  static schema = {
    name: SettingsModel.name,
    primaryKey: SettingsModel.FIELD_ID,
    properties: {
      [SettingsModel.FIELD_ID]: {type: 'int', default: SettingsModel.DEFAULT_ID},
      [SettingsModel.FIELD_MAX_COUNT_SESSION]: {type: 'int', default: SettingsModel.DEFAULT_MAX_COUNT_SESSION}
    }
  }

  get id () {
    return this[SettingsModel.FIELD_ID]
  }

  set id (value) {
    this[SettingsModel.FIELD_ID] = value
  }

  get maxCountSession () {
    if (this[SettingsModel.FIELD_MAX_COUNT_SESSION] < 0) return 0
    return this[SettingsModel.FIELD_MAX_COUNT_SESSION]
  }

  set maxCountSession (value) {
    if (value < 0) value = 0
    this[SettingsModel.FIELD_MAX_COUNT_SESSION] = value
  }

  static newInstance (id, maxCountSession) {
    let instance = new SettingsModel()
    instance.id = id
    instance.maxCountSession = maxCountSession
    return instance
  }

  static init (realm) {
    realm.create(SettingsModel.name,
      SettingsModel.newInstance(SettingsModel.DEFAULT_ID, SettingsModel.DEFAULT_MAX_COUNT_SESSION))
  }

  static getSettings (realm) {
    let settings = realm.objectForPrimaryKey(SettingsModel.name, SettingsModel.DEFAULT_ID)
    if (!settings) {
      if (realm.isInTransaction) {
        SettingsModel.init(realm)
      } else {
        realm.write(() => SettingsModel.init(realm))
      }
      settings = SettingsModel.getSettings(realm)
    }
    return settings
  }
}