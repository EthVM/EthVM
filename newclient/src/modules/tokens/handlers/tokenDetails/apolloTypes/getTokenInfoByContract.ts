/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTokenInfoByContract
// ====================================================

export interface getTokenInfoByContract_getTokenInfoByContract {
  __typename: "EthTokenInfo";
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  totalSupply: string | null;
  contract: string;
}

export interface getTokenInfoByContract {
  getTokenInfoByContract: getTokenInfoByContract_getTokenInfoByContract;
}

export interface getTokenInfoByContractVariables {
  contract: string;
}
