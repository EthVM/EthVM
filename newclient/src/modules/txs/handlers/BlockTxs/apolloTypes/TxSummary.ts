/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TxSummary
// ====================================================

export interface TxSummary_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  to: string;
  block: number;
  timestamp: number;
  from: string;
  txFee: string;
  status: boolean | null;
}

export interface TxSummary_transfers {
  __typename: "EthTransfer";
  transfer: TxSummary_transfers_transfer;
  value: string;
}

export interface TxSummary {
  __typename: "ETHTransfers";
  transfers: (TxSummary_transfers | null)[];
}
