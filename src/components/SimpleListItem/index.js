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
    primaryText: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    onPress: PropTypes.func
  }

  static defaultProps = {
    onItemPress: () => {}
  }

  componentWillUpdate () {
    LayoutAnimation.easeInEaseOut()
  }

  render () {
    const {id, primaryText, disabled} = this.props

    return (
      <TouchableNativeFeedback
        delayPressIn={0}
        disabled={disabled}
        onPress={() => this.props.onPress(id)}
        background={TouchableNativeFeedback.SelectableBackground()}>
        <View style={[styles.itemContainer, disabled ? {backgroundColor: '#90000010'} : null]}>
          <Text style={[styles.itemText, disabled ? {textDecorationLine: 'line-through'} : null]}>
            {primaryText}
          </Text>
        </View>
      </TouchableNativeFeedback>
    )
  }
}