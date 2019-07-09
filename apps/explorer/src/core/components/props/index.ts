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
}

export interface Crumb {
  text: string
  disabled: boolean
  icon?: string
  link?: string
  label?: {
    name: string
    hash?: boolean
  }
  plural?: number
}

export interface SortItem {
  id: number
  text: TranslateResult
  value: string
}

export interface AdrTxBalance {
  type?: string
  status: boolean
  value: string
  fee: string
  balBefore: number
  balAfter: number
}
