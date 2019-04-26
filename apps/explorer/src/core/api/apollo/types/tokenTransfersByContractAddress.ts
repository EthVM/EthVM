/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: tokenTransfersByContractAddress
// ====================================================

export interface tokenTransfersByContractAddress_tokenTransfersByContractAddress_items {
  __typename: "Transfer";
  id: string | null;
  transactionHash: string | null;
  value: string | null;
  from: string | null;
  to: string | null;
  address: string | null;
  timestamp: string | null;
}

export interface tokenTransfersByContractAddress_tokenTransfersByContractAddress {
  __typename: "TransfersPage";
  items: (tokenTransfersByContractAddress_tokenTransfersByContractAddress_items | null)[] | null;
  totalCount: number | null;
}

export interface tokenTransfersByContractAddress {
  tokenTransfersByContractAddress: tokenTransfersByContractAddress_tokenTransfersByContractAddress | null;
}

export interface tokenTransfersByContractAddressVariables {
  address: string;
  limit?: number | null;
  page?: number | null;
}
