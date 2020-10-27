/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: editFavAddress
// ====================================================

export interface editFavAddress_editFavAddress {
  __typename: "FavAddress";
  name: string;
}

export interface editFavAddress {
  editFavAddress: editFavAddress_editFavAddress;
}

export interface editFavAddressVariables {
  address: string;
  name: string;
}
