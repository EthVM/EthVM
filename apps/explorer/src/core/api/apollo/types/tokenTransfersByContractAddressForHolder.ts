/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FilterEnum } from "./globalTypes";

// ====================================================
// GraphQL query operation: tokenTransfersByContractAddressForHolder
// ====================================================

export interface tokenTransfersByContractAddressForHolder_tokenTransfersByContractAddressForHolder_items {
  __typename: "Transfer";
  id: string | null;
  value: any | null;
  address: string | null;
  from: string | null;
  timestamp: string | null;
  to: string | null;
}

export interface tokenTransfersByContractAddressForHolder_tokenTransfersByContractAddressForHolder {
  __typename: "TransfersPage";
  items: (tokenTransfersByContractAddressForHolder_tokenTransfersByContractAddressForHolder_items | null)[] | null;
  totalCount: any | null;
}

export interface tokenTransfersByContractAddressForHolder {
  tokenTransfersByContractAddressForHolder: tokenTransfersByContractAddressForHolder_tokenTransfersByContractAddressForHolder | null;
}

export interface tokenTransfersByContractAddressForHolderVariables {
  address: string;
  holder: string;
  filter?: FilterEnum | null;
  limit?: number | null;
  page?: number | null;
}
