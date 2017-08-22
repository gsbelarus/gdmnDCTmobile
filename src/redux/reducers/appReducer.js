import { NavigationActions } from 'react-navigation'
import AppNavigator, { LOADER } from '../../navigators/AppNavigator'

const initialState = AppNavigator.router.getStateForAction(
  NavigationActions.navigate({
    routeName: LOADER,
    params: {label: require('../../../app.json').displayName}
  })
)

export default function (state = initialState, action) {
  const nextState = AppNavigator.router.getStateForAction(action, state)
  return nextState || state
}