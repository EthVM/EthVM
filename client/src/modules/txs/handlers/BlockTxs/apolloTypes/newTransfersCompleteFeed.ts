/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TransferType } from "./../../../../../apollo/global/globalTypes";

// ====================================================
// GraphQL subscription operation: newTransfersCompleteFeed
// ====================================================

export interface newTransfersCompleteFeed_newTransfersCompleteFeed {
  __typename: "TransferComplete";
  block: number;
  type: TransferType;
}

export interface newTransfersCompleteFeed {
  newTransfersCompleteFeed: newTransfersCompleteFeed_newTransfersCompleteFeed;
}
