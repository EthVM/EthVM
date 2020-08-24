/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TransferFilter } from "./../../../../../apollo/global/globalTypes";

// ====================================================
// GraphQL query operation: getAdrEthTransfers
// ====================================================

export interface getAdrEthTransfers_getEthTransfersV2_transfers_transfer {
  __typename: "Transfer";
  transactionHash: string;
  timestamp: number;
  from: string;
  to: string;
  txFee: string;
  block: number;
  status: boolean | null;
}

export interface getAdrEthTransfers_getEthTransfersV2_transfers_stateDiff_to {
  __typename: "BalanceDiff";
  before: string;
  after: string;
}

export interface getAdrEthTransfers_getEthTransfersV2_transfers_stateDiff_from {
  __typename: "BalanceDiff";
  before: string;
  after: string;
}

export interface getAdrEthTransfers_getEthTransfersV2_transfers_stateDiff {
  __typename: "StateDiffChange";
  to: getAdrEthTransfers_getEthTransfersV2_transfers_stateDiff_to;
  from: getAdrEthTransfers_getEthTransfersV2_transfers_stateDiff_from | null;
}

export interface getAdrEthTransfers_getEthTransfersV2_transfers {
  __typename: "EthTransfer";
  transfer: getAdrEthTransfers_getEthTransfersV2_transfers_transfer;
  stateDiff: getAdrEthTransfers_getEthTransfersV2_transfers_stateDiff | null;
  value: string;
}

export interface getAdrEthTransfers_getEthTransfersV2 {
  __typename: "ETHTransfers";
  transfers: (getAdrEthTransfers_getEthTransfersV2_transfers | null)[];
  nextKey: string | null;
}

export interface getAdrEthTransfers {
  getEthTransfersV2: getAdrEthTransfers_getEthTransfersV2;
}

export interface getAdrEthTransfersVariables {
  hash?: string | null;
  filter?: TransferFilter | null;
  _limit?: number | null;
  _nextKey?: string | null;
}
