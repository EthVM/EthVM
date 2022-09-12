/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TransferDirection } from "./../../../../../apollo/global/globalTypes";

// ====================================================
// GraphQL query operation: getAddressEthTransfers
// ====================================================

export interface getAddressEthTransfers_getEthTransfersV2_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  timestamp: number;
  from: string;
  to: string;
  txFee: string;
  block: number;
  status: boolean | null;
}

export interface getAddressEthTransfers_getEthTransfersV2_transfers_stateDiff_to {
  __typename: "BalanceDiff";
  before: string;
  after: string;
}

export interface getAddressEthTransfers_getEthTransfersV2_transfers_stateDiff_from {
  __typename: "BalanceDiff";
  before: string;
  after: string;
}

export interface getAddressEthTransfers_getEthTransfersV2_transfers_stateDiff {
  __typename: "StateDiffChange";
  to: getAddressEthTransfers_getEthTransfersV2_transfers_stateDiff_to;
  from: getAddressEthTransfers_getEthTransfersV2_transfers_stateDiff_from | null;
}

export interface getAddressEthTransfers_getEthTransfersV2_transfers {
  __typename: "EthTransfer";
  transfer: getAddressEthTransfers_getEthTransfersV2_transfers_transfer;
  stateDiff: getAddressEthTransfers_getEthTransfersV2_transfers_stateDiff | null;
  value: string;
}

export interface getAddressEthTransfers_getEthTransfersV2 {
  __typename: "ETHTransfers";
  transfers: (getAddressEthTransfers_getEthTransfersV2_transfers | null)[];
  nextKey: string | null;
}

export interface getAddressEthTransfers {
  getEthTransfersV2: getAddressEthTransfers_getEthTransfersV2;
}

export interface getAddressEthTransfersVariables {
  hash?: string | null;
  filter?: TransferDirection | null;
  _limit?: number | null;
  _nextKey?: string | null;
}
