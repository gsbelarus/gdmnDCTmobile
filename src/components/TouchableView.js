import PropTypes from 'prop-types'
import React from 'react'
import { ColorPropType, Platform, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'

export default class TouchableView extends React.PureComponent {

  static propTypes = {
    borderless: PropTypes.bool,
    rippleColor: ColorPropType
  }

  static defaultProps = {
    borderless: false,
    rippleColor: 'rgba(0, 0, 0, .32)',
  }

  render () {
    if (Platform.OS === 'android') {
      const {style, ...rest} = this.props
      return (
        <TouchableNativeFeedback
          {...rest}
          style={null}
          background={
            Platform.Version >= 21
              ? TouchableNativeFeedback.Ripple(this.props.rippleColor, this.props.borderless)
              : TouchableNativeFeedback.SelectableBackground()
          }>
          <View style={style}>
            {this.props.children}
          </View>
        </TouchableNativeFeedback>
      )
    }

    return (
      <TouchableOpacity {...this.props}>
        {this.props.children}
      </TouchableOpacity>
    )
  }
}