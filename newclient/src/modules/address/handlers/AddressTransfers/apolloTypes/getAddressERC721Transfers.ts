/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAddressERC721Transfers
// ====================================================

export interface getAddressERC721Transfers_getERC721Transfers_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  timestamp: number;
  from: string;
  to: string;
  txFee: string;
}

export interface getAddressERC721Transfers_getERC721Transfers_transfers_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
}

export interface getAddressERC721Transfers_getERC721Transfers_transfers {
  __typename: "ERC721Transfer";
  transfer: getAddressERC721Transfers_getERC721Transfers_transfers_transfer;
  tokenId: string;
  contract: string;
  tokenInfo: getAddressERC721Transfers_getERC721Transfers_transfers_tokenInfo;
}

export interface getAddressERC721Transfers_getERC721Transfers {
  __typename: "ERC721Transfers";
  transfers: (getAddressERC721Transfers_getERC721Transfers_transfers | null)[];
  nextKey: string | null;
}

export interface getAddressERC721Transfers {
  getERC721Transfers: getAddressERC721Transfers_getERC721Transfers;
}

export interface getAddressERC721TransfersVariables {
  hash: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
