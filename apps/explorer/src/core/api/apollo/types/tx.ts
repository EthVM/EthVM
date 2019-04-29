/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: tx
// ====================================================

export interface tx_tx_receipt {
  __typename: "Receipt";
  contractAddress: string | null;
  gasUsed: any | null;
}

export interface tx_tx {
  __typename: "Transaction";
  blockHash: string | null;
  blockNumber: any | null;
  from: string | null;
  gas: any | null;
  gasPrice: any | null;
  hash: string | null;
  input: any | null;
  nonce: any | null;
  timestamp: string | null;
  to: string | null;
  value: any | null;
  receipt: tx_tx_receipt | null;
}

export interface tx {
  tx: tx_tx | null;
}

export interface txVariables {
  hash: string;
}
