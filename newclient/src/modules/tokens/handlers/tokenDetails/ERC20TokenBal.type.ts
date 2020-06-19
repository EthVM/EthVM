/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ERC20TokenBal
// ====================================================

export interface ERC20TokenBal_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  totalSupply: string | null;
  contract: string;
}

export interface ERC20TokenBal {
  __typename: "ERC20TokenBalance";
  tokenInfo: ERC20TokenBal_tokenInfo;
  owner: string;
  balance: string;
}
