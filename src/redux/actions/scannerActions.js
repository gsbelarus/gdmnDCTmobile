import { createAction } from 'redux-actions'

export const showEditor = createAction('SHOW_EDITOR')
export const dismissEditor = createAction('DISMISS_EDITOR')
export const changeCode = createAction('CHANGE_CODE')

export const toggleSelector = createAction('TOGGLE_SELECTOR')
export const updateStoringPlace = createAction('UPDATE_STORING_PLACE')
export const updateSelectorSearch = createAction('UPDATE_SELECTOR_SEARCH')