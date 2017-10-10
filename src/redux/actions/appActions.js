import { BackHandler } from 'react-native'
import { NavigationActions } from 'react-navigation'
import DialogAndroid from 'react-native-dialogs'
import Snackbar from 'react-native-snackbar'
import strings, {
  STRING_ACTION_CANCEL,
  STRING_ACTION_CLOSE_SESSION,
  STRING_ACTION_CONFIRM,
  STRING_ACTION_OPEN_SESSION,
  STRING_ACTION_REPEAT,
  STRING_ERROR_CLOSING_SESSION,
  STRING_ERROR_DEVICE_NOT_SUPPORTED,
  STRING_ERROR_EXPORT_DATA,
  STRING_ERROR_IMPORT_DATA,
  STRING_NOTIFICATION,
  STRING_NOTIFICATION_SCANNING,
  STRING_PROGRESS_CLOSING_SESSION,
  STRING_PROGRESS_EXPORT_DATA,
  STRING_PROGRESS_IMPORT_DATA,
  STRING_PROGRESS_OPENING_SESSION,
  STRING_PROGRESS_VERIFY_APP
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
import StoringPlaceModel from '../../realm/models/StoringPlaceModel'
import OperatorModel from '../../realm/models/OperatorModel'
import OperationModel from '../../realm/models/OperationModel'
import { ExportManager, ImportManager } from '../../fsManager'
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
    // isSupported = true    //TODO remove

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
      dispatch(importData(realm))
      dispatch(globalNavigate(realm))
    }

    dispatch(removeFromProgress(progress))
  }
}

export function importData (realm, fileName) {
  return async (dispatch, getState) => {
    const progress = {message: strings(STRING_PROGRESS_IMPORT_DATA)}
    dispatch(addToProgress(progress))
    try {
      if (fileName) {
        await ImportManager.importByFileName(realm, fileName)
      } else {
        await ImportManager.importAll(realm)
      }
    } catch (error) {
      console.warn(error)
      Snackbar.show({
        title: strings(STRING_ERROR_IMPORT_DATA),
        duration: Snackbar.LENGTH_LONG,
        action: {
          title: strings(STRING_ACTION_REPEAT),
          color: 'red',
          onPress: () => dispatch(importData(realm, fileName)),
        }
      })
    } finally {
      dispatch(removeFromProgress(progress))
    }
  }
}

export function exportData (realm, sessionKey) {
  return async (dispatch, getState) => {
    const progress = {message: strings(STRING_PROGRESS_EXPORT_DATA)}
    dispatch(addToProgress(progress))
    try {
      if (sessionKey) {
        let session = SessionModel.findSessionByKey(realm, sessionKey)
        await ExportManager.exportSession(session)

      } else {
        const sessions = SessionModel.getSortedByDate(realm)
        for (let i = 0; i < sessions.length; i++) {
          await ExportManager.exportSession(sessions[i])
        }
      }
    } catch (error) {
      console.warn(error)
      Snackbar.show({
        title: strings(STRING_ERROR_EXPORT_DATA),
        duration: Snackbar.LENGTH_LONG,
        action: {
          title: strings(STRING_ACTION_REPEAT),
          color: 'red',
          onPress: () => dispatch(exportData(realm, sessionKey)),
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
    const {operator, storingPlace} = getCurrentRouteState(appState).params || {}

    if (!object) {
      dispatch(navigate(SELECT_OPERATOR))

    } else if (object instanceof OperatorModel) {
      dispatch(navigate(SELECT_STORING_PLACE, {operator: object}))

    } else if (object instanceof StoringPlaceModel) {
      dispatch(navigate(SELECT_OPERATION, {storingPlace: object, operator}))

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
                SessionModel.create(realm, new Date(), operator, storingPlace, object, false, [])
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

    const session = SessionModel.findSessionByKey(realm, sessionKey)
    if (session) {
      realm.write(() => {
        realm.delete(session.codes)
        realm.delete(session)
      })
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
        await ExportManager.exportSession(session)
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
          sessionOperationName: session.operation.name,
          sessionStoringPlaceName: session.storingPlace.name
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