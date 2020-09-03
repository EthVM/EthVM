/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getERC20TokenTransfers
// ====================================================

export interface getERC20TokenTransfers_getERC20TokenTransfers_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  timestamp: number;
  from: string;
  to: string;
  txFee: string;
}

export interface getERC20TokenTransfers_getERC20TokenTransfers_transfers {
  __typename: "ERC20Transfer";
  transfer: getERC20TokenTransfers_getERC20TokenTransfers_transfers_transfer;
  value: string;
}

export interface getERC20TokenTransfers_getERC20TokenTransfers {
  __typename: "ERC20Transfers";
  transfers: (getERC20TokenTransfers_getERC20TokenTransfers_transfers | null)[];
  nextKey: string | null;
}

export interface getERC20TokenTransfers {
  getERC20TokenTransfers: getERC20TokenTransfers_getERC20TokenTransfers;
}

export interface getERC20TokenTransfersVariables {
  hash: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
