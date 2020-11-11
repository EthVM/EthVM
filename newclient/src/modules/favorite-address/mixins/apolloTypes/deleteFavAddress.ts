/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteFavAddress
// ====================================================

export interface deleteFavAddress_deleteFavAddress {
  __typename: "FavAddress";
  name: string;
}

export interface deleteFavAddress {
  deleteFavAddress: deleteFavAddress_deleteFavAddress | null;
}

export interface deleteFavAddressVariables {
  address: string;
}
