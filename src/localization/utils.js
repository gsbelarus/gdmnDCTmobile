import 'moment/locale/ru'
import 'moment/locale/be'
import moment from 'moment'
import { getLocale } from './strings'

export function formatDate (date, format, locale) {
  return moment(date).locale(locale || getLocale()).format(format)
}