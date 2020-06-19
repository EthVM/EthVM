/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getEthTransfers
// ====================================================

export interface getEthTransfers_getEthTransfers_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  timestamp: number;
  from: string;
  to: string;
  txFee: string;
  status: boolean | null;
}

export interface getEthTransfers_getEthTransfers_transfers {
  __typename: "EthTransfer";
  transfer: getEthTransfers_getEthTransfers_transfers_transfer;
  value: string;
}

export interface getEthTransfers_getEthTransfers {
  __typename: "ETHTransfers";
  transfers: (getEthTransfers_getEthTransfers_transfers | null)[];
  nextKey: string | null;
}

export interface getEthTransfers {
  getEthTransfers: getEthTransfers_getEthTransfers;
}

export interface getEthTransfersVariables {
  hash: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
