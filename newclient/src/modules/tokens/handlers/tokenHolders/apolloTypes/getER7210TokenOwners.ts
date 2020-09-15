/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getER7210TokenOwners
// ====================================================

export interface getER7210TokenOwners_getERC20TokenOwners {
  __typename: "ERC20TokenOwners";
}

export interface getER7210TokenOwners {
  /**
   * Returns a list of all addresses that own an ERC20Token
   */
  getERC20TokenOwners: getER7210TokenOwners_getERC20TokenOwners;
}

export interface getER7210TokenOwnersVariables {
  contract: string;
  _limit?: number | null;
  _nextKey?: string | null;
}
