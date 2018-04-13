import React from 'react'
import { StatusBar, View } from 'react-native'
import { connect } from 'react-redux'
import { NavigationService } from '../NavigationService'
import AppNavigator2 from '../navigators/AppNavigator'
import RealmProvider from '../realm/react/RealmProvider'
import { openRealm } from '../realm/realm'
import { init } from '../redux/actions/appActions'
import ProgressModalContainer from './ProgressModalContainer'

@connect()
export default class App extends React.PureComponent {

  state = {
    realm: null
  }

  constructor (props, context) {
    super(props, context)

    this._init = this._init.bind(this)
  }

  _init () {
    this.props.dispatch(init(this.state.realm))
  }

  componentDidMount () {
    openRealm().then(realm => this.setState({realm}, this._init), console.warn)

    StatusBar.setBackgroundColor('black', true)
  }

  render () {
    return (
      <RealmProvider realm={this.state.realm}>
        <View style={{flex: 1}}>
          <AppNavigator2
            ref={ref => NavigationService._navigator = ref}
            screenProps={{
              realm: this.state.realm,
              dispatch: this.props.dispatch
            }}/>
          <ProgressModalContainer/>
        </View>
      </RealmProvider>
    )
  }
}
