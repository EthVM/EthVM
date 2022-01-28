/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getContractMeta1
// ====================================================

export interface getContractMeta1_getContractMeta {
  __typename: "ContractMeta";
  block: number;
  codeHash: string;
  creator: string;
  transactionHash: string;
}

export interface getContractMeta1 {
  /**
   * ------------------------------------------------
   * Contracts:
   * ------------------------------------------------
   */
  getContractMeta: getContractMeta1_getContractMeta;
}

export interface getContractMeta1Variables {
  hash: string;
}
