import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Text, View } from 'react-native'
import styles from './styles'

export default class EmptyView extends PureComponent {

  static propTypes = {
    icon: PropTypes.string,
    text: PropTypes.string,
    textStyle: Text.propTypes.style,
    iconStyle: View.propTypes.style,
    style: View.propTypes.style
  }

  static defaultProps = {
    icon: 'sentiment-neutral',
    text: 'Данные отстутствуют'
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