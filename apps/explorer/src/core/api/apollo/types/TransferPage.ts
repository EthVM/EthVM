/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeltaType } from "./globalTypes";

// ====================================================
// GraphQL fragment: TransferPage
// ====================================================

export interface TransferPage_items {
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

export interface TransferPage {
  __typename: "TransferPage";
  items: TransferPage_items[];
  totalCount: any;
}
