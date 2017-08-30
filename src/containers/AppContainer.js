import React, { PureComponent } from 'react'
import { BackHandler, StatusBar, View } from 'react-native'
import { connect } from 'react-redux'
import { addNavigationHelpers } from 'react-navigation'
import { ImportManager } from '../fsManager'
import { appInit, closeSession, goBack, importData, openCreateSession } from '../redux/actions/appActions'
import connectRealm from '../realm/react/connectRealm'
import AppNavigator from '../navigators/AppNavigator'
import ProgressModalContainer from './ProgressModalContainer'

class App extends PureComponent {

  constructor () {
    super()

    this.onBackPress = this.onBackPress.bind(this)
  }

  onBackPress () {
    this.props.goBack()

    return true
  }

  componentDidMount () {
    this.props.init()

    StatusBar.setBackgroundColor('black', true)
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
    ImportManager.watch(this.props.importData)
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
    ImportManager.unwatch(this.props.importData)
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <AppNavigator navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.state,
          ...this.props
        })}/>
        <ProgressModalContainer/>
      </View>
    )
  }
}

const ReduxAppContainer = connect(
  (state) => ({
    state: state.appState
  }),
  (dispatch, ownProps) => ({
    dispatch,
    init: () => dispatch(appInit(ownProps.realm)),
    importData: (fileName) => dispatch(importData(ownProps.realm, fileName)),
    goBack: () => dispatch(goBack()),
    closeSession: () => dispatch(closeSession(ownProps.realm)),
    openCreateSession: (object) => dispatch(openCreateSession(ownProps.realm, object))
  })
)(App)

export default connectRealm(
  (realm, ownProps) => ({realm})
)(ReduxAppContainer)
