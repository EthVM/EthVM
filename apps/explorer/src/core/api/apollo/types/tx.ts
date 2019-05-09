/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: tx
// ====================================================

export interface tx_tx_receipt {
  __typename: "Receipt";
  contractAddress: string | null;
  gasUsed: any;
}

export interface tx_tx {
  __typename: "Transaction";
  blockHash: string;
  blockNumber: any;
  from: string;
  gas: any;
  gasPrice: any;
  hash: string;
  input: any;
  nonce: any;
  timestamp: number;
  to: string | null;
  value: any;
  receipt: tx_tx_receipt | null;
}

export interface tx {
  tx: tx_tx | null;
}

export interface txVariables {
  hash: string;
}
