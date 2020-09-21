/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: pendingTx
// ====================================================

export interface pendingTx_pendingTransaction {
  __typename: "PendingTransfer";
  transactionHash: string;
  from: string;
  to: string | null;
  txFee: string;
  value: string;
  timestamp: number;
}

export interface pendingTx {
  pendingTransaction: pendingTx_pendingTransaction;
}

export interface pendingTxVariables {
  owner?: string | null;
}
