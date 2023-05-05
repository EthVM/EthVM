import { TransferType } from '@/apollo/types'

export interface Tx {
    hash: string
    block: string
    from: string
    to: string
    timestamp: Date
    fee: string
    value: string
    status: boolean
    isMined: boolean
}

export interface PendingTx {
    transactionHash: string
    from: string
    to: string | null
    txFee: string
    value: string
    timestamp: number
    isMined: boolean
}

export interface Action {
    value: string
    from: string
    to: string
    type: TransferType
}
