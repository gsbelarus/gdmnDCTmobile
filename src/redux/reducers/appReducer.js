import AppNavigator, { SPLASH_SCREEN } from '../../navigators/AppNavigator'

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams(SPLASH_SCREEN))

export default function (state = initialState, action) {
  const nextState = AppNavigator.router.getStateForAction(action, state)
  return nextState || state
}