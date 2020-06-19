/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TransferFilter } from "./../../../../../apollo/global/globalTypes";

// ====================================================
// GraphQL query operation: getEthTransfersV2
// ====================================================

export interface getEthTransfersV2_getEthTransfersV2_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  timestamp: number;
  from: string;
  to: string;
  txFee: string;
  block: number;
  status: boolean | null;
}

export interface getEthTransfersV2_getEthTransfersV2_transfers {
  __typename: "EthTransfer";
  transfer: getEthTransfersV2_getEthTransfersV2_transfers_transfer;
  value: string;
}

export interface getEthTransfersV2_getEthTransfersV2 {
  __typename: "ETHTransfers";
  transfers: (getEthTransfersV2_getEthTransfersV2_transfers | null)[];
  nextKey: string | null;
}

export interface getEthTransfersV2 {
  getEthTransfersV2: getEthTransfersV2_getEthTransfersV2;
}

export interface getEthTransfersV2Variables {
  hash?: string | null;
  filter?: TransferFilter | null;
  _limit?: number | null;
  _nextKey?: string | null;
}
