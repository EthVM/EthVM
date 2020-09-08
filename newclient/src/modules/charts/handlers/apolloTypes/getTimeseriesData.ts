/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TimeseriesScale } from "./../../../../apollo/global/globalTypes";

// ====================================================
// GraphQL query operation: getTimeseriesData
// ====================================================

export interface getTimeseriesData_getTimeseriesData_items {
  __typename: "TimeseriesData";
  value: string;
  timestamp: number;
}

export interface getTimeseriesData_getTimeseriesData {
  __typename: "TimeseriesResponse";
  items: (getTimeseriesData_getTimeseriesData_items | null)[];
  nextKey: string | null;
}

export interface getTimeseriesData {
  getTimeseriesData: getTimeseriesData_getTimeseriesData;
}

export interface getTimeseriesDataVariables {
  key: string;
  scale: TimeseriesScale;
  fromT: number;
  toT?: number | null;
  nextKey?: string | null;
}
