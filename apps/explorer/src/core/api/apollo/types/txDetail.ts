/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: txDetail
// ====================================================

export interface txDetail_tx_receipt {
  __typename: "Receipt";
  contractAddress: string | null;
  gasUsed: any;
}

export interface txDetail_tx {
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
  receipt: txDetail_tx_receipt | null;
}

export interface txDetail {
  tx: txDetail_tx | null;
}

export interface txDetailVariables {
  hash: string;
}
