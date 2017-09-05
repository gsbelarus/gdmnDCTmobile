import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Platform, Text, ToastAndroid, TouchableNativeFeedback, View } from 'react-native'
import styles from './styles'

export default class HeaderIcon extends Component {

  static propTypes = {
    iconName: PropTypes.string,
    label: PropTypes.string,
    rippleColor: PropTypes.string,
    iconStyle: Text.propTypes.style,
    textStyle: Text.propTypes.style,
    style: View.propTypes.style,
    onPress: PropTypes.func
  }

  static defaultProps = {
    onPress: () => {},
    iconName: 'menu',
    label: 'IconButton',
    rippleColor: 'black'
  }

  constructor () {
    super()

    this._onLongPress = this._onLongPress.bind(this)
  }

  _onLongPress () {
    const {label} = this.props

    ToastAndroid.show(label, ToastAndroid.LONG)
  }

  render () {
    const {iconName, rippleColor, iconStyle, style, onPress} = this.props

    return (
      <TouchableNativeFeedback
        delayPressIn={0}
        background={Platform.Version > 21 ? TouchableNativeFeedback.Ripple(rippleColor, true) : TouchableNativeFeedback.SelectableBackground()}
        onPress={onPress}
        onLongPress={this._onLongPress}>
        <View style={style}>
          <Icon name={iconName} style={[styles.icon, iconStyle]}/>
        </View>
      </TouchableNativeFeedback>
    )
  }
}