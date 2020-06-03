/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTxs
// ====================================================

export interface getTxs_getEthTransfers_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  timestamp: number;
  from: string;
  to: string;
  txFee: string;
}

export interface getTxs_getEthTransfers_transfers {
  __typename: "EthTransfer";
  transfer: getTxs_getEthTransfers_transfers_transfer;
  value: string;
}

export interface getTxs_getEthTransfers {
  __typename: "ETHTransfers";
  transfers: (getTxs_getEthTransfers_transfers | null)[];
  nextKey: string | null;
}

export interface getTxs {
  /**
   * ------------------------------------------------
   * Transfers:
   * ------------------------------------------------
   */
  getEthTransfers: getTxs_getEthTransfers;
}

export interface getTxsVariables {
  hash: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
