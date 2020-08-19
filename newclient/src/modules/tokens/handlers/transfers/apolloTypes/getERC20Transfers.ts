/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getERC20Transfers
// ====================================================

export interface getERC20Transfers_getERC20Transfers_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  timestamp: number;
  from: string;
  to: string;
  txFee: string;
}

export interface getERC20Transfers_getERC20Transfers_transfers_stateDiff_to {
  __typename: "BalanceDiff";
  before: string;
  after: string;
}

export interface getERC20Transfers_getERC20Transfers_transfers_stateDiff_from {
  __typename: "BalanceDiff";
  before: string;
  after: string;
}

export interface getERC20Transfers_getERC20Transfers_transfers_stateDiff {
  __typename: "StateDiffChange";
  to: getERC20Transfers_getERC20Transfers_transfers_stateDiff_to;
  from: getERC20Transfers_getERC20Transfers_transfers_stateDiff_from | null;
}

export interface getERC20Transfers_getERC20Transfers_transfers {
  __typename: "ERC20Transfer";
  transfer: getERC20Transfers_getERC20Transfers_transfers_transfer;
  stateDiff: getERC20Transfers_getERC20Transfers_transfers_stateDiff | null;
  value: string;
}

export interface getERC20Transfers_getERC20Transfers {
  __typename: "ERC20Transfers";
  transfers: (getERC20Transfers_getERC20Transfers_transfers | null)[];
  nextKey: string | null;
}

export interface getERC20Transfers {
  getERC20Transfers: getERC20Transfers_getERC20Transfers;
}

export interface getERC20TransfersVariables {
  hash: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
