import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Text, View, ViewPropTypes } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import strings, { STRING_EMPTY_DATA } from '../../localization/strings'
import styles from './styles'

export default class EmptyView extends PureComponent {

  static propTypes = {
    icon: PropTypes.string,
    text: PropTypes.string,
    textStyle: Text.propTypes.style,
    iconStyle: ViewPropTypes.style,
    style: ViewPropTypes.style
  }

  static defaultProps = {
    icon: 'sentiment-neutral',
    text: strings(STRING_EMPTY_DATA)
  }

  render () {
    return (
      <View style={[styles.container, this.props.style]}>
        <Icon name={this.props.icon} style={[styles.icon, this.props.iconStyle]}/>
        <Text style={[styles.primaryText, this.props.textStyle]}>{this.props.text}</Text>
      </View>
    )
  }
}