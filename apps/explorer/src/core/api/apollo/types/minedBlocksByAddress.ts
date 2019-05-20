/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeltaType } from "./globalTypes";

// ====================================================
// GraphQL query operation: minedBlocksByAddress
// ====================================================

export interface minedBlocksByAddress_minedBlocksByAddress_items_header {
  __typename: "BlockHeader";
  hash: string;
  number: any;
  author: string;
}

export interface minedBlocksByAddress_minedBlocksByAddress_items_rewards {
  __typename: "Reward";
  rewardType: DeltaType;
  value: any;
}

export interface minedBlocksByAddress_minedBlocksByAddress_items {
  __typename: "Block";
  header: minedBlocksByAddress_minedBlocksByAddress_items_header;
  transactionHashes: string[];
  uncleHashes: string[];
  rewards: minedBlocksByAddress_minedBlocksByAddress_items_rewards[];
}

export interface minedBlocksByAddress_minedBlocksByAddress {
  __typename: "BlocksPage";
  items: minedBlocksByAddress_minedBlocksByAddress_items[];
  totalCount: number;
}

export interface minedBlocksByAddress {
  minedBlocksByAddress: minedBlocksByAddress_minedBlocksByAddress;
}

export interface minedBlocksByAddressVariables {
  address: string;
  limit?: number | null;
  page?: number | null;
}
