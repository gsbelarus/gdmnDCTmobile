import React from 'react'
import { View } from 'react-native'
import { AfterInteractions } from 'react-native-interactions'
import { Header, StackNavigator } from 'react-navigation'
import HeaderIcon from '../components/HeaderIcon/index'
import HeaderSearchBar from '../components/HeaderSearchBar/index'
import HeaderStepHistory from '../components/HeaderStepHistory/index'
import ProgressModal from '../components/ProgressModal'
import SelectOperationContainer from '../containers/SelectOperationContainer'
import SelectOperatorContainer from '../containers/SelectOperatorContainer'
import SessionDetailContainer from '../containers/SessionDetailContainer'
import SessionsContainer from '../containers/SessionsContainer'
import SettingsContainer from '../containers/SettingsContainer'
import strings, {
  STRING_ACTION_DELETE,
  STRING_ACTION_SETTINGS,
  STRING_ACTION_SYNC,
  STRING_TITLE_SELECT_OPERATION,
  STRING_TITLE_SELECT_OPERATOR,
  STRING_TITLE_SESSION_DETAIL,
  STRING_TITLE_SESSIONS,
  STRING_TITLE_SETTINGS
} from '../localization/strings'
import { NavigationService } from '../NavigationService'
import { createSession, deleteSessionDetail, syncData } from '../redux/actions/appActions'

export const SETTINGS_SCREEN = 'SettingsScreen'
export const SESSIONS_SCREEN = 'SessionsScreen'
export const SESSION_DETAIL_SCREEN = 'SessionDetailScreen'
export const SELECT_OPERATOR_SCREEN = 'SelectOperatorScreen'
export const SELECT_OPERATION_SCREEN = 'SelectOperationScreen'

const placeHolder = (
  <ProgressModal
    visible={true}
    progressColor={'black'}
    style={{backgroundColor: 'white'}}/>
)

export default StackNavigator({
  [SESSIONS_SCREEN]: {
    screen: ({screenProps}) => (
      <AfterInteractions placeholder={placeHolder}>
        <SessionsContainer
          openCreateSession={() => NavigationService.navigate(SELECT_OPERATOR_SCREEN)}
          openSessionDetail={(session) =>
            NavigationService.navigate(SESSION_DETAIL_SCREEN, {
              sessionKey: session.id,
              sessionOperatorName: session.operator.name,
              sessionOperationName: session.operation.name
            })}
          deleteSessionDetail={(session) => screenProps.dispatch(deleteSessionDetail(screenProps.realm, session.id))}/>
      </AfterInteractions>
    ),
    navigationOptions: ({screenProps}) => ({
      title: strings(STRING_TITLE_SESSIONS),
      headerRight: (
        <View style={{flexDirection: 'row'}}>
          <HeaderIcon
            iconName={'sync'}
            label={strings(STRING_ACTION_SYNC)}
            onPress={() => screenProps.dispatch(syncData(screenProps.realm))}
            rippleColor={'white'}
            iconStyle={{color: 'white'}}/>
          <HeaderIcon
            iconName={'settings'}
            label={strings(STRING_ACTION_SETTINGS)}
            onPress={() => NavigationService.navigate(SETTINGS_SCREEN)}
            rippleColor={'white'}
            iconStyle={{color: 'white'}}/>
        </View>
      )
    })
  },
  [SELECT_OPERATOR_SCREEN]: {
    screen: () => (
      <AfterInteractions placeholder={placeHolder}>
        <SelectOperatorContainer
          openCreateSession={(realm, operator) => NavigationService.navigate(SELECT_OPERATION_SCREEN, {operator})}/>
      </AfterInteractions>
    ),
    navigationOptions: () => ({
      title: strings(STRING_TITLE_SELECT_OPERATOR)
    })
  },
  [SELECT_OPERATION_SCREEN]: {
    screen: ({navigation, screenProps}) => (
      <AfterInteractions placeholder={placeHolder}>
        <SelectOperationContainer
          search={navigation.state.params && navigation.state.params.search}
          openCreateSession={
            (realm, operation) => screenProps.dispatch(
              createSession(realm, navigation.state.params && navigation.state.params.operator, operation))
          }/>
      </AfterInteractions>
    ),
    navigationOptions: ({navigation}) => ({
      title: strings(STRING_TITLE_SELECT_OPERATION),
      header: (props) => {
        const {headerStyle} = props.navigationOptions
        return (
          <View style={headerStyle}>
            <Header {...props}/>
            <HeaderSearchBar
              value={navigation.state.params && navigation.state.params.search}
              onChangeText={(search) => navigation.setParams({search})}/>
          </View>
        )
      }
    })
  },
  [SETTINGS_SCREEN]: {
    screen: ({screenProps}) => (
      <AfterInteractions placeholder={placeHolder}>
        <SettingsContainer syncData={() => screenProps.dispatch(syncData(screenProps.realm))}/>
      </AfterInteractions>
    ),
    navigationOptions: () => ({
      title: strings(STRING_TITLE_SETTINGS)
    })
  },
  [SESSION_DETAIL_SCREEN]: {
    screen: (props) => (
      <AfterInteractions placeholder={placeHolder}>
        <SessionDetailContainer {...props}/>
      </AfterInteractions>
    ),
    navigationOptions: ({navigation, screenProps}) => ({
      title: strings(STRING_TITLE_SESSION_DETAIL),
      headerRight: (
        <HeaderIcon
          iconName={'delete'}
          label={strings(STRING_ACTION_DELETE)}
          onPress={() => screenProps.dispatch(deleteSessionDetail(screenProps.realm, navigation.state.params.sessionKey))}
          rippleColor={'white'}
          iconStyle={{color: 'white'}}/>
      ),
      header: (props) => {
        const {headerStyle, headerTintColor} = props.navigationOptions
        const {sessionOperatorName, sessionOperationName} = navigation.state.params || {}
        return (
          <View style={headerStyle}>
            <Header {...props}/>
            <HeaderStepHistory
              tintColor={headerTintColor}
              steps={[
                {label: sessionOperatorName, disabled: true},
                {label: sessionOperationName, disabled: true}
              ]}/>
          </View>
        )
      }
    })
  }
}, {
  navigationOptions: {
    headerStyle: {
      elevation: 4,
      backgroundColor: 'black'
    },
    headerTintColor: 'white',
    headerPressColorAndroid: 'white'
  }
})
