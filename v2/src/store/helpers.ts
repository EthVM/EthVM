import { eth } from '@core/helper/eth'
import { Mess } from '@/translations/helpers'
export interface PortfolioItem {
    hash: string
    name: string
}

// eslint-disable-next-line
export const isPortfolioItem = (toBeDetermined: PortfolioItem | any): toBeDetermined is PortfolioItem => {
    if ((<PortfolioItem>toBeDetermined).hash !== undefined && (<PortfolioItem>toBeDetermined).name !== undefined) {
        return toBeDetermined.name !== '' && eth.isValidAddress(toBeDetermined.hash)
    }
    return false
}

export enum NotificationType {
    DELETE_ADR = 'DELETE_ADDRESS',
    PLAIN = 'PLAIN'
}
export interface Notification {
    _type: NotificationType.PLAIN
    text: string
}
export interface NotificationDeleteAddress {
    _type: NotificationType.DELETE_ADR
    hash: string
    name: string
}
export const MAX_PORTFOLIO_ITEMS = 10

export const TIMEOUT = 5000

export const PROMOS = {
    enkrypt: 'enkrypt',
    // todo: delete (from enkrypt raffle)
    // ruffle: 'ruffle',
    mewwallet: 'mewallet'
}

export type Lang = {
    [i in Mess]: {
        title: string
        id: string
    }
}

export const LANGUAGE: Lang = {
    en_US: { title: 'English', id: 'EN' },
    ru_RU: { title: 'Русский', id: 'RU' },
    vi_VN: { title: 'Tiếng Việt', id: 'VN' }
}
