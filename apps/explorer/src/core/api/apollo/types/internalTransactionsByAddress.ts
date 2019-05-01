/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeltaType } from "./globalTypes";

// ====================================================
// GraphQL query operation: internalTransactionsByAddress
// ====================================================

export interface internalTransactionsByAddress_internalTransactionsByAddress_items {
  __typename: "Transfer";
  id: string | null;
  transactionHash: string | null;
  value: any | null;
  from: string | null;
  to: string | null;
  timestamp: string | null;
  deltaType: DeltaType | null;
}

export interface internalTransactionsByAddress_internalTransactionsByAddress {
  __typename: "TransfersPage";
  items: (internalTransactionsByAddress_internalTransactionsByAddress_items | null)[] | null;
  totalCount: any | null;
}

export interface internalTransactionsByAddress {
  internalTransactionsByAddress: internalTransactionsByAddress_internalTransactionsByAddress | null;
}

export interface internalTransactionsByAddressVariables {
  address: string;
  limit?: number | null;
  page?: number | null;
}
