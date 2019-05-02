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

export interface minedBlocksByAddress_minedBlocksByAddress_items_uncles {
  __typename: "Uncle";
  hash: string | null;
}

export interface minedBlocksByAddress_minedBlocksByAddress_items_transactions_receipt {
  __typename: "Receipt";
  status: string | null;
}

export interface minedBlocksByAddress_minedBlocksByAddress_items_transactions {
  __typename: "Transaction";
  hash: string | null;
  receipt: minedBlocksByAddress_minedBlocksByAddress_items_transactions_receipt | null;
}

export interface minedBlocksByAddress_minedBlocksByAddress_items_rewards {
  __typename: "Reward";
  rewardType: DeltaType | null;
  value: any | null;
}

export interface minedBlocksByAddress_minedBlocksByAddress_items {
  __typename: "Block";
  header: minedBlocksByAddress_minedBlocksByAddress_items_header | null;
  uncles: (minedBlocksByAddress_minedBlocksByAddress_items_uncles | null)[] | null;
  transactions: (minedBlocksByAddress_minedBlocksByAddress_items_transactions | null)[] | null;
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
