/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getBlockTransfers
// ====================================================

export interface getBlockTransfers_getBlockTransfers_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  to: string;
  block: number;
  timestamp: number;
  from: string;
  txFee: string;
  status: boolean | null;
}

export interface getBlockTransfers_getBlockTransfers_transfers {
  __typename: "EthTransfer";
  transfer: getBlockTransfers_getBlockTransfers_transfers_transfer;
  value: string;
}

export interface getBlockTransfers_getBlockTransfers {
  __typename: "ETHTransfers";
  transfers: (getBlockTransfers_getBlockTransfers_transfers | null)[];
}

export interface getBlockTransfers {
  getBlockTransfers: getBlockTransfers_getBlockTransfers;
}

export interface getBlockTransfersVariables {
  _number?: number | null;
}
