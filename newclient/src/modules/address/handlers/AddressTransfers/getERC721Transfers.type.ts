/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getERC721Transfers
// ====================================================

export interface getERC721Transfers_getERC721Transfers_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  block: number;
  timestamp: number;
  from: string;
  to: string;
  txFee: string;
  status: boolean | null;
}

export interface getERC721Transfers_getERC721Transfers_transfers_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
}

export interface getERC721Transfers_getERC721Transfers_transfers {
  __typename: "ERC721Transfer";
  transfer: getERC721Transfers_getERC721Transfers_transfers_transfer;
  token: string;
  contract: string;
  tokenInfo: getERC721Transfers_getERC721Transfers_transfers_tokenInfo;
}

export interface getERC721Transfers_getERC721Transfers {
  __typename: "ERC721Transfers";
  transfers: (getERC721Transfers_getERC721Transfers_transfers | null)[];
  nextKey: string | null;
}

export interface getERC721Transfers {
  getERC721Transfers: getERC721Transfers_getERC721Transfers;
}

export interface getERC721TransfersVariables {
  hash: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
