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

export interface tokenHolderDetails_tokenDetails_social {
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

export interface tokenHolderDetails_tokenDetails {
  __typename: "TokenDetail";
  address: string;
  owner: string | null;
  contractType: string | null;
  name: string | null;
  symbol: string | null;
  decimals: number | null;
  logo: string | null;
  email: string | null;
  social: tokenHolderDetails_tokenDetails_social | null;
  website: string | null;
  currentPrice: any | null;
  circulatingSupply: any | null;
  totalSupply: any | null;
  marketCap: any | null;
  priceChangePercentage24h: any | null;
  totalVolume: any | null;
  holdersCount: number | null;
}

export interface tokenHolderDetails {
  tokenHolder: tokenHolderDetails_tokenHolder | null;
  tokenDetails: tokenHolderDetails_tokenDetails | null;
  totalTransfers: any;
}

export interface tokenHolderDetailsVariables {
  address: string;
  holderAddress: string;
}
