import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { LayoutAnimation, TextInput, View } from 'react-native'
import strings, { STRING_ACTION_SEARCH } from '../../localization/strings'
import styles from './styles'
import HeaderIcon from '../HeaderIcon/index'

export default class HeaderSearchBar extends PureComponent {

  static propTypes = {
    value: PropTypes.string,
    tint: PropTypes.string,
    autoFocus: PropTypes.bool,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    underlineColorAndroid: PropTypes.string,
    selectionColor: PropTypes.string,
    onChangeText: PropTypes.func,
    style: View.propTypes.style
  }

  static defaultProps = {
    autoFocus: true,
    placeholder: strings(STRING_ACTION_SEARCH) + '...',
    placeholderTextColor: 'gray',
    tint: 'black'
  }

  state = {
    text: null
  }

  constructor () {
    super()

    this._onChangeText = this._onChangeText.bind(this)
  }

  _onChangeText (text) {
    this.setState({text})
    this.props.onChangeText(text)
  }

  componentWillUpdate (nextProps, nextContext) {
    if (this.props.value !== nextProps.value) {
      this._onChangeText(nextProps.value)
    }
    LayoutAnimation.easeInEaseOut()
  }

  render () {
    return (
      <View style={[styles.container, this.props.style]}>
        <TextInput
          underlineColorAndroid={'transparent'}
          returnKeyType={'search'}
          value={this.state.text}
          autoFocus={this.props.autoFocus}
          onChangeText={this._onChangeText}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          selectionColor={this.props.selectionColor}
          style={[styles.textInput, {color: this.props.tint}]}/>
        {
          this.state.text
            ? <HeaderIcon
              iconName={'clear'}
              label={strings(STRING_ACTION_SEARCH)}
              onPress={() => this._onChangeText('')}/>
            : null
        }
      </View>
    )
  }
}