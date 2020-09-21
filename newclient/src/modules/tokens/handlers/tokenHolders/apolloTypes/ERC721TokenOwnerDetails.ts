/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ERC721TokenOwnerDetails
// ====================================================

export interface ERC721TokenOwnerDetails_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  totalSupply: string | null;
  contract: string;
}

export interface ERC721TokenOwnerDetails {
  __typename: "ERC721TokenOwner";
  tokenInfo: ERC721TokenOwnerDetails_tokenInfo;
  owner: string;
  token: string;
}
