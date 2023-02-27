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
