import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { BackHandler, LayoutAnimation, StyleSheet, Text, View } from 'react-native'
import SplashScreen from './SplashScreen/index'

export default class ProgressModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    label: PropTypes.string,
    onRequestClose: PropTypes.func,
    progressColor: PropTypes.string,
    labelStyle: Text.propTypes.style,
    progressStyle: View.propTypes.style,
    style: View.propTypes.style
  }

  static defaultProps = {
    onRequestClose: () => {}
  }

  constructor (props, context) {
    super()

    this._onBackPress = this._onBackPress.bind(this)
  }

  _onBackPress () {
    if (this.props.visible) {
      this.props.onRequestClose()
      return true
    }
    return false
  }

  componentDidMount () {
    BackHandler.addEventListener('hardwareBackPress', this._onBackPress)
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this._onBackPress)
  }

  componentWillUpdate (nextProps, nextState) {
    LayoutAnimation.easeInEaseOut()
  }

  render () {
    return this.props.visible ? (
      <View style={{
        ...StyleSheet.absoluteFillObject
      }}>
        <SplashScreen
          progressColor={this.props.progressColor}
          label={this.props.label}
          progressStyle={this.props.progressStyle}
          labelStyle={this.props.labelStyle}
          style={this.props.style}/>
      </View>
    ) : null
  }
}