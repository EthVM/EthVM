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
  gasUsed: any;
  status: string | null;
}

export interface txsForAddress_txsForAddress_traces {
  __typename: "Trace";
  error: string | null;
}

export interface txsForAddress_txsForAddress {
  __typename: "Transaction";
  hash: string;
  blockHash: string;
  blockNumber: any;
  from: string;
  gasPrice: any;
  timestamp: number;
  to: string | null;
  value: any;
  receipt: txsForAddress_txsForAddress_receipt | null;
  traces: txsForAddress_txsForAddress_traces[];
}

export interface txsForAddress {
  txsForAddress: txsForAddress_txsForAddress[];
}

export interface txsForAddressVariables {
  hash: string;
  filter: FilterEnum;
  limit?: number | null;
  page?: number | null;
}
