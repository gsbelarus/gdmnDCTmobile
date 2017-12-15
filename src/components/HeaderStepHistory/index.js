import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { ColorPropType, FlatList, Text } from 'react-native'
import TouchableView from '../TouchableView'
import styles from './styles'

export default class HeaderStepHistory extends Component {

  static propTypes = {
    extra: PropTypes.any,
    steps: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      disabled: PropTypes.bool,
      rippleColor: ColorPropType,
      style: Text.propTypes.style
    })),
    separatorIconName: PropTypes.string,
    tintColor: ColorPropType,
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

  constructor (props, context) {
    super(props, context)

    this._setListRef = this._setListRef.bind(this)
    this._renderSeparator = this._renderSeparator.bind(this)
    this._renderItem = this._renderItem.bind(this)
  }

  _setListRef (list) {
    this.list = list
  }

  _renderSeparator () {
    return (
      <Icon name={this.props.separatorIconName} style={[styles.separatorIcon, {color: this.props.tintColor}]}/>
    )
  }

  _renderItem ({item, index}) {
    return (
      <TouchableView
        delayPressIn={0}
        disabled={item.disabled}
        rippleColor={this.props.tintColor}
        onPress={() => this.props.onStepPress(item, index)}>
        <Text style={[styles.label, {color: this.props.tintColor}, item.style]}>
          {item.label}
        </Text>
      </TouchableView>
    )
  }

  componentDidUpdate (prevProps, prevState) {
    setTimeout(() => {      //TODO workaround
      if (this.list && (
          this.props.steps !== prevProps.steps || this.props.extra !== prevProps.extra)) {
        this.list.scrollToEnd()
      }
    }, 500)
  }

  render () {
    return (
      <FlatList
        ref={this._setListRef}
        extra={this.props.extra}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={this.props.keyExtractor}
        data={this.props.steps}
        renderItem={this._renderItem}
        ItemSeparatorComponent={this._renderSeparator}
      />
    )
  }
}