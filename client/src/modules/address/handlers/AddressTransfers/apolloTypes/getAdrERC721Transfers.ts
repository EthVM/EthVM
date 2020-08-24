/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAdrERC721Transfers
// ====================================================

export interface getAdrERC721Transfers_getERC721Transfers_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  timestamp: number;
  from: string;
  to: string;
  txFee: string;
}

export interface getAdrERC721Transfers_getERC721Transfers_transfers_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
}

export interface getAdrERC721Transfers_getERC721Transfers_transfers {
  __typename: "ERC721Transfer";
  transfer: getAdrERC721Transfers_getERC721Transfers_transfers_transfer;
  token: string;
  contract: string;
  tokenInfo: getAdrERC721Transfers_getERC721Transfers_transfers_tokenInfo;
}

export interface getAdrERC721Transfers_getERC721Transfers {
  __typename: "ERC721Transfers";
  transfers: (getAdrERC721Transfers_getERC721Transfers_transfers | null)[];
  nextKey: string | null;
}

export interface getAdrERC721Transfers {
  getERC721Transfers: getAdrERC721Transfers_getERC721Transfers;
}

export interface getAdrERC721TransfersVariables {
  hash: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
