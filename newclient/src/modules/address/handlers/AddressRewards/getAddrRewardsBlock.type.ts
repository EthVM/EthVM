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
}

export interface getAddrRewardsBlock_getBlockRewards_transfers {
  __typename: "EthTransfer";
  transfer: getAddrRewardsBlock_getBlockRewards_transfers_transfer;
  value: string;
}

export interface getAddrRewardsBlock_getBlockRewards {
  __typename: "ETHTransfers";
  transfers: (getAddrRewardsBlock_getBlockRewards_transfers | null)[];
  nextKey: string | null;
}

export interface getAddrRewardsBlock {
  /**
   * ------------------------------------------------
   * Transfers:
   * ------------------------------------------------
   */
  getBlockRewards: getAddrRewardsBlock_getBlockRewards;
}

export interface getAddrRewardsBlockVariables {
  hash: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
