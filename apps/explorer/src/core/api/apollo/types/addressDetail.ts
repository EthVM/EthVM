/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: addressDetail
// ====================================================

export interface addressDetail_account {
  __typename: "Account";
  address: string;
  balance: any;
  totalTxCount: any;
  inTxCount: any;
  outTxCount: any;
  isMiner: boolean;
  isContractCreator: boolean;
  isContract: boolean;
}

export interface addressDetail {
  account: addressDetail_account | null;
}

export interface addressDetailVariables {
  address: string;
}
