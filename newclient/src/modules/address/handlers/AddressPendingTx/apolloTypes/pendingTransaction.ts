/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: pendingTransaction
// ====================================================

export interface pendingTransaction_pendingTransaction {
  __typename: "PendingTransfer";
  transactionHash: string;
  txFee: string;
}

export interface pendingTransaction {
  pendingTransaction: pendingTransaction_pendingTransaction;
}

export interface pendingTransactionVariables {
  owner: string;
}
