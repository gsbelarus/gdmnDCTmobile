import { handleActions } from 'redux-actions'
import strings, {
  STRING_ACTION_DELETE,
  STRING_ACTION_SAVE,
  STRING_TITLE_CREATING,
  STRING_TITLE_EDITING
} from '../../localization/strings'
import { dismissEditor, showEditor } from '../actions/scannerActions'

const defaultState = {
  editorVisible: false,
  editorDefaultValue: null,
  editorTitle: '',
  editorConfirmText: strings(STRING_ACTION_SAVE),
  editorCancelText: null,
  editableItemKey: null
}

export default handleActions({
  [showEditor]: (state, action) => ({
    ...state,
    editorVisible: true,
    editorDefaultValue: (action.payload && action.payload.name) || '',
    editorTitle: action.payload ? strings(STRING_TITLE_EDITING) : strings(STRING_TITLE_CREATING),
    editorCancelText: action.payload ? strings(STRING_ACTION_DELETE) : null,
    editableItemKey: action.payload ? action.payload.id : null
  }),
  [dismissEditor]: (state, action) => ({
    ...state,
    editorVisible: false,
    editorDefaultValue: null,
    editableItemKey: null
  })
}, defaultState)