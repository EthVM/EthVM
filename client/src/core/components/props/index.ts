import { TranslateResult } from 'vue-i18n'

export interface NavMenuEntry {
  header: NavHeader
  links?: NavLink[]
}

export interface NavLink {
  text: TranslateResult
  routerLink: string
  name: string
}

export interface NavHeader {
  text: TranslateResult
  icon: string
  routerLink?: string
}

export interface Footnote {
  color: string
  text: TranslateResult
  icon?: string
}

export interface Tab {
  id: number
  title: TranslateResult
  isActive: boolean
}

export interface Detail {
  title: TranslateResult
  detail?: string | number
  link?: string
  copy?: boolean
  txInput?: string[]
  mono?: boolean
  priceChange?: string
  tooltip?: string
}

export interface Crumb {
  text: TranslateResult | string
  link?: string
  hash?: string
}
