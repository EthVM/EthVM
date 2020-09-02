/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getNFTcontractsMeta
// ====================================================

export interface getNFTcontractsMeta_getNFTcontractsMeta_tokenContracts_primary_asset_contracts {
  __typename: "PrimaryAssetContract";
  address: string;
  name: string | null;
  symbol: string | null;
  total_supply: number | null;
  description: string | null;
  external_link: string | null;
  image_url: string | null;
}

export interface getNFTcontractsMeta_getNFTcontractsMeta_tokenContracts {
  __typename: "NFTContract";
  contractIdAddress: string;
  owned_asset_count: number;
  name: string | null;
  contractImage: string | null;
  primary_asset_contracts: getNFTcontractsMeta_getNFTcontractsMeta_tokenContracts_primary_asset_contracts[] | null;
}

export interface getNFTcontractsMeta_getNFTcontractsMeta {
  __typename: "AddressNFTcontracts";
  tokenContracts: (getNFTcontractsMeta_getNFTcontractsMeta_tokenContracts | null)[] | null;
}

export interface getNFTcontractsMeta {
  getNFTcontractsMeta: getNFTcontractsMeta_getNFTcontractsMeta;
}

export interface getNFTcontractsMetaVariables {
  address: string;
}
