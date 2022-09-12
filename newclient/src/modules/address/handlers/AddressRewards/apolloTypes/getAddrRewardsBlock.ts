/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAddrRewardsBlock
// ====================================================

export interface getAddrRewardsBlock_getBlockRewards_transfers_transfer {
  __typename: "Transfer";
  block: number;
  timestamp: number;
  txFee: string;
}

export interface getAddrRewardsBlock_getBlockRewards_transfers_stateDiff_to {
  __typename: "BalanceDiff";
  before: string;
  after: string;
}

export interface getAddrRewardsBlock_getBlockRewards_transfers_stateDiff_from {
  __typename: "BalanceDiff";
  before: string;
  after: string;
}

export interface getAddrRewardsBlock_getBlockRewards_transfers_stateDiff {
  __typename: "StateDiffChange";
  to: getAddrRewardsBlock_getBlockRewards_transfers_stateDiff_to;
  from: getAddrRewardsBlock_getBlockRewards_transfers_stateDiff_from | null;
}

export interface getAddrRewardsBlock_getBlockRewards_transfers {
  __typename: "EthTransfer";
  transfer: getAddrRewardsBlock_getBlockRewards_transfers_transfer;
  stateDiff: getAddrRewardsBlock_getBlockRewards_transfers_stateDiff | null;
  value: string;
}

export interface getAddrRewardsBlock_getBlockRewards {
  __typename: "ETHTransfers";
  transfers: (getAddrRewardsBlock_getBlockRewards_transfers | null)[];
  nextKey: string | null;
}

export interface getAddrRewardsBlock {
  getBlockRewards: getAddrRewardsBlock_getBlockRewards;
}

export interface getAddrRewardsBlockVariables {
  hash: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
