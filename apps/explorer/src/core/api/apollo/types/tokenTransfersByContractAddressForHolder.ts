/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FilterEnum } from "./globalTypes";

// ====================================================
// GraphQL query operation: tokenTransfersByContractAddressForHolder
// ====================================================

export interface tokenTransfersByContractAddressForHolder_tokenTransfersByContractAddressForHolder_items {
  __typename: "Transfer";
  id: string;
  value: any;
  address: string | null;
  from: string | null;
  timestamp: number;
  to: string;
}

export interface tokenTransfersByContractAddressForHolder_tokenTransfersByContractAddressForHolder {
  __typename: "TransfersPage";
  items: tokenTransfersByContractAddressForHolder_tokenTransfersByContractAddressForHolder_items[];
  totalCount: any;
}

export interface tokenTransfersByContractAddressForHolder {
  tokenTransfersByContractAddressForHolder: tokenTransfersByContractAddressForHolder_tokenTransfersByContractAddressForHolder;
}

export interface tokenTransfersByContractAddressForHolderVariables {
  address: string;
  holder: string;
  filter?: FilterEnum | null;
  limit?: number | null;
  page?: number | null;
}
