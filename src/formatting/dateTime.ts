import { Moment } from 'moment'
import { currentLanguage } from './locale'

function parseDate (input: string|Moment|Date): Date {
  if (!input) {
    input = ''
  }
  if (input instanceof Date) {
    return input
  } else if (typeof input === 'string') {
    return new Date(input)
  } else {
    return (input as Moment).toDate()
  }
}

export function dateTime (input: string|Moment|Date, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }): string {
  return parseDate(input).toLocaleString(currentLanguage(), options)
}

export function date (input: string|Moment|Date, options: Intl.DateTimeFormatOptions = {}): string {
  return parseDate(input).toLocaleDateString(currentLanguage(), options)
}

export function time (input: string|Moment|Date, options: Intl.DateTimeFormatOptions = {}): string {
  return parseDate(input).toLocaleDateString(currentLanguage(), options)
}
