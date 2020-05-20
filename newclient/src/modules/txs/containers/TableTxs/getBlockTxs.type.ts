/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getBlockTxs
// ====================================================

export interface getBlockTxs_getBlockTransfers_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  to: string;
  block: number;
  timestamp: number;
  from: string;
  txFee: string;
}

export interface getBlockTxs_getBlockTransfers_transfers {
  __typename: "EthTransfer";
  transfer: getBlockTxs_getBlockTransfers_transfers_transfer;
}

export interface getBlockTxs_getBlockTransfers {
  __typename: "ETHTransfers";
  transfers: (getBlockTxs_getBlockTransfers_transfers | null)[];
}

export interface getBlockTxs {
  getBlockTransfers: getBlockTxs_getBlockTransfers;
}

export interface getBlockTxsVariables {
  _number?: number | null;
}
