/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeltaType } from "./globalTypes";

// ====================================================
// GraphQL query operation: internalTransactionsByAddress
// ====================================================

export interface internalTransactionsByAddress_transfers_items {
  __typename: "Transfer";
  id: string;
  transactionHash: string | null;
  value: any;
  from: string | null;
  to: string;
  timestamp: any;
  deltaType: DeltaType;
  address: string | null;
}

export interface internalTransactionsByAddress_transfers {
  __typename: "TransferPage";
  items: internalTransactionsByAddress_transfers_items[];
  totalCount: any;
}

export interface internalTransactionsByAddress {
  transfers: internalTransactionsByAddress_transfers;
}

export interface internalTransactionsByAddressVariables {
  address: string;
  offset?: number | null;
  limit?: number | null;
}
