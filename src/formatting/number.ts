import { currentLanguage } from './locale'

export function number (input: number, options: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat(currentLanguage(), options).format(input)
}
