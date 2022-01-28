/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getContractConfigs
// ====================================================

export interface getContractConfigs_getContractConfigs {
  __typename: "ContractConfigs";
  compiler: string;
  constructorBytes: string;
  evmVersion: string;
  name: string;
  optimization: boolean;
  runs: number | null;
}

export interface getContractConfigs {
  getContractConfigs: getContractConfigs_getContractConfigs | null;
}

export interface getContractConfigsVariables {
  address: number;
  chainId: number;
}
