/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: accountByAddress
// ====================================================

export interface accountByAddress_accountByAddress {
  __typename: "Account";
  address: string | null;
  balance: any | null;
  totalTxCount: any | null;
  inTxCount: any | null;
  outTxCount: any | null;
  isMiner: boolean | null;
  isContractCreator: boolean | null;
}

export interface accountByAddress {
  accountByAddress: accountByAddress_accountByAddress | null;
}

export interface accountByAddressVariables {
  address: string;
}
