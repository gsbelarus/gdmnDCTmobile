import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Modal, Text, View } from 'react-native'
import SplashScreen from './SplashScreen/index'

export default class ProgressModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    label: PropTypes.string,
    onRequestClose: PropTypes.func,
    progressColor: PropTypes.string,
    labelStyle: Text.propTypes.style,
    progressStyle: View.propTypes.style,
    style: View.propTypes.style
  }

  static defaultProps = {
    onRequestClose: () => {}
  }

  render () {
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}>
        <SplashScreen
          progressColor={this.props.progressColor}
          label={this.props.label}
          progressStyle={this.props.progressStyle}
          labelStyle={this.props.labelStyle}
          style={this.props.style}/>
      </Modal>
    )
  }
}