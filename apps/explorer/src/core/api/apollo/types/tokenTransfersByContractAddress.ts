/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: tokenTransfersByContractAddress
// ====================================================

export interface tokenTransfersByContractAddress_tokenTransfersByContractAddress_items {
  __typename: "Transfer";
  id: string;
  transactionHash: string | null;
  value: any;
  from: string | null;
  to: string;
  address: string | null;
  timestamp: number;
}

export interface tokenTransfersByContractAddress_tokenTransfersByContractAddress {
  __typename: "TransfersPage";
  items: tokenTransfersByContractAddress_tokenTransfersByContractAddress_items[];
  totalCount: any;
}

export interface tokenTransfersByContractAddress {
  tokenTransfersByContractAddress: tokenTransfersByContractAddress_tokenTransfersByContractAddress;
}

export interface tokenTransfersByContractAddressVariables {
  address: string;
  limit?: number | null;
  page?: number | null;
}
