import React from 'react'
import DeviceInfo from 'react-native-device-info'
import DialogAndroid from 'react-native-dialogs'
import strings, {
  STRING_ACTION_CANCEL,
  STRING_ACTION_OK,
  STRING_NOTIFICATION,
  STRING_SETTINGS_ABOUT,
  STRING_SETTINGS_ABOUT_CONTENT,
  STRING_SETTINGS_COUNT_SESSION_DESCRIPTION,
  STRING_SETTINGS_COUNT_SESSION_HINT,
  STRING_SETTINGS_COUNT_SESSION_OVERFLOW,
  STRING_SETTINGS_COUNT_SESSION_PRIMARY,
  STRING_SETTINGS_COUNT_SESSION_SECONDARY,
  STRING_SETTINGS_SYNC_PRIMARY,
  STRING_SETTINGS_SYNC_SECONDARY,
  STRING_SETTINGS_URL_HINT,
  STRING_SETTINGS_URL_INVALID,
  STRING_SETTINGS_URL_PRIMARY,
  STRING_SETTINGS_URL_SECONDARY
} from '../localization/strings'
import connectRealm from '../realm/react/connectRealm'
import { updateStoredSessionsQuantity } from '../realm/utils'
import List from '../components/List/index'
import ListItem from '../components/ListItem/index'
import SettingModel from '../realm/models/SettingsModel'
import SessionModel from '../realm/models/SessionModel'
import { formatDate } from '../localization/utils'

export default connectRealm(
  (realm, ownProps) => ({
    setting: SettingModel.getSettings(realm),
    syncData: ownProps.syncData,
    updateMaxCountSession: (maxCountSession) => {
      if (maxCountSession > 0 && SessionModel.getSortedByDate(realm).length > maxCountSession) {
        let dialog = new DialogAndroid()
        dialog.set({
          title: strings(STRING_NOTIFICATION),
          content: strings(STRING_SETTINGS_COUNT_SESSION_OVERFLOW),
          positiveText: strings(STRING_ACTION_OK),
          negativeText: strings(STRING_ACTION_CANCEL),
          onPositive: () => updateMaxCountSessions(realm, maxCountSession)
        })
        dialog.show()
      } else {
        updateMaxCountSessions(realm, maxCountSession)
      }
    },
    updateUrl: (url) => {
      try {
        updateUrl(realm, url)
      } catch (error) {
        console.warn(error)
        let dialog = new DialogAndroid()
        dialog.set({
          title: strings(STRING_NOTIFICATION),
          content: strings(STRING_SETTINGS_URL_INVALID),
          positiveText: strings(STRING_ACTION_OK)
        })
        dialog.show()
      }
    },
    renderItem: ({item}) => (
      <ListItem
        id={item.id}
        itemDisabled={item.disabled}
        primaryText={item.primaryText}
        secondaryText={item.secondaryText}
        onItemPress={item.onItemPress}
        style={{paddingLeft: 64}}/>
    )
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData, separator: () => null}),
  (mapRealmProps, mapProps, ownProps) => ({
    ...mapRealmProps,
    ...mapProps,
    items: getItems(mapRealmProps)
  })
)(List)

function getItems (mapRealmProps) {
  const items = [{
    primaryText: strings(STRING_SETTINGS_COUNT_SESSION_PRIMARY),
    secondaryText: strings(STRING_SETTINGS_COUNT_SESSION_SECONDARY, {
      count: mapRealmProps.setting.maxCountSession !== 0 ? mapRealmProps.setting.maxCountSession : '∞'
    }),
    onItemPress: () => {
      let dialog = new DialogAndroid()
      dialog.set({
        title: strings(STRING_SETTINGS_COUNT_SESSION_PRIMARY),
        content: strings(STRING_SETTINGS_COUNT_SESSION_DESCRIPTION),
        positiveText: strings(STRING_ACTION_OK),
        negativeText: strings(STRING_ACTION_CANCEL),
        input: {
          hint: strings(STRING_SETTINGS_COUNT_SESSION_HINT),
          prefill: `${mapRealmProps.setting.maxCountSession}`,
          allowEmptyInput: false,
          type: 2,
          callback: (input) => mapRealmProps.updateMaxCountSession(+input)
        }
      })
      dialog.show()
    }
  }, {
    primaryText: strings(STRING_SETTINGS_URL_PRIMARY),
    secondaryText: mapRealmProps.setting.url ? mapRealmProps.setting.url : strings(STRING_SETTINGS_URL_SECONDARY),
    onItemPress: () => {
      let dialog = new DialogAndroid()
      dialog.set({
        title: strings(STRING_SETTINGS_URL_PRIMARY),
        positiveText: strings(STRING_ACTION_OK),
        negativeText: strings(STRING_ACTION_CANCEL),
        input: {
          hint: strings(STRING_SETTINGS_URL_HINT),
          prefill: mapRealmProps.setting.url,
          callback: mapRealmProps.updateUrl
        }
      })
      dialog.show()
    }
  }, {
    primaryText: strings(STRING_SETTINGS_SYNC_PRIMARY),
    secondaryText: mapRealmProps.setting.lastSyncDate
      ? strings(STRING_SETTINGS_SYNC_SECONDARY,
        {date: formatDate(mapRealmProps.setting.lastSyncDate, 'Do MMMM YYYY, HH:mm')})
      : null,
    disabled: !mapRealmProps.setting.url,
    onItemPress: mapRealmProps.syncData
  }, {
    primaryText: strings(STRING_SETTINGS_ABOUT),
    onItemPress: () => {
      let dialog = new DialogAndroid()
      dialog.set({
        title: `${require('../../app.json').displayName} v${DeviceInfo.getVersion()}`,
        content: strings(STRING_SETTINGS_ABOUT_CONTENT, {versionCode: DeviceInfo.getBuildNumber()}),
        positiveText: strings(STRING_ACTION_OK)
      })
      dialog.show()
    }
  }]

  items.forEach((item, index) => item.id = index)

  return items
}

function updateMaxCountSessions (realm, maxCountSession) {
  let settings = SettingModel.getSettings(realm)
  realm.write(() => {
    settings.maxCountSession = maxCountSession
    updateStoredSessionsQuantity(realm, maxCountSession)
  })
}

function updateUrl (realm, url) {
  const settings = SettingModel.getSettings(realm)
  realm.write(() => settings.url = url)
}