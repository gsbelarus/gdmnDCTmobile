export default class SettingsModel {

  static URL_SCHEMA_PATTERN = new RegExp('^(https?:\\/\\/)')
  static URL_PATTERN = new RegExp(
    '^(https?:\\/\\/)?' +                                     // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' +     // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' +                           // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +                       // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' +                              // query string
    '(\\#[-a-z\\d_]*)?$', 'i'                                 // fragment locator
  )

  static DEFAULT_ID = 1
  static DEFAULT_MAX_COUNT_SESSION = 50

  static FIELD_ID = '_id'
  static FIELD_MAX_COUNT_SESSION = '_maxCountSession'
  static FIELD_URL = '_url'

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

  get fullUrl () {
    if (SettingsModel.URL_SCHEMA_PATTERN.test(this[SettingsModel.FIELD_URL])) {
      return this[SettingsModel.FIELD_URL]
    }
    return `http://${this[SettingsModel.FIELD_URL]}/api/v1`
  }

  get url () {
    return this[SettingsModel.FIELD_URL]
  }

  set url (value) {
    if (!SettingsModel.URL_PATTERN.test(value)) {
      throw new Error('Invalid URL')
    }
    this[SettingsModel.FIELD_URL] = value
  }

  static newInstance (id = SettingsModel.DEFAULT_ID,
                      maxCountSession = SettingsModel.DEFAULT_MAX_COUNT_SESSION,
                      url) {
    let instance = new SettingsModel()
    instance.id = id
    instance.maxCountSession = maxCountSession
    instance.url = url
    return instance
  }

  static init (realm) {
    realm.create(SettingsModel.name, SettingsModel.newInstance())
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

SettingsModel.schema = {
  name: SettingsModel.name,
  primaryKey: SettingsModel.FIELD_ID,
  properties: {
    [SettingsModel.FIELD_ID]: {type: 'int', default: SettingsModel.DEFAULT_ID},
    [SettingsModel.FIELD_MAX_COUNT_SESSION]: {type: 'int', default: SettingsModel.DEFAULT_MAX_COUNT_SESSION},
    [SettingsModel.FIELD_URL]: {type: 'string', optional: true}
  }
}