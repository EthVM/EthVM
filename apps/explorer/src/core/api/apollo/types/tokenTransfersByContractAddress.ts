/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeltaType } from "./globalTypes";

// ====================================================
// GraphQL query operation: tokenTransfersByContractAddress
// ====================================================

export interface tokenTransfersByContractAddress_transfers_items {
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

export interface tokenTransfersByContractAddress_transfers {
  __typename: "TransferPage";
  items: tokenTransfersByContractAddress_transfers_items[];
  totalCount: any;
}

export interface tokenTransfersByContractAddress {
  transfers: tokenTransfersByContractAddress_transfers;
}

export interface tokenTransfersByContractAddressVariables {
  address: string;
  offset?: number | null;
  limit?: number | null;
}
