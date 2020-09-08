/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllTxs
// ====================================================

export interface getAllTxs_getAllEthTransfers_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  to: string;
  block: number;
  timestamp: number;
  from: string;
  txFee: string;
  status: boolean | null;
}

export interface getAllTxs_getAllEthTransfers_transfers {
  __typename: "EthTransfer";
  transfer: getAllTxs_getAllEthTransfers_transfers_transfer;
  value: string;
}

export interface getAllTxs_getAllEthTransfers {
  __typename: "ETHTransfers";
  transfers: (getAllTxs_getAllEthTransfers_transfers | null)[];
  nextKey: string | null;
}

export interface getAllTxs {
  getAllEthTransfers: getAllTxs_getAllEthTransfers;
}

export interface getAllTxsVariables {
  _limit?: number | null;
  _nextKey?: string | null;
}
