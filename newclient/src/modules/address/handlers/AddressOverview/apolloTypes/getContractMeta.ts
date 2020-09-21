/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getContractMeta
// ====================================================

export interface getContractMeta_getContractMeta {
  __typename: "ContractMeta";
  block: number;
  codeHash: string;
  creator: string;
  transactionHash: string;
}

export interface getContractMeta {
  /**
   * ------------------------------------------------
   * Contracts:
   * ------------------------------------------------
   */
  getContractMeta: getContractMeta_getContractMeta;
}

export interface getContractMetaVariables {
  hash: string;
}
