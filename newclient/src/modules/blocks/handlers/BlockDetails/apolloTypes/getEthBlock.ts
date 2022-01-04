/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getEthBlock
// ====================================================

export interface getEthBlock_getEthBlock {
  __typename: "EthBlock";
  img: string;
  description: string;
}

export interface getEthBlock {
  getEthBlock: getEthBlock_getEthBlock;
}

export interface getEthBlockVariables {
  blockNumber: number;
  chainId: number;
}
