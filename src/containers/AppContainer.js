import React, { PureComponent } from 'react'
import { BackHandler, StatusBar, View } from 'react-native'
import { connect } from 'react-redux'
import { addNavigationHelpers } from 'react-navigation'
import { ImportManager } from '../fsManager'
import { openRealm } from '../realm/realm'
import {
  closeSession, deleteSession,
  exportData,
  goBack,
  importData,
  init,
  openCreateSession,
  updateSearchFilter
} from '../redux/actions/appActions'
import AppNavigator from '../navigators/AppNavigator'
import ProgressModalContainer from './ProgressModalContainer'
import RealmProvider from '../realm/react/RealmProvider'

class App extends PureComponent {

  state = {
    realm: null
  }

  constructor () {
    super()

    this._init = this._init.bind(this)
    this._onBackPress = this._onBackPress.bind(this)
    this._importWatcher = this._importWatcher.bind(this)
    this._exportData = this._exportData.bind(this)
    this._closeSession = this._closeSession.bind(this)
    this._deleteSession = this._deleteSession.bind(this)
    this._openCreateSession = this._openCreateSession.bind(this)
    this._updateSearchFilter = this._updateSearchFilter.bind(this)
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

  _exportData () {
    this.props.dispatch(exportData(this.state.realm))
  }

  _closeSession () {
    this.props.dispatch(closeSession(this.state.realm))
  }

  _deleteSession (session) {
    this.props.dispatch(deleteSession(this.state.realm, session))
  }

  _openCreateSession (object) {
    this.props.dispatch(openCreateSession(this.state.realm, object))
  }

  _updateSearchFilter (search) {
    this.props.dispatch(updateSearchFilter(search))
  }

  componentDidMount () {
    openRealm().then(realm => this.setState({realm}, this._init), console.warn)

    StatusBar.setBackgroundColor('black', true)

    BackHandler.addEventListener('hardwareBackPress', this._onBackPress)
    ImportManager.watch(this._importWatcher)
  }

  componentWillUnmount () {
    if (this.state.realm) this.state.realm.close()

    BackHandler.removeEventListener('hardwareBackPress', this._onBackPress)
    ImportManager.unwatch(this._importWatcher)
  }

  render () {
    const {dispatch, state} = this.props
    return (
      <RealmProvider realm={this.state.realm}>
        <View style={{flex: 1}}>
          <AppNavigator
            navigation={
              addNavigationHelpers({
                dispatch,
                state,
                exportData: this._exportData,
                closeSession: this._closeSession,
                deleteSession: this._deleteSession,
                openCreateSession: this._openCreateSession,
                updateSearchFilter: this._updateSearchFilter
              })
            }/>
          <ProgressModalContainer/>
        </View>
      </RealmProvider>
    )
  }
}

export default connect((state) => ({state: state.appState}))(App)
