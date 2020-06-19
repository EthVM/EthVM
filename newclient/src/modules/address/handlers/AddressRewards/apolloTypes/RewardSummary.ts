/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: RewardSummary
// ====================================================

export interface RewardSummary_transfers_transfer {
  __typename: "Transfer";
  block: number;
  timestamp: number;
}

export interface RewardSummary_transfers {
  __typename: "EthTransfer";
  transfer: RewardSummary_transfers_transfer;
  value: string;
}

export interface RewardSummary {
  __typename: "ETHTransfers";
  transfers: (RewardSummary_transfers | null)[];
  nextKey: string | null;
}
