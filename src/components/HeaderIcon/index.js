import PropTypes from 'prop-types'
import React from 'react'
import { ColorPropType, Text, ToastAndroid, Vibration, ViewPropTypes } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import TouchableView from '../TouchableView'
import styles from './styles'

export default class HeaderIcon extends React.Component {

  static propTypes = {
    iconName: PropTypes.string,
    label: PropTypes.string,
    rippleColor: ColorPropType,
    iconStyle: Text.propTypes.style,
    textStyle: Text.propTypes.style,
    style: ViewPropTypes.style,
    onPress: PropTypes.func
  }

  static defaultProps = {
    onPress: () => {},
    iconName: 'menu',
    label: 'IconButton',
    rippleColor: 'black'
  }

  constructor (props, context) {
    super(props, context)

    this._onLongPress = this._onLongPress.bind(this)
  }

  _onLongPress () {
    Vibration.vibrate(50)
    ToastAndroid.show(this.props.label, ToastAndroid.LONG)
  }

  render () {
    return (
      <TouchableView
        delayPressIn={0}
        borderless={true}
        rippleColor={this.props.rippleColor}
        onPress={this.props.onPress}
        onLongPress={this._onLongPress}
        style={this.props.style}>
        <Icon name={this.props.iconName} style={[styles.icon, this.props.iconStyle]}/>
      </TouchableView>
    )
  }
}