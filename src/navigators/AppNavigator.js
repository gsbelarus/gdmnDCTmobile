import React from 'react'
import { Platform, TouchableNativeFeedback, View } from 'react-native'
import { StackNavigator } from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'
import strings, {
  STRING_TITLE_SCANNER,
  STRING_TITLE_SELECT_OPERATION,
  STRING_TITLE_SELECT_OPERATOR,
  STRING_TITLE_SELECT_STORING_PLACE,
  STRING_TITLE_SESSIONS
} from '../localization/strings'
import SessionsContainer from '../containers/SessionsContainer'
import SelectOperatorContainer from '../containers/SelectOperatorContainer'
import SelectStoringPlaceContainer from '../containers/SelectStoringPlaceContainer'
import SelectOperationContainer from '../containers/SelectOperationContainer'
import ScannerContainer from '../containers/ScannerContainer'
import EmptyView from '../components/EmptyView/index'
import SplashScreen from '../components/SplashScreen/index'

export const SPLASH_SCREEN = 'SplashScreen'
export const ERROR = 'Error'
export const SESSIONS = 'Sessions'
export const SELECT_OPERATOR = 'SelectOperator'
export const SELECT_STORING_PLACE = 'SelectStoringPlace'
export const SELECT_OPERATION = 'SelectOperation'
export const SCANNER = 'Scanner'

export default StackNavigator({
  [SPLASH_SCREEN]: {
    screen: () => (
      <SplashScreen
        label={require('../../app.json').displayName}
        progressColor={'white'}
        style={{backgroundColor: 'black'}}/>
    ),
    navigationOptions: ({navigation, screenProps}) => ({
      header: null
    })
  },
  [ERROR]: {
    screen: (props) => (
      <EmptyView
        text={props.navigation.state.params.message}
        icon={props.navigation.state.params.icon}
        textStyle={{color: 'white'}}
        style={{backgroundColor: 'red'}}/>
    ),
    navigationOptions: ({navigation, screenProps}) => ({
      header: null
    })
  },
  [SESSIONS]: {
    screen: SessionsContainer,
    navigationOptions: ({navigation, screenProps}) => ({
      title: strings(STRING_TITLE_SESSIONS)
    })
  },
  [SELECT_OPERATOR]: {
    screen: SelectOperatorContainer,
    navigationOptions: ({navigation, screenProps}) => ({
      title: strings(STRING_TITLE_SELECT_OPERATOR)
    })
  },
  [SELECT_STORING_PLACE]: {
    screen: SelectStoringPlaceContainer,
    navigationOptions: ({navigation, screenProps}) => ({
      title: strings(STRING_TITLE_SELECT_STORING_PLACE)
    })
  },
  [SELECT_OPERATION]: {
    screen: SelectOperationContainer,
    navigationOptions: ({navigation, screenProps}) => ({
      title: strings(STRING_TITLE_SELECT_OPERATION)
    })
  },
  [SCANNER]: {
    screen: ScannerContainer,
    navigationOptions: ({navigation, screenProps}) => ({
      title: strings(STRING_TITLE_SCANNER),
      headerRight: (
        <TouchableNativeFeedback
          delayPressIn={0}
          background={Platform.Version > 21 ? TouchableNativeFeedback.Ripple('white', true) : TouchableNativeFeedback.SelectableBackground()}
          onPress={navigation.closeSession}>
          <View><Icon name={'stop'} style={{margin: 10, fontSize: 36, color: 'red'}}/></View>
        </TouchableNativeFeedback>
      )
    })
  }
}, {
  navigationOptions: ({navigation, screenProps}) => ({
    headerStyle: {
      backgroundColor: 'black'
    },
    headerTintColor: 'white',
    headerPressColorAndroid: 'white'
  })
})
