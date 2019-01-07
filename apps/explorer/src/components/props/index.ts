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
