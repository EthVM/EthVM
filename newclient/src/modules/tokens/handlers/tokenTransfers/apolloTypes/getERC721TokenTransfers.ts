/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getERC721TokenTransfers
// ====================================================

export interface getERC721TokenTransfers_getERC721TokenTransfers_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  timestamp: number;
  from: string;
  to: string;
  txFee: string;
}

export interface getERC721TokenTransfers_getERC721TokenTransfers_transfers_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  totalSupply: string | null;
  contract: string;
}

export interface getERC721TokenTransfers_getERC721TokenTransfers_transfers {
  __typename: "ERC721Transfer";
  transfer: getERC721TokenTransfers_getERC721TokenTransfers_transfers_transfer;
  tokenId: string;
  contract: string;
  tokenInfo: getERC721TokenTransfers_getERC721TokenTransfers_transfers_tokenInfo;
}

export interface getERC721TokenTransfers_getERC721TokenTransfers {
  __typename: "ERC721Transfers";
  transfers: (getERC721TokenTransfers_getERC721TokenTransfers_transfers | null)[];
  nextKey: string | null;
}

export interface getERC721TokenTransfers {
  getERC721TokenTransfers: getERC721TokenTransfers_getERC721TokenTransfers;
}

export interface getERC721TokenTransfersVariables {
  hash: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
