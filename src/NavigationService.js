import { NavigationActions } from 'react-navigation'

export class NavigationService {

  static _navigator

  static back (key) {
    NavigationService._navigator.dispatch(NavigationActions.back({key}))
  }

  static popCurrent (navigation, n) {
    navigation.pop(n)
  }

  static setParams (options) {
    NavigationService._navigator.dispatch(NavigationActions.setParams(options))
  }

  static setParamsCurrent (navigation, params) {
    navigation.setParams(params)
  }

  static replace (options) {
    NavigationService._navigator.dispatch(
      NavigationActions.replace(options)
    )
  }

  static replaceCurrent (navigation, routeName, params, action) {
    navigation.replace(routeName, params, action)
  }

  static navigate (routeName, params) {
    NavigationService._navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params
      })
    )
  }
}