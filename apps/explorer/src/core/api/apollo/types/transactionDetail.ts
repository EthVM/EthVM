/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: transactionDetail
// ====================================================

export interface transactionDetail_transaction_receipt {
  __typename: "Receipt";
  contractAddress: string | null;
  gasUsed: any;
}

export interface transactionDetail_transaction {
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
  receipt: transactionDetail_transaction_receipt | null;
}

export interface transactionDetail {
  transaction: transactionDetail_transaction | null;
}

export interface transactionDetailVariables {
  hash: string;
}
