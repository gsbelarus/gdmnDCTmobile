import 'moment/locale/ru'
import 'moment/locale/be'
import moment from 'moment'
import { getLocale } from './strings'

export function formatDate (date, format, locale) {
  locale = locale || getLocale()
  switch (locale) {
    case 'ru-RU':
      locale = 'ru'
      break
  }
  return moment(date).locale(locale).format(format)
}