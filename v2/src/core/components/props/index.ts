export interface NavMenuEntry {
    header: NavHeader
    links?: NavLink[]
}

export interface NavLink {
    text: string
    routerLink: string
    name: string
}

export interface NavHeader {
    text: string
    icon: string
    routerLink?: string
}

export interface Footnote {
    color: string
    text: string
    icon?: string
}

export interface Tab {
    id: number
    title: string
    isActive: boolean
}

export interface Detail {
    title: string
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
    text: string
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
export interface SearchTokenOption {
    text: string
    contract: string
}
