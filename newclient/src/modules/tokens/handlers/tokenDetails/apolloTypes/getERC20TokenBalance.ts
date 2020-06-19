/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getERC20TokenBalance
// ====================================================

export interface getERC20TokenBalance_getERC20TokenBalance_tokenInfo {
  __typename: "EthTokenInfo";
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  totalSupply: string | null;
  contract: string;
}

export interface getERC20TokenBalance_getERC20TokenBalance {
  __typename: "ERC20TokenBalance";
  tokenInfo: getERC20TokenBalance_getERC20TokenBalance_tokenInfo;
  owner: string;
  balance: string;
}

export interface getERC20TokenBalance {
  getERC20TokenBalance: getERC20TokenBalance_getERC20TokenBalance;
}

export interface getERC20TokenBalanceVariables {
  contract: string;
  owner: string;
}
