/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getBlockUncleRewards
// ====================================================

export interface getBlockUncleRewards_getBlockByNumber_summary_rewards {
  __typename: "BlockRewards";
  uncles: string;
}

export interface getBlockUncleRewards_getBlockByNumber_summary {
  __typename: "BlockSummary";
  rewards: getBlockUncleRewards_getBlockByNumber_summary_rewards;
}

export interface getBlockUncleRewards_getBlockByNumber {
  __typename: "Block";
  summary: getBlockUncleRewards_getBlockByNumber_summary;
}

export interface getBlockUncleRewards {
  getBlockByNumber: getBlockUncleRewards_getBlockByNumber;
}

export interface getBlockUncleRewardsVariables {
  blockRef: number;
}
