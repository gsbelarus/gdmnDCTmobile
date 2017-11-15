import { BackHandler } from 'react-native'
import { NavigationActions } from 'react-navigation'
import DialogAndroid from 'react-native-dialogs'
import Snackbar from 'react-native-snackbar'
import strings, {
  STRING_ACTION_CANCEL,
  STRING_ACTION_CLOSE_SESSION,
  STRING_ACTION_CONFIRM,
  STRING_ACTION_OK,
  STRING_ACTION_OPEN_SESSION,
  STRING_ACTION_REPEAT,
  STRING_ERROR_CLOSING_SESSION,
  STRING_ERROR_DEVICE_NOT_SUPPORTED,
  STRING_ERROR_NO_CONNECTION,
  STRING_ERROR_SYNC,
  STRING_NOTIFICATION,
  STRING_NOTIFICATION_SCANNING,
  STRING_PROGRESS_CLOSING_SESSION,
  STRING_PROGRESS_OPENING_SESSION,
  STRING_PROGRESS_SYNC,
  STRING_PROGRESS_VERIFY_APP,
  STRING_SETTINGS_URL_HINT,
  STRING_SETTINGS_URL_INVALID,
  STRING_SETTINGS_URL_PRIMARY
} from '../../localization/strings'
import {
  ERROR,
  SCANNER,
  SELECT_OPERATION,
  SELECT_OPERATOR,
  SELECT_STORING_PLACE,
  SESSION_DETAIL,
  SESSIONS,
  SETTINGS
} from '../../navigators/AppNavigator'
import SessionModel from '../../realm/models/SessionModel'
import OperatorModel from '../../realm/models/OperatorModel'
import OperationModel from '../../realm/models/OperationModel'
import ExportManager from '../../sync/ExportManager'
import ImportManager from '../../sync/ImportManager'
import { addToProgress, removeFromProgress } from './progressActions'
import ScannerApi from '../../../react-native-android-scanner/src/ScannerApi'
import SettingsModel from '../../realm/models/SettingsModel'
import { updateStoredSessionsQuantity } from '../../realm/utils'

function navigate (routeName = ERROR, params = {}, action = null) {
  return NavigationActions.navigate({routeName, params, action})
}

function reset (index = 0, actions = [navigate()], key = null) {
  return NavigationActions.reset({index, actions, key})
}

export function goBack () {
  return (dispatch, getState) => {
    const {appState, progressState} = getState()
    if (progressState.visible) return
    if (appState.index) {
      dispatch(NavigationActions.back())
    } else {
      BackHandler.exitApp()
    }
  }
}

export function openScanner (params) {
  return navigate(SCANNER, params)
}

export function openSessionDetail (params) {
  return navigate(SESSION_DETAIL, params)
}

export function openSettings (params) {
  return navigate(SETTINGS, params)
}

export function init (realm) {
  return async (dispatch, getState) => {
    const progress = {message: strings(STRING_PROGRESS_VERIFY_APP)}
    dispatch(addToProgress(progress))

    let isSupported = await ScannerApi.isDeviceSupported()
    isSupported = true    //TODO remove

    if (!isSupported) {
      dispatch(reset(0,
        [navigate(ERROR,
          {
            message: strings(STRING_ERROR_DEVICE_NOT_SUPPORTED),
            icon: 'sentiment-very-dissatisfied'
          }
        )]
      ))
    } else {
      dispatch(globalNavigate(realm))
      const settings = SettingsModel.getSettings(realm)
      if (!settings.url) {
        showEditUrlDialog(realm)
      }
    }

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

export function openCreateSession (realm, object) {
  return (dispatch, getState) => {
    const {appState} = getState()
    const {operator} = getCurrentRouteState(appState).params || {}

    if (!object) {
      dispatch(navigate(SELECT_OPERATOR))

    } else if (object instanceof OperatorModel) {
      dispatch(navigate(SELECT_OPERATION, {operator: object}))

    } else if (object instanceof OperationModel) {
      let dialog = new DialogAndroid()
      dialog.set({
        title: strings(STRING_NOTIFICATION),
        content: strings(STRING_ACTION_OPEN_SESSION) + '?',
        positiveText: strings(STRING_ACTION_CONFIRM),
        negativeText: strings(STRING_ACTION_CANCEL),
        onPositive: () => {
          const progress = {message: strings(STRING_PROGRESS_OPENING_SESSION)}
          dispatch(addToProgress(progress))

          try {
            if (!SessionModel.getOpenedSession(realm)) {
              realm.write(() => {
                SessionModel.create(realm, new Date(), operator, object)
                updateStoredSessionsQuantity(realm, SettingsModel.getSettings(realm).maxCountSession)
              })
            }
            dispatch(globalNavigate(realm))
          } catch (error) {
            console.warn(error)
          }

          dispatch(removeFromProgress(progress))
        }
      })
      dialog.show()
    }
  }
}

export function deleteSessionDetail (realm) {
  return (dispatch, getState) => {
    const {appState} = getState()
    const {sessionKey} = getCurrentRouteState(appState).params || {}

    dispatch(goBack())

    if (sessionKey) {
      const session = SessionModel.findSessionByKey(realm, sessionKey)
      if (session) {
        realm.write(() => {
          realm.delete(session.codes)
          realm.delete(session)
        })
      }
    }
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
        dispatch(globalNavigate(realm))
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

function globalNavigate (realm) {
  return async (dispatch, getState) => {
    let session = SessionModel.getOpenedSession(realm)

    if (session) {
      await ScannerApi.start({notificationText: strings(STRING_NOTIFICATION_SCANNING)})
      dispatch(reset(0,
        [openScanner({
          sessionKey: session.id,
          sessionOperatorName: session.operator.name,
          sessionOperationName: session.operation.name
        })]
      ))

    } else {
      if (await ScannerApi.isRunning()) {
        await ScannerApi.stop()
      }
      dispatch(reset(0, [navigate(SESSIONS)]))
    }
  }
}

function getCurrentRouteState (navigationState) {
  if (!navigationState) return null
  const route = navigationState.routes[navigationState.index]
  if (route.routes) return getCurrentRouteState(route)
  return route
}