/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TimeseriesScale } from "./../../../../apollo/global/globalTypes";

// ====================================================
// GraphQL subscription operation: timeseriesEthAvg
// ====================================================

export interface timeseriesEthAvg_timeseriesEvent_item {
  __typename: "TimeseriesData";
  value: string;
  timestamp: number;
}

export interface timeseriesEthAvg_timeseriesEvent {
  __typename: "TimeseriesEvent";
  key: string;
  scale: TimeseriesScale;
  item: timeseriesEthAvg_timeseriesEvent_item;
}

export interface timeseriesEthAvg {
  timeseriesEvent: timeseriesEthAvg_timeseriesEvent;
}

export interface timeseriesEthAvgVariables {
  key: string;
  scale: TimeseriesScale;
}
