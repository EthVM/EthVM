import { pendingTransaction_pendingTransaction as PendingTransferType } from '@app/modules/address//handlers/AddressPendingTx/apolloTypes/pendingTransaction'
import { getPendingTransactions_getPendingTransactions as PendingTxType } from '@app/modules/address/handlers/AddressPendingTx/apolloTypes/getPendingTransactions'
import {
    getAddressEthTransfers_getEthTransfersV2_transfers as TxType,
    getAddressEthTransfers_getEthTransfersV2_transfers_stateDiff as StateDiff
} from '@app/modules/address/handlers/AddressTransfers/apolloTypes/getAddressEthTransfers'
import BN from 'bignumber.js'
import { FormattedNumber, NumberFormatHelper } from '@app/core/helper/number-format-helper'

interface Transfer {
    transfer: TxType | PendingTransferType | PendingTxType
    stateDiff: object
    isPending: boolean
}

export class EthTransfer implements Transfer {
    transfer: TxType | PendingTransferType | PendingTxType
    stateDiff: StateDiff
    isPending: boolean

    constructor(transferData: TxType | PendingTransferType | PendingTxType) {
        this.isPending = transferData.__typename === 'EthTransfer' ? false : true
        this.transfer = transferData
        this.stateDiff = transferData['stateDiff']
    }

    getHash(): string {
        if (this.transfer.__typename === 'EthTransfer') {
            return this.transfer.transfer.transactionHash
        }
        if (this.transfer.__typename === 'Tx') {
            return this.transfer.hash
        }
        return this.transfer.transactionHash
    }

    getFrom(): string {
        return this.transfer.__typename === 'EthTransfer' ? this.transfer.transfer.from : this.transfer.from
    }

    getTo(): string {
        return this.transfer.__typename === 'EthTransfer' ? this.transfer.transfer.to || '' : this.transfer.to || ''
    }

    getFee(): FormattedNumber {
        const fee =
            this.transfer.__typename === 'EthTransfer'
                ? new BN(this.transfer.transfer.txFee)
                : this.transfer.__typename === 'Tx'
                ? new BN(this.transfer.gasPrice).multipliedBy(new BN(this.transfer.gas))
                : new BN(this.transfer.txFee)
        return NumberFormatHelper.formatNonVariableEthValue(fee)
    }

    getTimestamp(): Date {
        if (this.transfer.__typename === 'EthTransfer') {
            return new Date(this.transfer.transfer.timestamp * 1e3)
        }
        if (this.transfer.timestamp !== null) {
            return new Date(this.transfer.timestamp * 1e3)
        }
        return new Date()
    }

    getValue(): FormattedNumber {
        return NumberFormatHelper.formatNonVariableEthValue(new BN(this.transfer.value))
    }

    getStatus(): boolean | null {
        return this.transfer.__typename === 'EthTransfer' ? this.transfer.transfer.status : null
    }

    getIsPending(): boolean {
        return this.isPending
    }

    setPending(pending: boolean): void {
        this.isPending = pending
    }

    /*
    ===================================================================================
      State Balance
    ===================================================================================
    */
    getBalBefore(type: string): FormattedNumber {
        const types = ['out', 'in', 'self']
        if (!this.stateDiff) {
            return { value: '0' }
        }
        return type === types[0] && this.stateDiff.from
            ? NumberFormatHelper.formatNonVariableEthValue(new BN(this.stateDiff.from.before))
            : NumberFormatHelper.formatNonVariableEthValue(new BN(this.stateDiff.to.before))
    }

    getBalAfter(type: string): FormattedNumber {
        const types = ['out', 'in', 'self']
        if (!this.stateDiff) {
            return { value: '0' }
        }
        return type === types[0] && this.stateDiff.from
            ? NumberFormatHelper.formatNonVariableEthValue(new BN(this.stateDiff.from.after))
            : NumberFormatHelper.formatNonVariableEthValue(new BN(this.stateDiff.to.after))
    }
}
