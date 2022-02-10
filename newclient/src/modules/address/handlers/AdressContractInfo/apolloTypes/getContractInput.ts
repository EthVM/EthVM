/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getContractInput
// ====================================================

export interface getContractInput_getContractInput_sources {
  __typename: "SourceContent";
  content: string;
  name: string;
}

export interface getContractInput_getContractInput {
  __typename: "ContractInput";
  language: string;
  sources: getContractInput_getContractInput_sources[];
}

export interface getContractInput {
  getContractInput: getContractInput_getContractInput | null;
}

export interface getContractInputVariables {
  address: number;
  chainId: number;
}
