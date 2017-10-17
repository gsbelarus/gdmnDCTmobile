import React, { PureComponent } from 'react'
import { BackHandler, StatusBar, View } from 'react-native'
import { connect } from 'react-redux'
import { addNavigationHelpers } from 'react-navigation'
import { openRealm } from '../realm/realm'
import { goBack, init } from '../redux/actions/appActions'
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
  }

  _init () {
    this.props.dispatch(init(this.state.realm))
  }

  _onBackPress () {
    this.props.dispatch(goBack())
    return true
  }

  componentDidMount () {
    openRealm().then(realm => this.setState({realm}, this._init), console.warn)

    StatusBar.setBackgroundColor('black', true)

    BackHandler.addEventListener('hardwareBackPress', this._onBackPress)
  }

  componentWillUnmount () {
    // if (this.state.realm) this.state.realm.close()

    BackHandler.removeEventListener('hardwareBackPress', this._onBackPress)
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
