import I18n from 'react-native-i18n'
import ru from './locales/ru'

export const STRING_ACTION_OK = 'actionOk'
export const STRING_ACTION_CONFIRM = 'actionConfirm'
export const STRING_ACTION_CANCEL = 'actionCancel'
export const STRING_ACTION_HIDE = 'actionHide'
export const STRING_ACTION_SAVE = 'actionSave'
export const STRING_ACTION_DELETE = 'actionDelete'
export const STRING_ACTION_REPEAT = 'actionRepeat'
export const STRING_ACTION_OPEN_SESSION = 'actionOpenSession'
export const STRING_ACTION_CLOSE_SESSION = 'actionCloseSession'

export const STRING_EMPTY_DATA = 'emptyData'
export const STRING_LOADING_DATA = 'loadingData'
export const STRING_CLOSING_SESSION = 'closingSession'
export const STRING_NOTIFICATION = 'notification'

export const STRING_TITLE_SESSIONS = 'titleSessions'
export const STRING_TITLE_SELECT_OPERATOR = 'titleSelectOperator'
export const STRING_TITLE_SELECT_STORING_PLACE = 'titleSelectStoringPlace'
export const STRING_TITLE_SELECT_OPERATION = 'titleSelectOperation'
export const STRING_TITLE_SCANNER = 'titleScanner'
export const STRING_TITLE_CREATING = 'titleCreating'
export const STRING_TITLE_EDITING = 'titleEditing'

export const STRING_ERROR_DEVICE_NOT_SUPPORTED = 'deviceNotSupported'
export const STRING_ERROR_LOADING_DATA = 'errorLoadingData'
export const STRING_ERROR_CLOSING_SESSION = 'errorClosingSession'
export const STRING_ERROR_SCANNING = 'errorScanning'

I18n.fallbacks = true
I18n.translations = {
  'ru-RU': ru()
}

export function setLocale (locale) {
  I18n.locale = locale
}

export function getLocale () {
  return I18n.locale
}

export default I18n.translate.bind(I18n)