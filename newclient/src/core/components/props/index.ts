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
    detail?: string | number | null
    link?: string
    copy?: boolean
    txInput?: string[] | string
    mono?: boolean
    priceChange?: number | null
    tooltip?: string
    toChecksum?: boolean
}

export interface Crumb {
    text: TranslateResult | string
    link?: string
    hash?: string
}

export interface State {
    status?: string
    balAfter: string
    data: object[]
    title?: string
    blockNumber?: number
}

export enum EnumAdrChips {
    miner = 'miner',
    creator = 'creator',
    contract = 'contract',
    verified = 'verified'
}
