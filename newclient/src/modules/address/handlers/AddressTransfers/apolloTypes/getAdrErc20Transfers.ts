/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAdrERC20Transfers
// ====================================================

export interface getAdrERC20Transfers_getERC20Transfers_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  timestamp: number;
  from: string;
  to: string;
  txFee: string;
}

export interface getAdrERC20Transfers_getERC20Transfers_transfers_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
  symbol: string | null;
  decimals: number | null;
}

export interface getAdrERC20Transfers_getERC20Transfers_transfers {
  __typename: "ERC20Transfer";
  transfer: getAdrERC20Transfers_getERC20Transfers_transfers_transfer;
  value: string;
  contract: string;
  tokenInfo: getAdrERC20Transfers_getERC20Transfers_transfers_tokenInfo;
}

export interface getAdrERC20Transfers_getERC20Transfers {
  __typename: "ERC20Transfers";
  transfers: (getAdrERC20Transfers_getERC20Transfers_transfers | null)[];
  nextKey: string | null;
}

export interface getAdrERC20Transfers {
  getERC20Transfers: getAdrERC20Transfers_getERC20Transfers;
}

export interface getAdrERC20TransfersVariables {
  hash: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
