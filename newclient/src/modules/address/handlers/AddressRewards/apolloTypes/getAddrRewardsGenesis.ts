/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAddrRewardsGenesis
// ====================================================

export interface getAddrRewardsGenesis_getGenesisRewards_transfers_transfer {
  __typename: "Transfer";
  block: number;
  timestamp: number;
}

export interface getAddrRewardsGenesis_getGenesisRewards_transfers {
  __typename: "EthTransfer";
  transfer: getAddrRewardsGenesis_getGenesisRewards_transfers_transfer;
  value: string;
}

export interface getAddrRewardsGenesis_getGenesisRewards {
  __typename: "ETHTransfers";
  transfers: (getAddrRewardsGenesis_getGenesisRewards_transfers | null)[];
  nextKey: string | null;
}

export interface getAddrRewardsGenesis {
  getGenesisRewards: getAddrRewardsGenesis_getGenesisRewards;
}

export interface getAddrRewardsGenesisVariables {
  hash: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
