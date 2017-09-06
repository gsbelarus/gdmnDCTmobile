import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import ActionButton from 'react-native-action-button'
import ScannerApi from 'react-native-android-scanner'
import CodeModel from '../realm/models/CodeModel'
import List from './List/index'
import ListItem from './ListItem/index'
import InputModal from './InputModal/index'

export default class Scanner extends PureComponent {

  static propTypes = {
    extra: PropTypes.any,
    items: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        disabled: PropTypes.bool
      })),
      PropTypes.object
    ]),
    editorVisible: PropTypes.bool,
    editorDefaultValue: PropTypes.string,
    editorTitle: PropTypes.string,
    editorConfirmText: PropTypes.string,
    editorCancelText: PropTypes.string,
    onItemPress: PropTypes.func,
    onItemIconRightPress: PropTypes.func,
    onAddItemPress: PropTypes.func,
    onScanned: PropTypes.func,
    onEditorRequestClose: PropTypes.func,
    onEditorConfirm: PropTypes.func,
    onEditorCancel: PropTypes.func
  }

  constructor () {
    super()

    this._renderItem = this._renderItem.bind(this)
  }

  componentDidMount () {
    ScannerApi.addListener(this.props.onScanned)
  }

  componentWillUnmount () {
    ScannerApi.removeListener(this.props.onScanned)
  }

  _renderItem ({item}) {
    return (
      <ListItem
        id={item.id}
        primaryText={item.name}
        disabled={item.disabled}
        iconRightName={'clear'}
        onItemPress={() => this.props.onItemPress(item)}
        onItemIconRightPress={() => this.props.onItemIconRightPress(item)}/>
    )
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <List
          extra={this.props.extra}
          items={this.props.items}
          renderItem={this._renderItem}/>
        <ActionButton onPress={this.props.onAddItemPress}/>
        <InputModal
          visible={this.props.editorVisible}
          onRequestClose={this.props.onEditorRequestClose}
          maxLength={CodeModel.NAME_MAX_LENGTH}
          defaultValue={this.props.editorDefaultValue}
          title={this.props.editorTitle}
          confirmText={this.props.editorConfirmText}
          cancelText={this.props.editorCancelText}
          onConfirm={this.props.onEditorConfirm}
          onCancel={this.props.onEditorCancel}/>
      </View>
    )
  }
}