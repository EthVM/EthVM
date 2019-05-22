/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: tokenHolderDetails
// ====================================================

export interface tokenHolderDetails_tokenHolder {
  __typename: "TokenHolder";
  address: string;
  balance: any;
}

export interface tokenHolderDetails_tokenDetails_contract_metadata_support {
  __typename: "ContractSupport";
  email: string | null;
  url: string | null;
}

export interface tokenHolderDetails_tokenDetails_contract_metadata_social {
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

export interface tokenHolderDetails_tokenDetails_contract_metadata {
  __typename: "ContractMetadata";
  type: string | null;
  decimals: number | null;
  website: string | null;
  support: tokenHolderDetails_tokenDetails_contract_metadata_support | null;
  social: tokenHolderDetails_tokenDetails_contract_metadata_social | null;
}

export interface tokenHolderDetails_tokenDetails_contract {
  __typename: "Contract";
  creator: string | null;
  metadata: tokenHolderDetails_tokenDetails_contract_metadata | null;
}

export interface tokenHolderDetails_tokenDetails {
  __typename: "TokenExchangeRate";
  address: string | null;
  circulatingSupply: any | null;
  currentPrice: any | null;
  image: string | null;
  marketCap: any | null;
  name: string | null;
  priceChangePercentage24h: any | null;
  symbol: string | null;
  totalSupply: any | null;
  totalVolume: any | null;
  holdersCount: number | null;
  contract: tokenHolderDetails_tokenDetails_contract | null;
}

export interface tokenHolderDetails {
  tokenHolder: tokenHolderDetails_tokenHolder | null;
  tokenDetails: tokenHolderDetails_tokenDetails | null;
}

export interface tokenHolderDetailsVariables {
  address: string;
  holderAddress: string;
}
