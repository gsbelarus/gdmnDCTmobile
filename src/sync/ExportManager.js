import restful from 'restful.js/dist/restful.standalone'
import SessionModel from '../realm/models/SessionModel'
import SettingModel from '../realm/models/SettingsModel'

export default class ExportManager {

  constructor (realm) {
    this._realm = realm
  }

  get realm () {
    return this._realm
  }

  set realm (value) {
    this._realm = value
  }

  get _api () {
    let settings = SettingModel.getSettings(this.realm)
    return restful(settings.fullUrl)
  }

  async exportAll () {
    try {
      const sessions = SessionModel.getSortedByDate(this.realm)
      for (let i = 0; i < sessions.length; i++) {
        const session = sessions[i]
        if (!session.exported) {
          await this._api.all('sessions').post(sessions[i])
          this.realm.write(() => sessions[i].exported = true)
        }
      }
    } catch (error) {
      throw error
    }
  }
}