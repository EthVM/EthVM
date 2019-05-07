/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeltaType } from "./globalTypes";

// ====================================================
// GraphQL query operation: minedBlocksByAddress
// ====================================================

export interface minedBlocksByAddress_minedBlocksByAddress_items_header {
  __typename: "BlockHeader";
  hash: string | null;
  number: any | null;
  author: string | null;
}

export interface minedBlocksByAddress_minedBlocksByAddress_items_rewards {
  __typename: "Reward";
  rewardType: DeltaType | null;
  value: any | null;
}

export interface minedBlocksByAddress_minedBlocksByAddress_items {
  __typename: "Block";
  header: minedBlocksByAddress_minedBlocksByAddress_items_header | null;
  transactionHashes: (string | null)[] | null;
  uncleHashes: (string | null)[] | null;
  rewards: (minedBlocksByAddress_minedBlocksByAddress_items_rewards | null)[] | null;
}

export interface minedBlocksByAddress_minedBlocksByAddress {
  __typename: "BlocksPage";
  items: (minedBlocksByAddress_minedBlocksByAddress_items | null)[] | null;
  totalCount: number | null;
}

export interface minedBlocksByAddress {
  minedBlocksByAddress: minedBlocksByAddress_minedBlocksByAddress | null;
}

export interface minedBlocksByAddressVariables {
  address?: string | null;
  limit?: number | null;
  page?: number | null;
}
