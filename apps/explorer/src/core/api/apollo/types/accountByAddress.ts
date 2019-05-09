/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: accountByAddress
// ====================================================

export interface accountByAddress_accountByAddress {
  __typename: "Account";
  address: string;
  balance: any;
  totalTxCount: any;
  inTxCount: any;
  outTxCount: any;
  isMiner: boolean;
  isContractCreator: boolean;
}

export interface accountByAddress {
  accountByAddress: accountByAddress_accountByAddress | null;
}

export interface accountByAddressVariables {
  address: string;
}
