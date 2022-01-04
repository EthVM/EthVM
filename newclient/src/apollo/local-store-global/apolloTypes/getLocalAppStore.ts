/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getLocalAppStore
// ====================================================

export interface getLocalAppStore_localAppStore {
  __typename: "LocalStore";
  consentToTrack: boolean;
  notFirstTimeVisit: boolean;
  displayedTrackingPopup: boolean;
}

export interface getLocalAppStore {
  localAppStore: getLocalAppStore_localAppStore;
}
