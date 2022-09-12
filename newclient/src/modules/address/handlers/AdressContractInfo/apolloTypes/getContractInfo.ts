/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getContractInfo
// ====================================================

export interface getContractInfo_getContractMeta {
  __typename: "ContractMeta";
  block: number;
  codeHash: string;
  creator: string;
  transactionHash: string;
}

export interface getContractInfo {
  getContractMeta: getContractInfo_getContractMeta;
}

export interface getContractInfoVariables {
  hash: string;
}
