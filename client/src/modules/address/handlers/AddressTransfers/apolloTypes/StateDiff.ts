/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: StateDiff
// ====================================================

export interface StateDiff_to {
  __typename: "BalanceDiff";
  before: string;
  after: string;
}

export interface StateDiff_from {
  __typename: "BalanceDiff";
  before: string;
  after: string;
}

export interface StateDiff {
  __typename: "StateDiffChange";
  to: StateDiff_to;
  from: StateDiff_from | null;
}
