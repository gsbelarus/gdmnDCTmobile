import ScannerApi from 'react-native-android-scanner'
import DialogAndroid from 'react-native-dialogs'
import Snackbar from 'react-native-snackbar'
import strings, {
  STRING_ACTION_CANCEL,
  STRING_ACTION_CLOSE_SESSION,
  STRING_ACTION_CONFIRM,
  STRING_ACTION_DELETE,
  STRING_ACTION_OK,
  STRING_ACTION_OPEN_SESSION,
  STRING_ACTION_REPEAT,
  STRING_ERROR_CLOSING_SESSION,
  STRING_ERROR_NO_CONNECTION,
  STRING_ERROR_SYNC,
  STRING_NOTIFICATION,
  STRING_NOTIFICATION_SCANNING,
  STRING_PROGRESS_CLOSING_SESSION,
  STRING_PROGRESS_DELETING_SESSION,
  STRING_PROGRESS_OPENING_SESSION,
  STRING_PROGRESS_SYNC,
  STRING_PROGRESS_VERIFY_APP,
  STRING_SETTINGS_URL_HINT,
  STRING_SETTINGS_URL_INVALID,
  STRING_SETTINGS_URL_PRIMARY
} from '../../localization/strings'
import { NavigationService } from '../../NavigationService'
import { SESSIONS_SCREEN } from '../../navigators/MainNavigator'
import { SCANNER } from '../../navigators/ScannerNavigator'
import SessionModel from '../../realm/models/SessionModel'
import SettingsModel from '../../realm/models/SettingsModel'
import { updateStoredSessionsQuantity } from '../../realm/utils'
import ExportManager from '../../sync/ExportManager'
import ImportManager from '../../sync/ImportManager'
import { addToProgress, removeFromProgress } from './progressActions'

export function init (realm) {
  return async (dispatch, getState) => {
    const progress = {message: strings(STRING_PROGRESS_VERIFY_APP)}
    dispatch(addToProgress(progress))

    // let isSupported = await ScannerApi.isDeviceSupported()
    //
    // if (!isSupported) {
    //   dispatch(reset(0,
    //     [navigate(ERROR,
    //       {
    //         message: strings(STRING_ERROR_DEVICE_NOT_SUPPORTED),
    //         icon: 'sentiment-very-dissatisfied'
    //       }
    //     )]
    //   ))
    // } else {
    await checkOpenedSession(realm)
    const settings = SettingsModel.getSettings(realm)
    if (!settings.url) {
      showEditUrlDialog(realm)
    }
    // }

    dispatch(removeFromProgress(progress))
  }
}

function showEditUrlDialog (realm) {
  const settings = SettingsModel.getSettings(realm)

  function updateUrl (url) {
    try {
      realm.write(() => settings.url = url)
    } catch (error) {
      console.warn(error)
      let dialog = new DialogAndroid()
      dialog.set({
        title: strings(STRING_NOTIFICATION),
        content: strings(STRING_SETTINGS_URL_INVALID),
        positiveText: strings(STRING_ACTION_REPEAT),
        cancelable: false,
        onPositive: () => showEditUrlDialog(realm)
      })
      dialog.show()
    }
  }

  let dialog = new DialogAndroid()
  dialog.set({
    title: strings(STRING_SETTINGS_URL_PRIMARY),
    positiveText: strings(STRING_ACTION_OK),
    cancelable: false,
    input: {
      hint: strings(STRING_SETTINGS_URL_HINT),
      prefill: settings.url,
      callback: updateUrl
    }
  })
  dialog.show()
}

export function syncData (realm) {
  return async (dispatch, getState) => {
    const progress = {message: strings(STRING_PROGRESS_SYNC)}
    dispatch(addToProgress(progress))
    try {
      await new ExportManager(realm).exportAll()
      await new ImportManager(realm).importAll()
      const settings = SettingsModel.getSettings(realm)
      realm.write(() => settings.lastSyncDate = new Date())

    } catch (error) {
      console.warn(error)
      Snackbar.show({
        title: error.message === 'Network request failed'
          ? strings(STRING_ERROR_NO_CONNECTION)
          : strings(STRING_ERROR_SYNC),
        duration: Snackbar.LENGTH_LONG,
        action: {
          title: strings(STRING_ACTION_REPEAT),
          color: 'red',
          onPress: () => dispatch(syncData(realm)),
        }
      })
    } finally {
      dispatch(removeFromProgress(progress))
    }
  }
}

