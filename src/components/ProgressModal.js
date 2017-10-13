import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { BackHandler, ColorPropType, LayoutAnimation, StyleSheet, Text, View, ViewPropTypes } from 'react-native'
import SplashScreen from './SplashScreen/index'

export default class ProgressModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    label: PropTypes.string,
    onRequestClose: PropTypes.func,
    progressColor: ColorPropType,
    labelStyle: Text.propTypes.style,
    progressStyle: ViewPropTypes.style,
    style: ViewPropTypes.style
  }

  static defaultProps = {
    onRequestClose: () => {}
  }

  constructor (props, context) {
    super(props, context)

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

  componentWillUpdate () {
    LayoutAnimation.easeInEaseOut()
  }

  render () {
    return this.props.visible
      ? (
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