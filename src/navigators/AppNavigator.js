import React from 'react'
import { Header, StackNavigator } from 'react-navigation'
import { View } from 'react-native'
import strings, {
  STRING_ACTION_CLOSE_SESSION,
  STRING_ACTION_DELETE,
  STRING_ACTION_SETTINGS,
  STRING_ACTION_SYNC,
  STRING_TITLE_SCANNER,
  STRING_TITLE_SELECT_OPERATION,
  STRING_TITLE_SELECT_OPERATOR,
  STRING_TITLE_SELECT_STORING_PLACE,
  STRING_TITLE_SESSION_DETAIL,
  STRING_TITLE_SESSIONS,
  STRING_TITLE_SETTINGS
} from '../localization/strings'
import {
  closeSession,
  deleteSessionDetail,
  openCreateSession,
  openSessionDetail,
  openSettings,
  syncData
} from '../redux/actions/appActions'
import SettingsContainer from '../containers/SettingsContainer'
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
export const SETTINGS = 'Settings'
export const SESSIONS = 'Sessions'
export const SESSION_DETAIL = 'SessionDetail'
export const SELECT_OPERATOR = 'SelectOperator'
export const SELECT_STORING_PLACE = 'SelectStoringPlace'
export const SELECT_OPERATION = 'SelectOperation'
export const SCANNER = 'Scanner'

export default StackNavigator({
  [SPLASH_SCREEN]: {
    screen: ({navigation}) => (
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
    screen: ({navigation}) => (
      <EmptyView
        text={navigation.state.params.message}
        icon={navigation.state.params.icon}
        textStyle={{color: 'white'}}
        style={{backgroundColor: 'red'}}/>
    ),
    navigationOptions: ({navigation, screenProps}) => ({
      header: null
    })
  },
  [SETTINGS]: {
    screen: ({navigation}) => (
      <SettingsContainer syncData={() => navigation.dispatch(syncData(navigation.realm))}/>
    ),
    navigationOptions: ({navigation, screenProps}) => ({
      title: strings(STRING_TITLE_SETTINGS)
    })
  },
  [SESSIONS]: {
    screen: ({navigation}) => (
      <SessionsContainer
        openCreateSession={(realm) => navigation.dispatch(openCreateSession(realm))}
        openSessionDetail={(session) =>
          navigation.dispatch(openSessionDetail({
            sessionKey: session.id,
            sessionOperatorName: session.operator.name,
            sessionOperationName: session.operation.name,
            sessionStoringPlaceName: session.storingPlace.name
          }))}/>
    ),
    navigationOptions: ({navigation, screenProps}) => ({
      title: strings(STRING_TITLE_SESSIONS),
      headerRight: (
        <View style={{flexDirection: 'row'}}>
          <HeaderIcon
            iconName={'sync'}
            label={strings(STRING_ACTION_SYNC)}
            onPress={() => navigation.dispatch(syncData(navigation.realm))}
            rippleColor={'white'}
            iconStyle={{color: 'white'}}/>
          <HeaderIcon
            iconName={'settings'}
            label={strings(STRING_ACTION_SETTINGS)}
            onPress={() => navigation.dispatch(openSettings())}
            rippleColor={'white'}
            iconStyle={{color: 'white'}}/>
        </View>
      )
    })
  },
  [SESSION_DETAIL]: {
    screen: SessionDetailContainer,
    navigationOptions: ({navigation, screenProps}) => ({
      title: strings(STRING_TITLE_SESSION_DETAIL),
      headerRight: (
        <HeaderIcon
          iconName={'delete'}
          label={strings(STRING_ACTION_DELETE)}
          onPress={() => navigation.dispatch(deleteSessionDetail(navigation.realm, navigation.state.params.sessionKey))}
          rippleColor={'white'}
          iconStyle={{color: 'white'}}/>
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
    screen: ({navigation}) => (
      <SelectOperatorContainer
        openCreateSession={(realm, operator) => navigation.dispatch(openCreateSession(realm, operator))}/>
    ),
    navigationOptions: ({navigation, screenProps}) => ({
      title: strings(STRING_TITLE_SELECT_OPERATOR)
    })
  },
  [SELECT_STORING_PLACE]: {
    screen: ({navigation}) => (
      <SelectStoringPlaceContainer
        search={navigation.state.params && navigation.state.params.search}
        openCreateSession={(realm, storingPlace) => navigation.dispatch(openCreateSession(realm, storingPlace))}/>
    ),
    navigationOptions: ({navigation, screenProps}) => ({
      title: strings(STRING_TITLE_SELECT_STORING_PLACE),
      header: (props) => {
        return (
          <View style={props.getScreenDetails(props.scene).options.headerStyle}>
            <Header {...props}/>
            <HeaderSearchBar
              value={navigation.state.params && navigation.state.params.search}
              onChangeText={(search) => navigation.setParams({search})}/>
          </View>
        )
      }
    })
  },
  [SELECT_OPERATION]: {
    screen: ({navigation}) => (
      <SelectOperationContainer
        search={navigation.state.params && navigation.state.params.search}
        openCreateSession={(realm, operation) => navigation.dispatch(openCreateSession(realm, operation))}/>
    ),
    navigationOptions: ({navigation, screenProps}) => ({
      title: strings(STRING_TITLE_SELECT_OPERATION),
      header: (props) => {
        return (
          <View style={props.getScreenDetails(props.scene).options.headerStyle}>
            <Header {...props}/>
            <HeaderSearchBar
              value={navigation.state.params && navigation.state.params.search}
              onChangeText={(search) => navigation.setParams({search})}/>
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
          onPress={() => navigation.dispatch(closeSession(navigation.realm))}
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
