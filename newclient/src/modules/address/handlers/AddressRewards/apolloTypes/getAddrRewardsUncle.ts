/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAddrRewardsUncle
// ====================================================

export interface getAddrRewardsUncle_getUncleRewards_transfers_transfer {
  __typename: "Transfer";
  block: number;
  timestamp: number;
}

export interface getAddrRewardsUncle_getUncleRewards_transfers {
  __typename: "EthTransfer";
  transfer: getAddrRewardsUncle_getUncleRewards_transfers_transfer;
  value: string;
}

export interface getAddrRewardsUncle_getUncleRewards {
  __typename: "ETHTransfers";
  transfers: (getAddrRewardsUncle_getUncleRewards_transfers | null)[];
  nextKey: string | null;
}

export interface getAddrRewardsUncle {
  getUncleRewards: getAddrRewardsUncle_getUncleRewards;
}

export interface getAddrRewardsUncleVariables {
  hash: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
