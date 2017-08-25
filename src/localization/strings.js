import I18n from 'react-native-i18n'

export const STRING_TITLE_SESSIONS = 'titleSessions'
export const STRING_TITLE_SELECT_OPERATOR = 'titleSelectOperator'
export const STRING_TITLE_SELECT_STORING_PLACE = 'titleSelectStoringPlace'
export const STRING_TITLE_SELECT_OPERATION = 'titleSelectOperation'
export const STRING_TITLE_SCANNER = 'titleScanner'

I18n.fallbacks = true
I18n.translations = {
  ru: {
    [STRING_TITLE_SESSIONS]: 'Сессии',
    [STRING_TITLE_SELECT_OPERATOR]: 'Выберите оператора',
    [STRING_TITLE_SELECT_STORING_PLACE]: 'Выберите место хранения',
    [STRING_TITLE_SELECT_OPERATION]: 'Выберите операцию',
    [STRING_TITLE_SCANNER]: 'Сессия открыта...'
  }
}

export default I18n.t