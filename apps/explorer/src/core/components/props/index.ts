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
  color?: string
  text?: TranslateResult
  icon?: string
}

export interface Tab {
  id: string
  title: TranslateResult
  isActive: boolean
}

export interface Detail {
  title: TranslateResult
  detail?: string | number
  link?: string
  copy?: boolean
  txInput?: string[],
  mono?: boolean
}

export interface Crumb {
  text: string | TranslateResult
  disabled: boolean
  icon?: string
  link?: string
}
