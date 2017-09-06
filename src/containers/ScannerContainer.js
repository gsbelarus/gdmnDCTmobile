import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import connectRealm from '../realm/react/connectRealm'
import SessionModel from '../realm/models/SessionModel'
import Scanner from '../components/Scanner'
import {
  deleteAndDismissEditor, deleteCode,
  dismissEditor,
  onScanned,
  saveAndDismissEditor,
  showEditor
} from '../redux/actions/scannerActions'

const ReduxScannerContainer = connect(
  (state) => ({
    editorVisible: state.scannerState.editorVisible,
    editorDefaultValue: state.scannerState.editorDefaultValue,
    editorTitle: state.scannerState.editorTitle,
    editorConfirmText: state.scannerState.editorConfirmText,
    editorCancelText: state.scannerState.editorCancelText
  }),
  (dispatch, ownProps) => ({
    onAddItemPress: bindActionCreators(showEditor, dispatch),
    onItemPress: bindActionCreators(showEditor, dispatch),
    onEditorRequestClose: bindActionCreators(dismissEditor, dispatch),
    onItemIconRightPress: (item) => dispatch(deleteCode(ownProps.realm, item)),
    onEditorConfirm: (text) => dispatch(saveAndDismissEditor(ownProps.realm, text)),
    onEditorCancel: () => dispatch(deleteAndDismissEditor(ownProps.realm)),
    onScanned: (scanResult) => dispatch(onScanned(ownProps.realm, scanResult))
  })
)(Scanner)

export default connectRealm(
  (realm, ownProps) => ({
    realm,
    items: SessionModel.getOpenedSession(realm).codes
  }),
  (extraData, ownProps) => ({...ownProps, extra: extraData})
)(ReduxScannerContainer)