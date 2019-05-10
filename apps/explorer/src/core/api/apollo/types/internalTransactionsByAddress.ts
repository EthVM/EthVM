/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeltaType } from "./globalTypes";

// ====================================================
// GraphQL query operation: internalTransactionsByAddress
// ====================================================

export interface internalTransactionsByAddress_internalTransactionsByAddress_items {
  __typename: "Transfer";
  id: string;
  transactionHash: string | null;
  value: any;
  from: string | null;
  to: string;
  timestamp: number;
  deltaType: DeltaType;
}

export interface internalTransactionsByAddress_internalTransactionsByAddress {
  __typename: "TransfersPage";
  items: internalTransactionsByAddress_internalTransactionsByAddress_items[];
  totalCount: any;
}

export interface internalTransactionsByAddress {
  internalTransactionsByAddress: internalTransactionsByAddress_internalTransactionsByAddress;
}

export interface internalTransactionsByAddressVariables {
  address: string;
  limit?: number | null;
  page?: number | null;
}
