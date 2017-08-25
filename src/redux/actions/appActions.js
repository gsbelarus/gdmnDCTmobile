import { Alert, BackHandler } from 'react-native'
import { NavigationActions } from 'react-navigation'
import Snackbar from 'react-native-snackbar'
import ScannerApi from 'react-native-android-scanner'
import strings, {
  STRING_ACTION_CANCEL, STRING_ACTION_CLOSE_SESSION,
  STRING_ACTION_CONFIRM,
  STRING_ACTION_OPEN_SESSION,
  STRING_ACTION_REPEAT,
  STRING_CLOSING_SESSION,
  STRING_ERROR_CLOSING_SESSION,
  STRING_ERROR_DEVICE_NOT_SUPPORTED,
  STRING_ERROR_LOADING_DATA,
  STRING_LOADING_DATA,
  STRING_NOTIFICATION
} from '../../localization/strings'
import {
  ERROR,
  LOADER,
  SCANNER,
  SELECT_OPERATION,
  SELECT_OPERATOR,
  SELECT_STORING_PLACE,
  SESSIONS
} from '../../navigators/AppNavigator'
import SessionModel from '../../realm/models/SessionModel'
import StoringPlaceModel from '../../realm/models/StoringPlaceModel'
import OperatorModel from '../../realm/models/OperatorModel'
import OperationModel from '../../realm/models/OperationModel'
import { ExportManager, ImportManager } from '../../fsManager'

export function goBack () {
  return (dispatch, getState) => {
    const {appState} = getState()
    if (appState.index) {
      dispatch(NavigationActions.back())
    } else {
      BackHandler.exitApp()
    }
  }
}

export function openLoader (label) {
  return NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({
      routeName: LOADER,
      params: {label}
    })]
  })
}

export function appInit (realm) {
  return async (dispatch, getState) => {
    if (!await ScannerApi.isDeviceSupported()) {
      dispatch(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({
          routeName: ERROR,
          params: {
            message: strings(STRING_ERROR_DEVICE_NOT_SUPPORTED),
            icon: 'sentiment-very-dissatisfied'
          }
        })]
      }))
    } else {
      try {
        dispatch(openLoader(strings(STRING_LOADING_DATA)))
        await ExportManager.exportTest(realm)
        await ImportManager.importAll(realm)
        await ExportManager.exportTest(realm)
        dispatch(globalNavigate(realm))
      } catch (error) {
        console.warn(error)
        Snackbar.show({
          title: strings(STRING_ERROR_LOADING_DATA),
          duration: Snackbar.LENGTH_INDEFINITE,
          action: {
            title: strings(STRING_ACTION_REPEAT),
            color: 'red',
            onPress: () => dispatch(appInit(realm)),
          }
        })
      }
    }
  }
}

export function openCreateSession (realm, object) {
  return (dispatch, getState) => {
    const {appState} = getState()
    const params = appState.routes[appState.index].params

    if (!object) {
      dispatch(NavigationActions.navigate({routeName: SELECT_OPERATOR}))

    } else if (object instanceof OperatorModel) {
      dispatch(NavigationActions.navigate({
        routeName: SELECT_STORING_PLACE,
        params: {operator: object, ...params}
      }))

    } else if (object instanceof StoringPlaceModel) {
      dispatch(NavigationActions.navigate({
        routeName: SELECT_OPERATION,
        params: {storingPlace: object, ...params}
      }))

    } else if (object instanceof OperationModel) {
      const {operator, storingPlace} = params
      Alert.alert(
        strings(STRING_NOTIFICATION),
        strings(STRING_ACTION_OPEN_SESSION) + '?',
        [{text: strings(STRING_ACTION_CANCEL)}, {
          text: strings(STRING_ACTION_CONFIRM),
          onPress: () => {
            realm.write(() => {
              SessionModel.create(realm, new Date(), operator, storingPlace, object, false, [])
            })
            dispatch(globalNavigate(realm))
          }
        }]
      )
    }
  }
}

export function closeSession (realm) {
  return (dispatch, getState) => {
    async function onConfirmed () {
      try {
        dispatch(openLoader(strings(STRING_CLOSING_SESSION)))
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
      }
    }

    Alert.alert(
      strings(STRING_NOTIFICATION),
      strings(STRING_ACTION_CLOSE_SESSION) + '?',
      [{text: strings(STRING_ACTION_CANCEL)}, {
        text: strings(STRING_ACTION_CONFIRM),
        onPress: onConfirmed
      }]
    )
  }
}

function globalNavigate (realm) {
  return async (dispatch, getState) => {
    let session = SessionModel.getOpenedSession(realm)

    if (session) {
      await ScannerApi.start()
      dispatch(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: SCANNER})]
      }))

    } else {
      if (await ScannerApi.isRunning()) {
        await ScannerApi.stop()
      }
      dispatch(NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: SESSIONS})]
      }))
    }
  }
}