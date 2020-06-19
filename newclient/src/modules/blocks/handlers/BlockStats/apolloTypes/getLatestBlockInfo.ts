/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getLatestBlockInfo
// ====================================================

export interface getLatestBlockInfo_getLatestBlockInfo {
  __typename: "LatestBlockData";
  number: number;
  avgBlockTime: number;
  hashRate: string;
  difficulty: string;
}

export interface getLatestBlockInfo {
  getLatestBlockInfo: getLatestBlockInfo_getLatestBlockInfo;
}
