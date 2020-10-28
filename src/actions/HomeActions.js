import {
  HOME_FETCH,
  HOME_FETCH_FAILED,
  HOME_FETCH_SUCCESS,
  HOME_STATE_CHANGE,
  HOME_CITY_CHANGE,
  HOME_COUNTRY_CHANGE,
  HOME_CATEGORY_CHANGE,
  HOME_RESET_SEARCH,
  HOME_TAGS_CHANGE,
  HOME_STARTDATE_CHANGE,
  // HOME_STATE,
} from "./type";
import { getDb } from "../firebase";

export const getTagsStatesCitiesCategories = () => {
  return async (dispatch) => {
    dispatch({ type: HOME_FETCH });
    try {
      let state = {},
        countries = [],
        country = {},
        states = [],
        city = {},
        cities = [],
        category = {},
        categories = [],
        tag = {},
        tags = [],
        topCity = {},
        topCities = [],
        topAdspace = {},
        topAdspaces = [];

      let tagsSnapshot = await getDb()
        .collection("tags")
        .get();

      let categoriesSnapshot = await getDb()
        .collection("categories")
        .get();

      let countrySnapshot = await getDb()
        .collection("countries")
        .get();

      let statesSnapshot = await getDb()
        .collection("statesCities")
        .orderBy("label", "asc")
        .get();

      let topCitiesSnapshot = await getDb()
          .collection("topCities")
          .limit(4)
          .get();

      let topAdspaceSnapshot = await getDb()
          .collection("topAdspaces")
          .limit(3)
          .get();

      for (let state_ of statesSnapshot.docs) {
        state = state_.data();
        state["key"] = state_.id;
        states.push(state);
      }
      tagsSnapshot.forEach((doc) => {
        tag = doc.data();
        tag["id"] = doc.id;
        tag["value"] = doc.id;
        tag["label"] = tag.name;
        tags.push(tag);
      });

      countrySnapshot.forEach((doc) => {
        country = doc.data();
        country["id"] = doc.id;
        country["value"] = doc.id;
        country["label"] = country.name;
        countries.push(country);
      });

      categoriesSnapshot.forEach((doc) => {
        category = doc.data();
        category["id"] = doc.id;
        category["value"] = doc.id;
        category["label"] = category.name;
        categories.push(category);
      });

      topCitiesSnapshot.forEach((doc) => {
        topCity = doc.data();
        topCity["id"] = doc.id;
        topCities.push(topCity);
      });

      topAdspaceSnapshot.forEach((doc) => {
        topAdspace = doc.data();
        topAdspace["id"] = doc.id;
        topAdspaces.push(topAdspace);
      });

      return dispatch({
        type: HOME_FETCH_SUCCESS,
        payload: { states, cities, categories, tags, countries, topCities, topAdspaces },
      });
    } catch (e) {
      console.log(e);
      return dispatch({ type: HOME_FETCH_FAILED, payload: "" });
    }
  };
};


export const tagsChange = (tags) => {
  return { type: HOME_TAGS_CHANGE, payload: tags };
};

export const startDateChange = (date) => {
  return { type: HOME_STARTDATE_CHANGE, payload: date };
};

export const stateChange = (state, statesCities = [], countryArray = []) => {
  let stateOrCity = statesCities.find((element) => element.id === state);
  let country = countryArray.find((element) => element.id === state);
  stateOrCity = stateOrCity === undefined ? { id: null } : stateOrCity;

  return {
    type: HOME_STATE_CHANGE,
    payload: {
      state: stateOrCity.id === stateOrCity.stateId ? state : "",
      city: stateOrCity.id !== stateOrCity.stateId ? state : "",
      country: country ? country.id : "",
    },
  };
};

export const cityChange = (city) => {
  return { type: HOME_CITY_CHANGE, payload: city };
};

export const categoryChange = (category, c) => {
  return { type: HOME_CATEGORY_CHANGE, payload: category };
};

export const countryChange = (country) => {
  return { type: HOME_COUNTRY_CHANGE, payload: country };
};

export const resetSearch = () => {
  return { type: HOME_RESET_SEARCH };
};
