import { NavigationActions } from 'react-navigation'
import AppNavigator, { SPLASH_SCREEN } from '../../navigators/AppNavigator'

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams(SPLASH_SCREEN))

export default function (state = initialState, action) {
  const {type} = action

  if (type === NavigationActions.NAVIGATE) {
    // Return current state if no routes have changed
    if (getActionRouteName(action) === getCurrentRouteName(state)) {
      return state
    }
  }

  // Else return new navigation state or the current state
  return AppNavigator.router.getStateForAction(action, state) || state
}

// eslint-no-prototype-builtins
function hasProp (obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

// Gets the current route name
function getCurrentRouteName (nav) {
  if (!hasProp(nav, 'index') || !hasProp(nav, 'routes')) return nav.routeName
  return getCurrentRouteName(nav.routes[nav.index])
}

// Gets the destination route name
function getActionRouteName (action) {
  const hasNestedAction = Boolean(
    hasProp(action, 'action') && hasProp(action, 'type') && typeof action.action !== 'undefined'
  )

  const nestedActionWillNavigate = Boolean(hasNestedAction && action.action.type === NavigationActions.NAVIGATE)

  if (hasNestedAction && nestedActionWillNavigate) {
    return getActionRouteName(action.action)
  }

  return action.routeName
}