export function createSession (realm, operator, operation) {
  return (dispatch, getState) => {
    let dialog = new DialogAndroid()
    dialog.set({
      title: strings(STRING_NOTIFICATION),
      content: strings(STRING_ACTION_OPEN_SESSION) + '?',
      positiveText: strings(STRING_ACTION_CONFIRM),
      negativeText: strings(STRING_ACTION_CANCEL),
      onPositive: async () => {
        const progress = {message: strings(STRING_PROGRESS_OPENING_SESSION)}
        dispatch(addToProgress(progress))

        try {
          if (!SessionModel.getOpenedSession(realm)) {
            realm.write(() => {
              SessionModel.create(realm, new Date(), operator, operation)
              updateStoredSessionsQuantity(realm, SettingsModel.getSettings(realm).maxCountSession)
            })
          }
          await checkOpenedSession(realm)
        } catch (error) {
          console.warn(error)
        }

        dispatch(removeFromProgress(progress))
      }
    })
    dialog.show()
  }
}

export function deleteSessionDetail (realm, sessionKey) {
  return (dispatch, getState) => {
    if (!sessionKey) return

    let dialog = new DialogAndroid()
    dialog.set({
      title: strings(STRING_NOTIFICATION),
      content: strings(STRING_ACTION_DELETE) + '?',
      positiveText: strings(STRING_ACTION_CONFIRM),
      negativeText: strings(STRING_ACTION_CANCEL),
      onPositive: () => {
        NavigationService.back()

        const session = SessionModel.findSessionByKey(realm, sessionKey)
        if (session) {
          const progress = {message: strings(STRING_PROGRESS_DELETING_SESSION)}
          dispatch(addToProgress(progress))

          realm.write(() => {
            realm.delete(session.codes)
            realm.delete(session)
          })

          dispatch(removeFromProgress(progress))
        }
      }
    })
    dialog.show()
  }
}

export function closeSession (realm) {
  return (dispatch, getState) => {

    async function onConfirmed () {
      const progress = {message: strings(STRING_PROGRESS_CLOSING_SESSION)}
      dispatch(addToProgress(progress))
      try {
        const session = SessionModel.getOpenedSession(realm)
        realm.write(() => session.disabled = true)
        await checkOpenedSession(realm)

      } catch (error) {
        console.warn(error)
        Snackbar.show({
          title: strings(STRING_ERROR_CLOSING_SESSION),
          duration: Snackbar.LENGTH_INDEFINITE,
          action: {
            title: strings(STRING_ACTION_REPEAT),
            color: 'red',
            onPress: onConfirmed,
          }
        })
      } finally {
        dispatch(removeFromProgress(progress))
      }
    }

    let dialog = new DialogAndroid()
    dialog.set({
      title: strings(STRING_NOTIFICATION),
      content: strings(STRING_ACTION_CLOSE_SESSION) + '?',
      positiveText: strings(STRING_ACTION_CONFIRM),
      negativeText: strings(STRING_ACTION_CANCEL),
      onPositive: onConfirmed
    })
    dialog.show()
  }
}

async function checkOpenedSession (realm) {
  let session = SessionModel.getOpenedSession(realm)

  if (session) {
    await ScannerApi.start({notificationText: strings(STRING_NOTIFICATION_SCANNING)})
    NavigationService.navigate(SCANNER, {
      sessionKey: session.id,
      sessionOperatorName: session.operator.name,
      sessionOperationName: session.operation.name
    })
  } else {
    if (await ScannerApi.isRunning()) {
      await ScannerApi.stop()
    }
    NavigationService.navigate(SESSIONS_SCREEN)
  }
}