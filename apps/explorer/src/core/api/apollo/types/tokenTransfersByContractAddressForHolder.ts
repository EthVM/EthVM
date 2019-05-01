/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FilterEnum } from "./globalTypes";

// ====================================================
// GraphQL query operation: tokenTransfersByContractAddressForHolder
// ====================================================

export interface tokenTransfersByContractAddressForHolder_tokenTransfersByContractAddressForHolder {
  __typename: "Transfer";
  id: string | null;
  value: any | null;
  contract: string | null;
  from: string | null;
  timestamp: string | null;
  to: string | null;
}

export interface tokenTransfersByContractAddressForHolder {
  tokenTransfersByContractAddressForHolder: (tokenTransfersByContractAddressForHolder_tokenTransfersByContractAddressForHolder | null)[] | null;
}

export interface tokenTransfersByContractAddressForHolderVariables {
  address: string;
  holder: string;
  filter?: FilterEnum | null;
  limit?: number | null;
  page?: number | null;
}
