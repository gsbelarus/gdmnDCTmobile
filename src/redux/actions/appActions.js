import { Alert, BackHandler } from 'react-native'
import { NavigationActions } from 'react-navigation'
import Snackbar from 'react-native-snackbar'
import strings, {
  STRING_ACTION_CANCEL,
  STRING_ACTION_CLOSE_SESSION,
  STRING_ACTION_CONFIRM,
  STRING_ACTION_OPEN_SESSION,
  STRING_ACTION_REPEAT,
  STRING_CLOSING_SESSION,
  STRING_ERROR_CLOSING_SESSION,
  STRING_ERROR_DEVICE_NOT_SUPPORTED,
  STRING_ERROR_LOADING_DATA,
  STRING_LOADING_DATA,
  STRING_NOTIFICATION,
  STRING_OPENING_SESSION
} from '../../localization/strings'
import {
  ERROR,
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
import { addToProgress, removeFromProgress } from './progressActions'
import ScannerApi from '../../../react-native-android-scanner/src/ScannerApi'

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

export function appInit (realm) {
  return async (dispatch, getState) => {
    const progress = {message: require('../../../app.json').displayName}
    dispatch(addToProgress(progress))

    await new Promise(resolve => setTimeout(resolve, 500))
    let isSupported = await ScannerApi.isDeviceSupported()

    // isSupported = true

    if (!isSupported) {
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
      dispatch(importData(realm))
      dispatch(globalNavigate(realm))
    }

    dispatch(removeFromProgress(progress))
  }
}

export function importData (realm, fileName) {
  return async (dispatch, getState) => {
    const progress = {message: strings(STRING_LOADING_DATA)}
    dispatch(addToProgress(progress))
    try {
      if (fileName) {
        await ImportManager.importByFileName(realm, fileName)
      } else {
        await ImportManager.importAll(realm)
      }
    } catch (error) {
      console.warn(error)
      Snackbar.show({     //TODO conflict with React Native Modal
        title: strings(STRING_ERROR_LOADING_DATA),
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
            const progress = {message: strings(STRING_OPENING_SESSION)}
            dispatch(addToProgress(progress))

            realm.write(() => {
              SessionModel.create(realm, new Date(), operator, storingPlace, object, false, [])
            })
            dispatch(globalNavigate(realm))

            dispatch(removeFromProgress(progress))
          }
        }]
      )
    }
  }
}

export function closeSession (realm) {
  return (dispatch, getState) => {

    async function onConfirmed () {
      const progress = {message: strings(STRING_CLOSING_SESSION)}
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