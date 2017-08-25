import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import ActionButton from 'react-native-action-button'
import ScannerApi from 'react-native-android-scanner'
import CodeModel from '../realm/models/CodeModel'
import List from '../components/List/index'
import SimpleListItem from '../components/SimpleListItem/index'
import InputModal from '../components/InputModal/index'

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
    onAddItemPress: PropTypes.func,
    onScanned: PropTypes.func,
    onEditorRequestClose: PropTypes.func,
    onEditorConfirm: PropTypes.func,
    onEditorCancel: PropTypes.func
  }

  constructor () {
    super()

    this.renderItem = this.renderItem.bind(this)
  }

  componentDidMount () {
    ScannerApi.addListener(this.props.onScanned)
  }

  componentWillUnmount () {
    ScannerApi.removeListener(this.props.onScanned)
  }

  renderItem ({item}) {
    return <SimpleListItem
      id={item.id}
      primaryText={item.name}
      disabled={item.disabled}
      onPress={() => this.props.onItemPress(item)}/>
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <List
          extra={this.props.extra}
          items={this.props.items}
          renderItem={this.renderItem}/>
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