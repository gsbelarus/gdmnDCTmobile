import React, { PureComponent } from 'react'
import { BackHandler, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { addNavigationHelpers } from 'react-navigation'
import { appInit, closeSession, goBack, openCreateSession, } from '../redux/actions/appActions'
import connectRealm from '../realm/react/connectRealm'
import AppNavigator from '../navigators/AppNavigator'

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
    this.props.appInit()

    StatusBar.setBackgroundColor('black', true)
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
  }

  render () {
    return (
      <AppNavigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.state,
        ...this.props
      })}/>
    )
  }
}

const ReduxAppContainer = connect(
  (state) => ({
    state: state.appState
  }),
  (dispatch, ownProps) => ({
    dispatch,
    appInit: () => dispatch(appInit(ownProps.realm)),
    goBack: () => dispatch(goBack()),
    closeSession: () => dispatch(closeSession(ownProps.realm)),
    openCreateSession: (object) => dispatch(openCreateSession(ownProps.realm, object))
  })
)(App)

export default connectRealm(
  (realm, ownProps) => ({realm})
)(ReduxAppContainer)
