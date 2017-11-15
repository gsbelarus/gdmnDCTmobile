import { NavigationActions } from 'react-navigation'
import AppNavigator, { SPLASH_SCREEN } from '../../navigators/AppNavigator'

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams(SPLASH_SCREEN))

export default function (state = initialState, action) {
  switch (action.type) {
    case NavigationActions.NAVIGATE:
      if (getCurrentRouteState(state).routeName === getActionRouteName(action)) {
        return state
      }
  }
  return AppNavigator.router.getStateForAction(action, state) || state
}

export function getCurrentRouteState (navigationState) {
  if (!navigationState) return null
  const route = navigationState.routes[navigationState.index]
  if (route.routes) return getCurrentRouteState(route)
  return route
}

function getActionRouteName (action) {
  const hasNestedAction = action.action && action.type
  const nestedActionWillNavigate = hasNestedAction && action.action.type === NavigationActions.NAVIGATE

  if (hasNestedAction && nestedActionWillNavigate) {
    return getActionRouteName(action.action)
  }

  return action.routeName
}