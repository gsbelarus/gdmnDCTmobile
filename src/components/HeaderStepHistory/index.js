import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { FlatList, Platform, Text, TouchableNativeFeedback, View } from 'react-native'
import styles from './styles'

export default class HeaderStepHistory extends Component {

  static propTypes = {
    extra: PropTypes.any,
    steps: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      disabled: PropTypes.bool,
      rippleColor: PropTypes.string,
      style: Text.propTypes.style
    })),
    separatorIconName: PropTypes.string,
    tintColor: PropTypes.string,
    onStepPress: PropTypes.func,
    keyExtractor: PropTypes.func,
  }

  static defaultProps = {
    steps: [],
    tintColor: 'black',
    separatorIconName: 'keyboard-arrow-right',
    onStepPress: () => {},
    keyExtractor: (item, index) => index
  }

  list = null

  constructor () {
    super()

    this._setListRef = this._setListRef.bind(this)
    this._renderSeparator = this._renderSeparator.bind(this)
    this._renderItem = this._renderItem.bind(this)
  }

  _setListRef (list) {
    this.list = list
  }

  componentDidUpdate (prevProps, prevState) {
    setTimeout(() => {      //TODO workaround
      if (this.list && (
          this.props.steps !== prevProps.steps || this.props.extra !== prevProps.extra)) {
        this.list.scrollToEnd()
      }
    }, 500)
  }

  _renderSeparator () {
    const {separatorIconName, tintColor} = this.props

    return (
      <Icon name={separatorIconName} style={[styles.separatorIcon, {color: tintColor}]}/>
    )
  }

  _renderItem ({item, index}) {
    const {tintColor} = this.props
    const {label, disabled, style} = item

    return (
      <TouchableNativeFeedback
        delayPressIn={0}
        background={Platform.Version > 21 ? TouchableNativeFeedback.Ripple(tintColor, false) : TouchableNativeFeedback.SelectableBackground()}
        disabled={disabled}
        onPress={() => this.props.onStepPress(item, index)}>
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.label, {color: tintColor}, style]}>
            {label}
          </Text>
          {index < this.props.steps.length - 1 ? this._renderSeparator() : null}
        </View>
      </TouchableNativeFeedback>
    )
  }

  render () {
    const {steps, keyExtractor, extra} = this.props

    return (
      <FlatList
        ref={this._setListRef}
        extra={extra}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor}
        data={steps}
        renderItem={this._renderItem}
        // ItemSeparatorComponent={this._renderSeparator}
      />
    )
  }

  //TODO remove workaround issue #15777
}