import React from 'react'
import { Header, StackNavigator } from 'react-navigation'
import { View } from 'react-native'
import strings, {
  STRING_ACTION_CLOSE_SESSION,
  STRING_ACTION_DELETE,
  STRING_ACTION_EXPORT,
  STRING_ACTION_IMPORT,
  STRING_TITLE_SCANNER,
  STRING_TITLE_SELECT_OPERATION,
  STRING_TITLE_SELECT_OPERATOR,
  STRING_TITLE_SELECT_STORING_PLACE,
  STRING_TITLE_SESSION_DETAIL,
  STRING_TITLE_SESSIONS
} from '../localization/strings'
import SessionsContainer from '../containers/SessionsContainer'
import SessionDetailContainer from '../containers/SessionDetailContainer'
import SelectOperatorContainer from '../containers/SelectOperatorContainer'
import SelectStoringPlaceContainer from '../containers/SelectStoringPlaceContainer'
import SelectOperationContainer from '../containers/SelectOperationContainer'
import ScannerContainer from '../containers/ScannerContainer'
import HeaderIcon from '../components/HeaderIcon/index'
import EmptyView from '../components/EmptyView/index'
import SplashScreen from '../components/SplashScreen/index'
import HeaderSearchBar from '../components/HeaderSearchBar/index'
import HeaderStepHistory from '../components/HeaderStepHistory/index'

export const SPLASH_SCREEN = 'SplashScreen'
export const ERROR = 'Error'
export const SESSIONS = 'Sessions'
export const SESSION_DETAIL = 'SessionDetail'
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
      title: strings(STRING_TITLE_SESSIONS),
      headerRight: (
        <HeaderIcon
          iconName={'file-download'}
          label={strings(STRING_ACTION_IMPORT)}
          onPress={navigation.importData}
          rippleColor={'white'}
          iconStyle={{color: 'white'}}/>
      )
    })
  },
  [SESSION_DETAIL]: {
    screen: SessionDetailContainer,
    navigationOptions: ({navigation, screenProps}) => ({
      title: strings(STRING_TITLE_SESSION_DETAIL),
      headerRight: (
        <View style={{flexDirection: 'row'}}>
          <HeaderIcon
            iconName={'file-upload'}
            label={strings(STRING_ACTION_EXPORT)}
            onPress={navigation.exportData}
            rippleColor={'white'}
            iconStyle={{color: 'white'}}/>
          <HeaderIcon
            iconName={'clear'}
            label={strings(STRING_ACTION_DELETE)}
            onPress={navigation.deleteSessionDetail}
            rippleColor={'white'}
            iconStyle={{color: 'white'}}/>
        </View>
      ),
      header: (props) => {
        const {headerStyle, headerTintColor} = props.getScreenDetails(props.scene).options
        const {sessionOperatorName, sessionOperationName, sessionStoringPlaceName} = navigation.state.params || {}
        let steps = [
          {label: sessionOperatorName, disabled: true},
          {label: sessionOperationName, disabled: true},
          {label: sessionStoringPlaceName, disabled: true}
        ]
        return (
          <View style={headerStyle}>
            <Header {...props}/>
            <HeaderStepHistory tintColor={headerTintColor} steps={steps}/>
          </View>
        )
      }
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
      title: strings(STRING_TITLE_SELECT_STORING_PLACE),
      header: (props) => {
        return (
          <View style={props.getScreenDetails(props.scene).options.headerStyle}>
            <Header {...props}/>
            <HeaderSearchBar onChangeText={navigation.updateSearchFilter}/>
          </View>
        )
      }
    })
  },
  [SELECT_OPERATION]: {
    screen: SelectOperationContainer,
    navigationOptions: ({navigation, screenProps}) => ({
      title: strings(STRING_TITLE_SELECT_OPERATION),
      header: (props) => {
        return (
          <View style={props.getScreenDetails(props.scene).options.headerStyle}>
            <Header {...props}/>
            <HeaderSearchBar onChangeText={navigation.updateSearchFilter}/>
          </View>
        )
      }
    })
  },
  [SCANNER]: {
    screen: ScannerContainer,
    navigationOptions: ({navigation, screenProps}) => ({
      title: strings(STRING_TITLE_SCANNER),
      headerRight: (
        <HeaderIcon
          iconName={'highlight-off'}
          label={strings(STRING_ACTION_CLOSE_SESSION)}
          onPress={navigation.closeSession}
          rippleColor={'white'}
          iconStyle={{color: 'red'}}/>
      ),
      header: (props) => {
        const {headerStyle, headerTintColor} = props.getScreenDetails(props.scene).options
        const {sessionOperatorName, sessionOperationName, sessionStoringPlaceName} = navigation.state.params || {}
        let steps = [
          {label: sessionOperatorName, disabled: true},
          {label: sessionOperationName, disabled: true},
          {label: sessionStoringPlaceName, disabled: true}
        ]
        return (
          <View style={headerStyle}>
            <Header {...props}/>
            <HeaderStepHistory tintColor={headerTintColor} steps={steps}/>
          </View>
        )
      }
    })
  }
}, {
  navigationOptions: ({navigation, screenProps}) => ({
    headerStyle: {
      elevation: 4,
      backgroundColor: 'black'
    },
    headerTintColor: 'white',
    headerPressColorAndroid: 'white'
  })
})
