/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FilterEnum } from "./globalTypes";

// ====================================================
// GraphQL query operation: txsForAddress
// ====================================================

export interface txsForAddress_txsForAddress_receipt {
  __typename: "Receipt";
  contractAddress: string | null;
  gasUsed: any | null;
  status: string | null;
}

export interface txsForAddress_txsForAddress_traces {
  __typename: "Trace";
  error: string | null;
}

export interface txsForAddress_txsForAddress {
  __typename: "Transaction";
  hash: string | null;
  blockHash: string | null;
  blockNumber: any | null;
  from: string | null;
  gasPrice: any | null;
  timestamp: string | null;
  to: string | null;
  value: any | null;
  receipt: txsForAddress_txsForAddress_receipt | null;
  traces: (txsForAddress_txsForAddress_traces | null)[] | null;
}

export interface txsForAddress {
  txsForAddress: (txsForAddress_txsForAddress | null)[] | null;
}

export interface txsForAddressVariables {
  hash: string;
  filter: FilterEnum;
  limit?: number | null;
  page?: number | null;
}
