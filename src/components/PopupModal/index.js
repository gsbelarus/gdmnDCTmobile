import PropTypes from 'prop-types'
import React from 'react'
import { Modal, Text, TouchableWithoutFeedback, View, ViewPropTypes } from 'react-native'
import strings, { STRING_ACTION_CANCEL, STRING_ACTION_OK } from '../../localization/strings'
import TouchableView from '../TouchableView'
import styles from './styles'

export default class PopupModal extends React.PureComponent {

  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    visible: PropTypes.bool,
    closeOnPressAway: PropTypes.bool,
    showNeutral: PropTypes.bool,
    showPositive: PropTypes.bool,
    showCancel: PropTypes.bool,
    neutralText: PropTypes.string,
    positiveText: PropTypes.string,
    cancelText: PropTypes.string,
    onNeutralPress: PropTypes.func,
    onPositivePress: PropTypes.func,
    onCancelPress: PropTypes.func,
    onRequestClose: PropTypes.func,
    dialogStyle: ViewPropTypes.style,
    contentStyle: ViewPropTypes.style
  }

  static defaultProps = {
    neutralText: '',
    positiveText: strings(STRING_ACTION_OK),
    cancelText: strings(STRING_ACTION_CANCEL),
    onRequestClose: () => {}
  }

  render () {
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        onRequestClose={this.props.onRequestClose}
        visible={this.props.visible}>
        <TouchableWithoutFeedback
          disabled={!this.props.closeOnPressAway}
          onPress={this.props.onRequestClose}>
          <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => null}>
              <View style={[styles.contentPopup, this.props.dialogStyle]}>
                <Text style={[styles.title, this.props.title ? null : styles.hidden]}>
                  {this.props.title}
                </Text>
                <Text style={[styles.description, this.props.description ? null : styles.hidden]}>
                  {this.props.description}
                </Text>
                <View style={this.props.contentStyle}>
                  {this.props.children}
                </View>
                <View style={styles.buttonsContainer}>
                  <View style={styles.buttonNeutralContainer}>
                    <TouchableView
                      delayPressIn={0}
                      onPress={this.props.onNeutralPress}
                      style={[styles.button, this.props.showNeutral ? null : styles.hidden]}>
                      <Text style={styles.buttonText}>
                        {this.props.neutralText.toUpperCase()}
                      </Text>
                    </TouchableView>
                  </View>
                  <TouchableView
                    delayPressIn={0}
                    onPress={this.props.onCancelPress}
                    style={[styles.button, this.props.showCancel ? null : styles.hidden]}>
                    <Text style={styles.buttonText}>
                      {this.props.cancelText.toUpperCase()}
                    </Text>
                  </TouchableView>
                  <TouchableView
                    delayPressIn={0}
                    onPress={this.props.onPositivePress}
                    style={[styles.button, this.props.showPositive ? null : styles.hidden]}>
                    <Text style={styles.buttonText}>
                      {this.props.positiveText.toUpperCase()}
                    </Text>
                  </TouchableView>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}