import React from 'react'
import { View } from 'react-native'
import { AfterInteractions } from 'react-native-interactions'
import { createStackNavigator, Header } from 'react-navigation'
import HeaderIcon from '../components/HeaderIcon'
import HeaderStepHistory from '../components/HeaderStepHistory'
import ProgressModal from '../components/ProgressModal'
import ScannerContainer from '../containers/ScannerContainer'
import strings, { STRING_ACTION_CLOSE_SESSION, STRING_TITLE_SCANNER } from '../localization/strings'
import { closeSession } from '../redux/actions/appActions'

export const SCANNER = 'ScannerScreen'

const placeHolder = (
  <ProgressModal
    visible={true}
    progressColor={'black'}
    style={{backgroundColor: 'white'}}/>
)

export default createStackNavigator({
  [SCANNER]: {
    screen: (props) => (
      <AfterInteractions placeholder={placeHolder}>
        <ScannerContainer {...props}/>
      </AfterInteractions>
    ),
    navigationOptions: ({navigation, screenProps}) => ({
      title: strings(STRING_TITLE_SCANNER),
      headerRight: (
        <HeaderIcon
          iconName={'highlight-off'}
          label={strings(STRING_ACTION_CLOSE_SESSION)}
          onPress={() => screenProps.dispatch(closeSession(screenProps.realm))}
          rippleColor={'white'}
          iconStyle={{color: 'red'}}/>
      ),
      header: (props) => {
        const {headerStyle, headerTintColor} = props.navigationOptions
        const {sessionOperatorName, sessionOperationName} = navigation.state.params || {}
        let steps = [
          {label: sessionOperatorName, disabled: true},
          {label: sessionOperationName, disabled: true}
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
  navigationOptions: {
    headerStyle: {
      elevation: 4,
      backgroundColor: 'black'
    },
    headerTintColor: 'white',
    headerPressColorAndroid: 'white'
  }
})