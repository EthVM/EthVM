/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getERC20Transfer
// ====================================================

export interface getERC20Transfer_getERC20Transfers_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  timestamp: number;
  from: string;
  to: string;
  txFee: string;
}

export interface getERC20Transfer_getERC20Transfers_transfers_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
  symbol: string | null;
  decimals: number | null;
}

export interface getERC20Transfer_getERC20Transfers_transfers {
  __typename: "ERC20Transfer";
  transfer: getERC20Transfer_getERC20Transfers_transfers_transfer;
  value: string;
  contract: string;
  tokenInfo: getERC20Transfer_getERC20Transfers_transfers_tokenInfo;
}

export interface getERC20Transfer_getERC20Transfers {
  __typename: "ERC20Transfers";
  transfers: (getERC20Transfer_getERC20Transfers_transfers | null)[];
  nextKey: string | null;
}

export interface getERC20Transfer {
  getERC20Transfers: getERC20Transfer_getERC20Transfers;
}

export interface getERC20TransferVariables {
  hash: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
