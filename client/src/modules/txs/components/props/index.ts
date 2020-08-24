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
}
