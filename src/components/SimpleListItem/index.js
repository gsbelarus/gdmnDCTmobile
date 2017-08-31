import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { LayoutAnimation, Text, TouchableNativeFeedback, View } from 'react-native'
import styles from './styles'

export default class SimpleListItem extends PureComponent {

  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired,
    primaryText: PropTypes.string,
    secondaryText: PropTypes.string,
    disabled: PropTypes.bool,
    disabledColor: PropTypes.string,
    onPress: PropTypes.func,
    primaryTextStyle: Text.propTypes.style,
    secondaryTextStyle: Text.propTypes.style,
    style: View.propTypes.style
  }

  static defaultProps = {
    onItemPress: () => {},
    disabledColor: '#90000010'
  }

  componentWillUpdate () {
    LayoutAnimation.easeInEaseOut()
  }

  render () {
    const {
      id,
      primaryText,
      secondaryText,
      disabled,
      disabledColor,
      primaryTextStyle,
      secondaryTextStyle,
      style,
      onPress
    } = this.props

    let primaryView
    if (primaryText) {
      primaryView = <Text style={[styles.itemPrimaryText, primaryTextStyle]}>{primaryText}</Text>
    }

    let secondaryView
    if (secondaryText) {
      secondaryView = <Text style={[styles.itemSecondaryText, secondaryTextStyle]}>{secondaryText}</Text>
    }

    return (
      <TouchableNativeFeedback
        delayPressIn={0}
        disabled={disabled}
        onPress={() => onPress(id)}
        background={TouchableNativeFeedback.SelectableBackground()}>
        <View style={[styles.itemContainer, style, disabled ? {backgroundColor: disabledColor} : null]}>
          {primaryView}
          {secondaryView}
        </View>
      </TouchableNativeFeedback>
    )
  }
}