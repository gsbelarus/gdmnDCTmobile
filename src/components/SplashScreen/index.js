import PropTypes from 'prop-types'
import React from 'react'
import { ActivityIndicator, ColorPropType, Text, View, ViewPropTypes } from 'react-native'
import styles from './styles'

export default class SplashScreen extends React.PureComponent {

  static propTypes = {
    progressColor: ColorPropType,
    label: PropTypes.string,
    progressStyle: ViewPropTypes.style,
    labelStyle: ViewPropTypes.style,
    style: ViewPropTypes.style
  }

  render () {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.label
          ? (
            <Text style={[styles.primaryText, this.props.labelStyle]}>
              {this.props.label}
            </Text>
          ) : null}
        <ActivityIndicator
          animating={true}
          style={styles.progress}
          size={50}
          color={this.props.progressColor}/>
      </View>
    )
  }
}