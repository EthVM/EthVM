/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ERC721TokenOwners
// ====================================================

export interface ERC721TokenOwners_owners_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  totalSupply: string | null;
  contract: string;
}

export interface ERC721TokenOwners_owners {
  __typename: "ERC721TokenOwner";
  tokenInfo: ERC721TokenOwners_owners_tokenInfo;
  owner: string;
  token: string;
}

export interface ERC721TokenOwners {
  __typename: "ERC721TokenOwners";
  owners: (ERC721TokenOwners_owners | null)[];
  nextKey: string | null;
}
