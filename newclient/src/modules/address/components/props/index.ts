export interface Address {
    hash: string
    balance: string
    isMiner: boolean
    isContractCreator: boolean
    isContract: boolean
    totalERC20: number
}

import { FormattedNumber } from '@app/core/helper/number-format-helper'

export interface Tx {
    hash: string
    block: string
    from: string
    to: string
    timestamp: Date
    fee: FormattedNumber
    value: FormattedNumber
    status: boolean
    contractAddress: string
}

export interface Contract {
    timestamp: number
    block: number
    codeHash: string
    creator: string
    transactionHash: string
}
