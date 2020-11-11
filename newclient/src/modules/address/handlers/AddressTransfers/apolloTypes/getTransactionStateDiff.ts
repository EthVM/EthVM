/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTransactionStateDiff
// ====================================================

export interface getTransactionStateDiff_getTransactionStateDiff {
  __typename: "TxStateDiff";
  owner: string;
  from: string;
  to: string;
}

export interface getTransactionStateDiff {
  getTransactionStateDiff: (getTransactionStateDiff_getTransactionStateDiff | null)[];
}

export interface getTransactionStateDiffVariables {
  hash: string;
}
