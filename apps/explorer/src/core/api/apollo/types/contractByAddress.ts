/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: contractByAddress
// ====================================================

export interface contractByAddress_contractByAddress_metadata_support {
  __typename: "ContractSupport";
  email: string | null;
}

export interface contractByAddress_contractByAddress_metadata_social {
  __typename: "ContractSocial";
  blog: string | null;
  chat: string | null;
  facebook: string | null;
  forum: string | null;
  github: string | null;
  gitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  reddit: string | null;
  slack: string | null;
  telegram: string | null;
  twitter: string | null;
  youtube: string | null;
}

export interface contractByAddress_contractByAddress_metadata {
  __typename: "ContractMetadata";
  decimals: number | null;
  website: string | null;
  type: string | null;
  support: contractByAddress_contractByAddress_metadata_support | null;
  social: contractByAddress_contractByAddress_metadata_social | null;
}

export interface contractByAddress_contractByAddress {
  __typename: "Contract";
  address: string | null;
  totalSupply: any | null;
  metadata: contractByAddress_contractByAddress_metadata | null;
}

export interface contractByAddress {
  contractByAddress: contractByAddress_contractByAddress | null;
}

export interface contractByAddressVariables {
  address: string;
}
