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
  txFee: string;
}

export interface RewardSummary_transfers_stateDiff_to {
  __typename: "BalanceDiff";
  before: string;
  after: string;
}

export interface RewardSummary_transfers_stateDiff_from {
  __typename: "BalanceDiff";
  before: string;
  after: string;
}

export interface RewardSummary_transfers_stateDiff {
  __typename: "StateDiffChange";
  to: RewardSummary_transfers_stateDiff_to;
  from: RewardSummary_transfers_stateDiff_from | null;
}

export interface RewardSummary_transfers {
  __typename: "EthTransfer";
  transfer: RewardSummary_transfers_transfer;
  stateDiff: RewardSummary_transfers_stateDiff | null;
  value: string;
}

export interface RewardSummary {
  __typename: "ETHTransfers";
  transfers: (RewardSummary_transfers | null)[];
  nextKey: string | null;
}
