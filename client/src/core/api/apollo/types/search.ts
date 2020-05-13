/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SearchType } from "./globalTypes";

// ====================================================
// GraphQL query operation: search
// ====================================================

export interface search_search {
  __typename: "Search";
  type: SearchType;
}

export interface search {
  search: search_search;
}

export interface searchVariables {
  query: string;
}
