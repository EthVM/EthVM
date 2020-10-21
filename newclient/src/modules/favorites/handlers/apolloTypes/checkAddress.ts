/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: checkAddress
// ====================================================

export interface checkAddress_checkAddress {
  __typename: "FavAddress";
  name: string;
  address: string;
}

export interface checkAddress {
  checkAddress: checkAddress_checkAddress | null;
}

export interface checkAddressVariables {
  address: string;
}
