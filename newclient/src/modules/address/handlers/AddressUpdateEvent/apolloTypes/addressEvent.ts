/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AddressEventType } from "./../../../../../apollo/global/globalTypes";

// ====================================================
// GraphQL subscription operation: addressEvent
// ====================================================

export interface addressEvent_addressEvent {
  __typename: "AddressEvent";
  blockNumber: number;
  event: AddressEventType;
  timestamp: number;
  owner: string;
}

export interface addressEvent {
  addressEvent: addressEvent_addressEvent;
}

export interface addressEventVariables {
  owner: string;
  event?: AddressEventType | null;
}
