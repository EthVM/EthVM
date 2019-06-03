/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TransactionDetail
// ====================================================

export interface TransactionDetail_receipt {
  __typename: "Receipt";
  contractAddress: string | null;
  gasUsed: any;
}

export interface TransactionDetail {
  __typename: "Transaction";
  blockHash: string;
  blockNumber: any;
  from: string;
  gas: any;
  gasPrice: any;
  hash: string;
  input: any;
  nonce: any;
  timestamp: any;
  to: string | null;
  value: any;
  receipt: TransactionDetail_receipt | null;
}
