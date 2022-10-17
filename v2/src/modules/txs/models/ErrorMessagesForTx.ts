export enum ErrorMessageTx {
    details = 'Something went wrong while retrieving transaction details.',
    notFound = 'This transaction does not exist'
}

export enum ErrorMessagePendingTx {
    details = 'message.error.tx.pending'
}

export enum TitleStatus {
    success = 'Successful',
    failed = 'Failed',
    pending = 'Pending',
    replaced = 'Replaced'
}

export enum TxStatus {
    success = 'Successful Tx',
    failed = 'Failed Tx',
    pending = 'Pending Tx',
    replaced = 'Replaced Tx'
}
