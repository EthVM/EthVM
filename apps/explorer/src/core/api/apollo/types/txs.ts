/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: txs
// ====================================================

export interface txs_txs_receipt {
  __typename: "Receipt";
  contractAddress: string | null;
  gasUsed: any;
  status: string | null;
}

export interface txs_txs_traces {
  __typename: "Trace";
  error: string | null;
}

export interface txs_txs {
  __typename: "Transaction";
  blockHash: string;
  blockNumber: any;
  from: string;
  gas: any;
  gasPrice: any;
  hash: string;
  input: any;
  timestamp: number;
  to: string | null;
  value: any;
  receipt: txs_txs_receipt | null;
  traces: txs_txs_traces[];
}

export interface txs {
  txs: txs_txs[];
}

export interface txsVariables {
  limit?: number | null;
  page?: number | null;
  fromBlock?: any | null;
}
