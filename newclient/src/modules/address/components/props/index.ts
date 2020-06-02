import BN from 'bignumber.js'

export interface Address {
    hash: string
    balance: string
    isMiner: boolean
    isContractCreator: boolean
    isContract: boolean
    totalERC20: number
}
