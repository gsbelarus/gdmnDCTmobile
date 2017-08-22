import { handleActions } from 'redux-actions'
import { dismissEditor, showEditor } from '../actions/scannerActions'

const defaultState = {
  editorVisible: false,
  editorDefaultValue: null,
  editorTitle: '',
  editorConfirmText: 'Сохранить',
  editorCancelText: null,
  editableItem: null,
}

export default handleActions({
  [showEditor]: (state, action) => ({
    ...state,
    editorVisible: true,
    editorDefaultValue: (action.payload && action.payload.name) || '',
    editorTitle: action.payload ? 'Редактирование' : 'Создание',
    editorCancelText: action.payload ? 'Удалить' : null,
    editableItem: action.payload
  }),
  [dismissEditor]: (state, action) => ({
    ...state,
    editorVisible: false,
    editorDefaultValue: null,
    editableItem: null
  })
}, defaultState)