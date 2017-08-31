import {
  STRING_ACTION_CANCEL,
  STRING_ACTION_CLOSE_SESSION,
  STRING_ACTION_CONFIRM,
  STRING_ACTION_DELETE,
  STRING_ACTION_HIDE,
  STRING_ACTION_OK,
  STRING_ACTION_OPEN_SESSION,
  STRING_ACTION_REPEAT,
  STRING_ACTION_SAVE,
  STRING_PROGRESS_CLOSING_SESSION,
  STRING_EMPTY_DATA,
  STRING_ERROR_CLOSING_SESSION,
  STRING_ERROR_DEVICE_NOT_SUPPORTED,
  STRING_ERROR_LOADING_DATA,
  STRING_ERROR_SCANNING,
  STRING_PROGRESS_LOADING_DATA,
  STRING_NOTIFICATION,
  STRING_PROGRESS_OPENING_SESSION,
  STRING_TITLE_CREATING,
  STRING_TITLE_EDITING,
  STRING_TITLE_SCANNER,
  STRING_TITLE_SELECT_OPERATION,
  STRING_TITLE_SELECT_OPERATOR,
  STRING_TITLE_SELECT_STORING_PLACE,
  STRING_TITLE_SESSIONS, STRING_PROGRESS_VERIFY_APP, STRING_ERROR_REPEAT_CODE
} from '../strings'

export default () => ({
  [STRING_ACTION_OK]: 'Ok',
  [STRING_ACTION_CONFIRM]: 'Да',
  [STRING_ACTION_CANCEL]: 'Отмена',
  [STRING_ACTION_HIDE]: 'Скрыть',
  [STRING_ACTION_SAVE]: 'Сохранить',
  [STRING_ACTION_DELETE]: 'Удалить',
  [STRING_ACTION_REPEAT]: 'Повторить',
  [STRING_ACTION_OPEN_SESSION]: 'Открыть сессию',
  [STRING_ACTION_CLOSE_SESSION]: 'Закрыть сессию',

  [STRING_EMPTY_DATA]: 'Данные отсутствуют',
  [STRING_NOTIFICATION]: 'Уведомление',

  [STRING_PROGRESS_LOADING_DATA]: 'Загрузка данных...',
  [STRING_PROGRESS_OPENING_SESSION]: 'Открытие сессии...',
  [STRING_PROGRESS_CLOSING_SESSION]: 'Закрытие сессии...',
  [STRING_PROGRESS_VERIFY_APP]: 'Проверка устройства...',

  [STRING_TITLE_SESSIONS]: 'Сессии',
  [STRING_TITLE_SELECT_OPERATOR]: 'Выберите оператора',
  [STRING_TITLE_SELECT_STORING_PLACE]: 'Выберите место хранения',
  [STRING_TITLE_SELECT_OPERATION]: 'Выберите операцию',
  [STRING_TITLE_SCANNER]: 'Сессия открыта...',
  [STRING_TITLE_CREATING]: 'Создание',
  [STRING_TITLE_EDITING]: 'Редактирование',

  [STRING_ERROR_DEVICE_NOT_SUPPORTED]: 'Устройство не поддерживается',
  [STRING_ERROR_LOADING_DATA]: 'Не удалось загрузить данные',
  [STRING_ERROR_CLOSING_SESSION]: 'Не удалось закрыть сессию',
  [STRING_ERROR_SCANNING]: 'Не удалось считать код',
  [STRING_ERROR_REPEAT_CODE]: 'Код уже отсканирован'
})