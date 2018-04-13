import React from 'react'
import { createSwitchNavigator } from 'react-navigation'
import SplashScreen from '../components/SplashScreen'
import MainNavigator from './MainNavigator'
import ScannerNavigator from './ScannerNavigator'

export const SPLASH_SCREEN = 'SplashScreen'
export const SCANNER_NAVIGATOR = 'ScannerNavigator'
export const MAIN_NAVIGATOR = 'MainNavigator'

export default createSwitchNavigator({
  [SPLASH_SCREEN]: {
    screen: ({navigation}) => (
      <SplashScreen
        label={require('../../app.json').displayName}
        progressColor={'white'}
        style={{backgroundColor: 'black'}}/>
    )
  },
  [MAIN_NAVIGATOR]: MainNavigator,
  [SCANNER_NAVIGATOR]: ScannerNavigator
}, {
  initialRouteName: SPLASH_SCREEN
})