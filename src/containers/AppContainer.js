import React, { PureComponent } from 'react'
import { BackHandler, StatusBar, View } from 'react-native'
import { connect } from 'react-redux'
import { addNavigationHelpers } from 'react-navigation'
import { ImportManager } from '../fsManager'
import { openRealm } from '../realm/realm'
import { goBack, importData, init } from '../redux/actions/appActions'
import AppNavigator from '../navigators/AppNavigator'
import ProgressModalContainer from './ProgressModalContainer'
import RealmProvider from '../realm/react/RealmProvider'

class App extends PureComponent {

  state = {
    realm: null
  }

  constructor (props, context) {
    super(props, context)

    this._init = this._init.bind(this)
    this._onBackPress = this._onBackPress.bind(this)
    this._importWatcher = this._importWatcher.bind(this)
  }

  _init () {
    this.props.dispatch(init(this.state.realm))
  }

  _onBackPress () {
    this.props.dispatch(goBack())
    return true
  }

  _importWatcher (fileName) {
    this.props.dispatch(importData(this.state.realm, fileName))
  }

  componentDidMount () {
    openRealm().then(realm => this.setState({realm}, this._init), console.warn)

    StatusBar.setBackgroundColor('black', true)

    BackHandler.addEventListener('hardwareBackPress', this._onBackPress)
    ImportManager.watch(this._importWatcher)
  }

  componentWillUnmount () {
    // if (this.state.realm) this.state.realm.close()

    BackHandler.removeEventListener('hardwareBackPress', this._onBackPress)
    ImportManager.unwatch(this._importWatcher)
  }

  render () {
    return (
      <RealmProvider realm={this.state.realm}>
        <View style={{flex: 1}}>
          <AppNavigator
            navigation={addNavigationHelpers({
              dispatch: this.props.dispatch,
              state: this.props.state,
              realm: this.state.realm
            })}/>
          <ProgressModalContainer/>
        </View>
      </RealmProvider>
    )
  }
}

export default connect((state) => ({state: state.appState}))(App)
