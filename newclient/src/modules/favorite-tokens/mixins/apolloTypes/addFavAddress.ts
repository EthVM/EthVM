/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: addFavAddress
// ====================================================

export interface addFavAddress_addFavAddress {
  __typename: "FavAddress";
  name: string;
}

export interface addFavAddress {
  addFavAddress: addFavAddress_addFavAddress;
}

export interface addFavAddressVariables {
  address: string;
  name?: string | null;
}
