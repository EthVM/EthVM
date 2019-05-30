/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FilterEnum, DeltaType } from "./globalTypes";

// ====================================================
// GraphQL query operation: tokenTransfersByContractAddressForHolder
// ====================================================

export interface tokenTransfersByContractAddressForHolder_transfers_items {
  __typename: "Transfer";
  id: string;
  transactionHash: string | null;
  value: any;
  from: string | null;
  to: string;
  timestamp: any;
  deltaType: DeltaType;
  address: string | null;
}

export interface tokenTransfersByContractAddressForHolder_transfers {
  __typename: "TransferPage";
  items: tokenTransfersByContractAddressForHolder_transfers_items[];
  totalCount: any;
}

export interface tokenTransfersByContractAddressForHolder {
  transfers: tokenTransfersByContractAddressForHolder_transfers;
}

export interface tokenTransfersByContractAddressForHolderVariables {
  address: string;
  holder: string;
  filter?: FilterEnum | null;
  offset?: number | null;
  limit?: number | null;
}
