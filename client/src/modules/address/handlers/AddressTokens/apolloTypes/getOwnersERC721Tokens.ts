/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getOwnersERC721Tokens
// ====================================================

export interface getOwnersERC721Tokens_getOwnersERC721Tokens_tokens {
  __typename: "ERC721TokenOwner";
  token: string;
}

export interface getOwnersERC721Tokens_getOwnersERC721Tokens {
  __typename: "ERC721TokenContract";
  tokens: (getOwnersERC721Tokens_getOwnersERC721Tokens_tokens | null)[];
  nextKey: string | null;
}

export interface getOwnersERC721Tokens {
  /**
   * Returns a list of all ERC721 Tokens owned by an address
   */
  getOwnersERC721Tokens: getOwnersERC721Tokens_getOwnersERC721Tokens;
}

export interface getOwnersERC721TokensVariables {
  hash: string;
  tokenContract?: string | null;
  _nextKey?: string | null;
}
