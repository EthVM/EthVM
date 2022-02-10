/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getContractMetaVerified
// ====================================================

export interface getContractMetaVerified_getContractMetaVerified_encodedMetadata {
  __typename: "encodedMetadataType";
  ipfs: string | null;
  bzzr0: string | null;
  bzzr1: string | null;
  solc: string | null;
}

export interface getContractMetaVerified_getContractMetaVerified {
  __typename: "ContractMetaVerified";
  opcodeHash: string;
  metalessHash: string;
  runtimeHash: string;
  encodedMetadata: getContractMetaVerified_getContractMetaVerified_encodedMetadata[];
  deployedByteCode: string;
  byteCode: string;
  abiStringify: string | null;
}

export interface getContractMetaVerified {
  getContractMetaVerified: getContractMetaVerified_getContractMetaVerified | null;
}

export interface getContractMetaVerifiedVariables {
  address: number;
  chainId: number;
}
