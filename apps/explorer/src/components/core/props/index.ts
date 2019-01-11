export interface Breadcumb {
  text?: string
  disabled?: boolean
  icon?: string
  link?: string
}

export interface Footnote {
  color?: string
  text?: string
  icon?: string
}

export interface Tab {
  id: string
  title: string
  isActive: boolean
}

export interface Detail {
  title: string
  detail: string
  copy: boolean
  link: string
}

export interface BlockDetailsTitle {
  mined: boolean
  next?: string
  prev?: string
  uncles?: string[]
}

export interface Account {
  address: string
  balance: number
  balanceUSD: number
  ethusd: number
  totalTxs: number
  isMiner: boolean
  conCreator: boolean
}
