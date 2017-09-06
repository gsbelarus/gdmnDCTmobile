import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Modal, ScrollView, Text, TextInput, TouchableNativeFeedback, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import styles from './styles'
import strings, { STRING_ACTION_OK } from '../../localization/strings'

export default class InputModal extends PureComponent {

  static propTypes = {
    visible: PropTypes.bool,
    defaultValue: PropTypes.string,
    title: PropTypes.string,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    onRequestClose: PropTypes.func,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    style: View.propTypes.style
  }

  static defaultProps = {
    visible: false,
    defaultValue: '',
    title: '',
    keyboardType: 'numeric',
    confirmText: strings(STRING_ACTION_OK),
    onConfirm: () => {},
    onCancel: () => {},
    style: null
  }

  state = {
    text: this.props.defaultValue
  }

  constructor (props) {
    super(props)

    this._onConfirmPress = this._onConfirmPress.bind(this)
    this._onChangeText = this._onChangeText.bind(this)
  }

  _onConfirmPress () {
    this.props.onConfirm(this.state.text)
  }

  _onChangeText (text) {
    this.setState({text})
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.props.defaultValue !== nextProps.defaultValue) {
      this.setState({text: nextProps.defaultValue})
    }
  }

  render () {
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}>
        <View style={[styles.container, this.props.style]}>
          <Icon.ToolbarAndroid
            navIconName={'clear'}
            title={this.props.title}
            onIconClicked={this.props.onRequestClose}
            style={{height: 56}}/>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            <TextInput
              value={this.state.text}
              autoFocus={true}
              keyboardType={this.props.keyboardType}
              onSubmitEditing={this._onConfirmPress}
              onChangeText={this._onChangeText}/>
            <View style={styles.buttonsContainer}>
              <TouchableNativeFeedback
                onPress={this._onConfirmPress}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={styles.confirmButton}>
                  <Text style={styles.confirmText}>{this.props.confirmText}</Text>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                onPress={this.props.onCancel}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={[styles.cancelButton, !this.props.cancelText && {display: 'none'}]}>
                  <Text style={styles.cancelText}>{this.props.cancelText}</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </ScrollView>
        </View>
      </Modal>
    )
  }
}