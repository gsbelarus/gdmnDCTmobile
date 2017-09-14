import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { FlatList, Platform, Text, TouchableNativeFeedback, View } from 'react-native'
import styles from './styles'

export default class HeaderStepHistory extends Component {

  static propTypes = {
    steps: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      disabled: PropTypes.bool,
      rippleColor: PropTypes.string,
      style: Text.propTypes.style
    })),
    separatorIconName: PropTypes.string,
    tintColor: PropTypes.string,
    keyExtractor: PropTypes.func,
  }

  static defaultProps = {
    steps: [],
    tintColor: 'black',
    separatorIconName: 'keyboard-arrow-right',
    keyExtractor: (item, index) => index
  }

  constructor () {
    super()

    this._renderSeparator = this._renderSeparator.bind(this)
    this._renderItem = this._renderItem.bind(this)
  }

  _renderSeparator () {
    const {separatorIconName, tintColor} = this.props

    return (
      <Icon name={separatorIconName} style={[styles.separatorIcon, {color: tintColor}]}/>
    )
  }

  _renderItem ({item}) {
    const {tintColor} = this.props
    const {label, disabled, style} = item

    return (
      <TouchableNativeFeedback
        delayPressIn={0}
        background={Platform.Version > 21 ? TouchableNativeFeedback.Ripple(tintColor, false) : TouchableNativeFeedback.SelectableBackground()}
        disabled={disabled}>
        <View>
          <Text style={[styles.label, {color: tintColor}, style]}>
            {label}
          </Text>
        </View>
      </TouchableNativeFeedback>
    )
  }

  render () {
    const {steps, keyExtractor} = this.props

    return (
      <FlatList
        horizontal={true}
        keyExtractor={keyExtractor}
        data={steps}
        renderItem={this._renderItem}
        ItemSeparatorComponent={this._renderSeparator}/>
    )
  }
}