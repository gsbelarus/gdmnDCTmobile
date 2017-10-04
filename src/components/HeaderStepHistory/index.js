import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AutoBind from 'autobind-decorator'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { FlatList, Text } from 'react-native'
import TouchableView from '../TouchableView'
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

  @AutoBind
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

  @AutoBind
  _renderSeparator () {
    return (
      <Icon name={this.props.separatorIconName} style={[styles.separatorIcon, {color: this.props.tintColor}]}/>
    )
  }

  @AutoBind
  _renderItem ({item, index}) {
    return (
      <TouchableView
        delayPressIn={0}
        disabled={item.disabled}
        rippleColor={this.props.tintColor}
        onPress={() => this.props.onStepPress(item, index)}
        style={{flexDirection: 'row'}}>
        <Text style={[styles.label, {color: this.props.tintColor}, item.style]}>
          {item.label}
        </Text>
        {index < this.props.steps.length - 1 ? this._renderSeparator() : null}
      </TouchableView>
    )
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
        // ItemSeparatorComponent={this._renderSeparator}
      />
    )
  }

  //TODO remove workaround issue #15777
}