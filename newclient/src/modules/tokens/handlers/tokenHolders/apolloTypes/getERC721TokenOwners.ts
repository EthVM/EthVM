/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getERC721TokenOwners
// ====================================================

export interface getERC721TokenOwners_getERC721TokenOwners_owners_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  totalSupply: string | null;
  contract: string;
}

export interface getERC721TokenOwners_getERC721TokenOwners_owners {
  __typename: "ERC721TokenOwner";
  tokenInfo: getERC721TokenOwners_getERC721TokenOwners_owners_tokenInfo;
  owner: string;
  token: string;
}

export interface getERC721TokenOwners_getERC721TokenOwners {
  __typename: "ERC721TokenOwners";
  owners: (getERC721TokenOwners_getERC721TokenOwners_owners | null)[];
  nextKey: string | null;
}

export interface getERC721TokenOwners {
  /**
   * Returns a list of all addresses that own an ERC721Token
   */
  getERC721TokenOwners: getERC721TokenOwners_getERC721TokenOwners;
}

export interface getERC721TokenOwnersVariables {
  contract: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
