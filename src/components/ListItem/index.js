import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { LayoutAnimation, Platform, Text, TouchableNativeFeedback, Vibration, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import styles from './styles'

export default class ListItem extends PureComponent {

  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired,
    primaryText: PropTypes.string,
    secondaryText: PropTypes.string,
    itemDisabled: PropTypes.bool,
    itemDisabledColor: PropTypes.string,
    onItemPress: PropTypes.func,
    onItemLongPress: PropTypes.func,
    onItemIconRightPress: PropTypes.func,
    iconRightName: PropTypes.string,
    primaryTextStyle: Text.propTypes.style,
    secondaryTextStyle: Text.propTypes.style,
    iconRightStyle: Text.propTypes.style,
    style: View.propTypes.style
  }

  static defaultProps = {
    onItemPress: () => {},
    onItemIconRightPress: () => {},
    itemDisabledColor: 'transparent'
  }

  constructor () {
    super()

    this._onItemPress = this._onItemPress.bind(this)
    this._onItemLongPress = this._onItemLongPress.bind(this)
    this._onItemIconRightPress = this._onItemIconRightPress.bind(this)
  }

  componentWillUpdate () {
    LayoutAnimation.easeInEaseOut()
  }

  _onItemPress () {
    const {id, onItemPress} = this.props

    onItemPress(id)
  }

  _onItemLongPress () {
    const {id, onItemLongPress} = this.props

    if (onItemLongPress) {
      Vibration.vibrate(50)
      onItemLongPress(id)
    }
  }

  _onItemIconRightPress () {
    const {id, onItemIconRightPress} = this.props

    onItemIconRightPress(id)
  }

  _renderPrimaryText () {
    const {primaryText, primaryTextStyle} = this.props

    if (primaryText) {
      return <Text style={[styles.itemPrimaryText, primaryTextStyle]}>{primaryText}</Text>
    }
    return null
  }

  _renderSecondaryText () {
    const {secondaryText, secondaryTextStyle} = this.props

    if (secondaryText) {
      return <Text style={[styles.itemSecondaryText, secondaryTextStyle]}>{secondaryText}</Text>
    }
    return null
  }

  _renderIconRight () {
    const {primaryText, secondaryText, iconRightName, iconRightStyle} = this.props

    if (iconRightName) {
      return (
        <View style={primaryText && secondaryText ? {marginTop: 8} : null}>
          <TouchableNativeFeedback
            delayPressIn={0}
            onPress={this._onItemIconRightPress}
            background={Platform.Version > 21 ? TouchableNativeFeedback.SelectableBackgroundBorderless() : TouchableNativeFeedback.SelectableBackground()}>
            <View><Icon name={iconRightName} style={[styles.itemIconRight, iconRightStyle]}/></View>
          </TouchableNativeFeedback>
        </View>
      )
    }
    return null
  }

  render () {
    const {iconRightName, itemDisabled, itemDisabledColor, style} = this.props

    return (
      <TouchableNativeFeedback
        delayPressIn={0}
        disabled={itemDisabled}
        onPress={this._onItemPress}
        onLongPress={this._onItemLongPress}
        background={TouchableNativeFeedback.SelectableBackground()}>
        <View style={[styles.itemContainer, style, itemDisabled ? {backgroundColor: itemDisabledColor} : null]}>
          <View style={[styles.itemTextContainer, iconRightName ? {minHeight: 24} : null]}>
            {this._renderPrimaryText()}
            {this._renderSecondaryText()}
          </View>
          {this._renderIconRight()}
        </View>
      </TouchableNativeFeedback>
    )
  }
}