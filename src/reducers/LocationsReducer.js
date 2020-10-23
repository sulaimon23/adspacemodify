import {
  LOCATION_SIMILAR_FETCH,
  LOCATIONS_FETCH,
  LOCATIONS_FETCH_FAILED,
  LOCATIONS_FETCH_SUCCESS,
  LOCATIONS_FETCH_USER,
  LOCATIONS_GET_MORE,
  LOCATIONS_SORT,
  LOCATIONS_SUBCATS_FETCH_SUCCESS,
  PROFILE_UPDATE_LOCATIONS_USER,
  LOCATIONS_FILTER_BY_SUBCATEGORY,
} from "../actions/type";
import _ from "underscore";
import { pageSize } from "../config";
import { getAuth } from "../firebase";

const INITIAL_STATE = {
  loading: false,
  error: false,
  message: "",
  locationsArray: [],
  query: {},
  subCategoriesArry: [],
  lastItem: {},
  originalLocationsArray: [],
  getMoreClicked: 1,
  disableLoad: false,
  currentSortValue: 0,
  userInfo: undefined,
  filteredSubCat: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOCATIONS_FETCH:
      return {
        ...state,
        getMoreClicked: 1,
        loading: true,
        error: false,
        message: "",
        disableLoad: false,
      };
    case LOCATIONS_FETCH_SUCCESS:
      let newLocations = [],
        paginatedLocations = [];
      if (
        action.payload.query.subCategory &&
        action.payload.query.subCategory.length > 0
      ) {
        newLocations = action.payload.locations.filter(
          (location) =>
            location.subCategory.id === action.payload.query.subCategory
        );
      } else {
        newLocations = action.payload.locations;
      }

      newLocations = getLocationsWithBestMatch(
        newLocations,
        action.payload.user
      );
      paginatedLocations = [...paginatedLocations, ...newLocations];
      if (paginatedLocations.length > 0) paginatedLocations.length = pageSize;

      return {
        ...state,
        loading: false,
        error: false,
        locationsArray: paginatedLocations,
        query: action.payload.query,
        lastItem: action.payload.lastItem,
        originalLocationsArray: newLocations,
        disableLoad: false,
        userInfo: action.payload.user,
      };
    case LOCATIONS_FETCH_FAILED:
      return { ...state, loading: false, error: true, message: action.payload };
    case LOCATION_SIMILAR_FETCH:
      return { ...state, loading: true, error: false, message: "" };
    case LOCATIONS_SUBCATS_FETCH_SUCCESS:
      return { ...state, subCategoriesArry: action.payload.subCategories, filteredSubCat: action.payload.filteredSubCat };
    case LOCATIONS_SORT:
      let sortedLocations = [],
        sortedPaginatedLocations = [];
      if (action.payload === 1) {
        //by price
        sortedLocations = _.sortBy(state.originalLocationsArray, "price");
      } else if (action.payload === 2) {
        sortedLocations = _.sortBy(
          state.originalLocationsArray,
          "price"
        ).reverse();
      } else if (action.payload === 3) {
        sortedLocations = _.sortBy(state.originalLocationsArray, "name");
      } else if (action.payload === 4) {
        sortedLocations = _.sortBy(
          state.originalLocationsArray,
          "name"
        ).reverse();
      }

      if (sortedLocations.length > 0)
        sortedPaginatedLocations = [
          ...sortedLocations,
          sortedPaginatedLocations,
        ];
      if (sortedPaginatedLocations.length > 0)
        sortedPaginatedLocations.length = pageSize * state.getMoreClicked;
      return {
        ...state,
        locationsArray: sortedPaginatedLocations,
        originalLocationsArray: sortedLocations,
      };

    case LOCATIONS_FILTER_BY_SUBCATEGORY:
      return {
        ...state,
        locationsArray: getLocationsFilteredByCategories(
          state.originalLocationsArray,
          action.payload
        ),
      };

    case LOCATIONS_GET_MORE:
      let moreLocations = [];
      moreLocations = [...state.originalLocationsArray, ...moreLocations];
      moreLocations.length = pageSize * (state.getMoreClicked + 1);
      return {
        ...state,
        getMoreClicked: state.getMoreClicked + 1,
        locationsArray: moreLocations,
        disableLoad:
          pageSize * (state.getMoreClicked + 1) >
          state.originalLocationsArray.length,
      };
    case PROFILE_UPDATE_LOCATIONS_USER:
      return { ...state, userInfo: action.payload };

    default:
      return state;
  }
};

function getLocationsWithBestMatch(locations, user) {
  if (!user) return locations;
  if (!user.hasOwnProperty("currentBrand")) return locations;

  if (!user.hasOwnProperty("bestMatch")) return locations;

  let userBestMatch = user.bestMatch;
  let newLocations = locations.map((location, index) => {
    if (!location.hasOwnProperty("bestMatch")) return { ...location, count: 0 };
    let locationBestMatch = location.bestMatch,
      count = 0;
    userBestMatch.map((match) => {
      count = locationBestMatch.includes(match) ? count + 1 : count;
    });
    return { ...location, count: count };
  });
  newLocations = _.sortBy(newLocations, "count").reverse();
  return newLocations || locations;
}

function getLocationsFilteredByCategories(locations = [], subCategoryId = "") {
  //locations is the array of locations you want to filter.
  //subCategoryId is the sub category id (unique) that you want to filter with
  if (locations.length === 0) return locations;

  if (subCategoryId === "") return locations;

  return _.filter(locations, function(location) {
    if (location.hasOwnProperty("subCategory")) {
      if (location.subCategory.hasOwnProperty("id")) {
        if (location.subCategory.id === subCategoryId) return location;
      }
    }
  });
}
