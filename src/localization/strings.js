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
export const STRING_ACTION_IMPORT = 'actionImport'
export const STRING_ACTION_EXPORT = 'actionExport'
export const STRING_ACTION_SEARCH = 'actionSearch'
export const STRING_ACTION_SETTINGS = 'actionSettings'

export const STRING_EMPTY_DATA = 'emptyData'
export const STRING_NOTIFICATION = 'notification'
export const STRING_CODE_CREATING = 'creating'
export const STRING_CODE_EDITING = 'editing'
export const STRING_CODE_ENTER = 'enter'

export const STRING_SETTINGS_COUNT_SESSION_PRIMARY = 'settingsCountSessionPrimary'
export const STRING_SETTINGS_COUNT_SESSION_SECONDARY = 'settingsCountSessionSecondary'
export const STRING_SETTINGS_COUNT_SESSION_HINT = 'settingsCountSessionHint'
export const STRING_SETTINGS_COUNT_SESSION_DESCRIPTION = 'settingsCountSessionDescription'
export const STRING_SETTINGS_COUNT_SESSION_OVERFLOW = 'settingsCountSessionOverflow'
export const STRING_SETTINGS_ABOUT = 'settingsAbout'
export const STRING_SETTINGS_ABOUT_CONTENT = 'settingsAboutContent'

export const STRING_PROGRESS_IMPORT_DATA = 'progressImportData'
export const STRING_PROGRESS_EXPORT_DATA = 'progressExportData'
export const STRING_PROGRESS_OPENING_SESSION = 'progressOpeningSession'
export const STRING_PROGRESS_CLOSING_SESSION = 'progressClosingSession'
export const STRING_PROGRESS_VERIFY_APP = 'progressVerifyApp'

export const STRING_TITLE_SETTINGS = 'titleSettings'
export const STRING_TITLE_SESSIONS = 'titleSessions'
export const STRING_TITLE_SESSION_DETAIL = 'titleSessionDetail'
export const STRING_TITLE_SELECT_OPERATOR = 'titleSelectOperator'
export const STRING_TITLE_SELECT_STORING_PLACE = 'titleSelectStoringPlace'
export const STRING_TITLE_SELECT_OPERATION = 'titleSelectOperation'
export const STRING_TITLE_SCANNER = 'titleScanner'

export const STRING_ERROR_DEVICE_NOT_SUPPORTED = 'deviceNotSupported'
export const STRING_ERROR_IMPORT_DATA = 'errorImportData'
export const STRING_ERROR_EXPORT_DATA = 'errorExportData'
export const STRING_ERROR_CLOSING_SESSION = 'errorClosingSession'
export const STRING_ERROR_SCANNING = 'errorScanning'
export const STRING_ERROR_REPEAT_CODE = 'errorRepeatCode'

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