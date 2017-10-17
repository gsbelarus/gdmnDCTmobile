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
    const sessions = SessionModel.getSortedByDate(this.realm)
    for (let i = 0; i < sessions.length; i++) {
      const session = sessions[i]
      if (!session.exported) {
        const response = await this._api.all('sessions').post(session)
        if (response.body().data().ok) {
          this.realm.write(() => session.exported = true)
        }
      }
    }
  }
}