/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAddressERC20Transfers
// ====================================================

export interface getAddressERC20Transfers_getERC20Transfers_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  timestamp: number;
  from: string;
  to: string;
  txFee: string;
}

export interface getAddressERC20Transfers_getERC20Transfers_transfers_stateDiff_to {
  __typename: "BalanceDiff";
  before: string;
  after: string;
}

export interface getAddressERC20Transfers_getERC20Transfers_transfers_stateDiff_from {
  __typename: "BalanceDiff";
  before: string;
  after: string;
}

export interface getAddressERC20Transfers_getERC20Transfers_transfers_stateDiff {
  __typename: "StateDiffChange";
  to: getAddressERC20Transfers_getERC20Transfers_transfers_stateDiff_to;
  from: getAddressERC20Transfers_getERC20Transfers_transfers_stateDiff_from | null;
}

export interface getAddressERC20Transfers_getERC20Transfers_transfers_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
  symbol: string | null;
  decimals: number | null;
}

export interface getAddressERC20Transfers_getERC20Transfers_transfers {
  __typename: "ERC20Transfer";
  transfer: getAddressERC20Transfers_getERC20Transfers_transfers_transfer;
  stateDiff: getAddressERC20Transfers_getERC20Transfers_transfers_stateDiff | null;
  value: string;
  contract: string;
  tokenInfo: getAddressERC20Transfers_getERC20Transfers_transfers_tokenInfo;
}

export interface getAddressERC20Transfers_getERC20Transfers {
  __typename: "ERC20Transfers";
  transfers: (getAddressERC20Transfers_getERC20Transfers_transfers | null)[];
  nextKey: string | null;
}

export interface getAddressERC20Transfers {
  getERC20Transfers: getAddressERC20Transfers_getERC20Transfers;
}

export interface getAddressERC20TransfersVariables {
  hash: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
