import { handleActions } from 'redux-actions'
import {
  changeCode,
  dismissEditor,
  showEditor,
  toggleSelector,
  updateSelectorSearch,
  updateStoringPlace,
} from '../actions/scannerActions'
import strings, { STRING_CODE_CREATING, STRING_CODE_EDITING } from '../../localization/strings'

const defaultState = {
  editorVisible: false,
  editorTitle: null,
  editorCanDelete: false,
  selectorVisible: false,
  selectorSearch: '',
  storingPlace: null,
  code: null,
  tmpCode: null
}

export default handleActions({
  [showEditor]: (state, action) => ({
    ...state,
    editorVisible: true,
    editorTitle: action.payload ? strings(STRING_CODE_EDITING) : strings(STRING_CODE_CREATING),
    editorCanDelete: action.payload ? true : null,
    code: action.payload,
    tmpCode: action.payload
  }),
  [dismissEditor]: (state, action) => ({
    ...state,
    editorVisible: false,
    code: null,
    tmpCode: null
  }),
  [changeCode]: (state, action) => ({
    ...state,
    tmpCode: action.payload
  }),
  [toggleSelector]: (state, action) => ({
    ...state,
    selectorVisible: action.payload,
    editorVisible: !action.payload,
    selectorSearch: action.payload ? '' : state.selectorSearch
  }),
  [updateStoringPlace]: (state, action) => ({
    ...state,
    storingPlace: action.payload
  }),
  [updateSelectorSearch]: (state, action) => ({
    ...state,
    selectorSearch: action.payload
  })
}, defaultState)