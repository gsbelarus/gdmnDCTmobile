import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { ColorPropType, LayoutAnimation, TextInput, View, ViewPropTypes } from 'react-native'
import strings, { STRING_ACTION_SEARCH } from '../../localization/strings'
import HeaderIcon from '../HeaderIcon/index'
import styles from './styles'

export default class HeaderSearchBar extends PureComponent {

  static propTypes = {
    value: PropTypes.string,
    tint: ColorPropType,
    autoFocus: PropTypes.bool,
    placeholder: PropTypes.string,
    placeholderTextColor: ColorPropType,
    underlineColorAndroid: ColorPropType,
    selectionColor: ColorPropType,
    onChangeText: PropTypes.func,
    style: ViewPropTypes.style
  }

  static defaultProps = {
    autoFocus: true,
    placeholder: strings(STRING_ACTION_SEARCH) + '...',
    placeholderTextColor: 'gray',
    tint: 'black'
  }

  componentWillUpdate () {
    LayoutAnimation.easeInEaseOut()
  }

  render () {
    return (
      <View style={[styles.container, this.props.style]}>
        <TextInput
          underlineColorAndroid={'transparent'}
          returnKeyType={'search'}
          value={this.props.value}
          autoFocus={this.props.autoFocus}
          onChangeText={this.props.onChangeText}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          selectionColor={this.props.selectionColor}
          style={[styles.textInput, {color: this.props.tint}]}/>
        {
          this.props.value
            ? <HeaderIcon
              iconName={'clear'}
              label={strings(STRING_ACTION_SEARCH)}
              onPress={() => this.props.onChangeText('')}/>
            : null
        }
      </View>
    )
  }
}