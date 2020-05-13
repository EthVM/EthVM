/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: transactionDetailQuery
// ====================================================

export interface transactionDetailQuery_transaction_receipt {
  __typename: "Receipt";
  contractAddress: string | null;
  gasUsed: any;
}

export interface transactionDetailQuery_transaction {
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
  receipt: transactionDetailQuery_transaction_receipt | null;
}

export interface transactionDetailQuery {
  transaction: transactionDetailQuery_transaction | null;
}

export interface transactionDetailQueryVariables {
  hash: string;
}
