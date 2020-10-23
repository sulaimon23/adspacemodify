import {
  HOME_CATEGORY_CHANGE,
  HOME_CITY_CHANGE,
  HOME_FETCH,
  HOME_FETCH_FAILED,
  HOME_FETCH_SUCCESS,
  HOME_RESET_SEARCH,
  HOME_STARTDATE_CHANGE,
  HOME_STATE_CHANGE,
  HOME_TAGS_CHANGE,
  HOME_COUNTRY_CHANGE,
} from "../actions/type";

const INITIAL_STATE = {
  loading: false,
  error: false,
  message: "",
  statesArray: [],
  citiesArray: [],
  countryArray: [],
  categoriesArray: [],
  stateCities: [],
  state: "",
  country: "",
  city: "",
  category: "",
  tagsArray: [],
  tags: [],
  startDate: "",
  topCities: [],
  topAdspaces: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case HOME_FETCH:
      return { ...INITIAL_STATE, loading: true, error: false, message: "" };
    case HOME_FETCH_FAILED:
      return { ...state, loading: false, error: true, message: action.payload };
    case HOME_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        message: "",
        statesArray: action.payload.states || [],
        citiesArray: action.payload.cities || [],
        categoriesArray: action.payload.categories || [],
        stateCities: [],
        tagsArray: action.payload.tags || [],
        countryArray: action.payload.countries || [],
        topCities: action.payload.topCities || [],
        topAdspaces: action.payload.topAdspaces || []
      };
    case HOME_TAGS_CHANGE:
      return { ...state, loading: false, error: false, tags: action.payload };
    case HOME_STATE_CHANGE:
      return {
        ...state,
        loading: false,
        error: false,
        stateCities: action.payload.newCities || [],
        state: action.payload.state || "",
        city: action.payload.city,
        country: action.payload.country,
      };
    case HOME_CITY_CHANGE:
      return { ...state, loading: false, error: false, city: action.payload };
    case HOME_CATEGORY_CHANGE:
      return {
        ...state,
        loading: false,
        error: false,
        category: action.payload,
      };
    case HOME_COUNTRY_CHANGE:
      return {
        ...state,
        loading: false,
        error: false,
        country: action.payload,
      };
    case HOME_STARTDATE_CHANGE:
      return {
        ...state,
        loading: false,
        error: false,
        startDate: action.payload,
      };
    case HOME_RESET_SEARCH:
      return {
        ...state,
        state: "",
        city: "",
        category: "",
        country: "",
        loading: false,
        error: "",
        message: "",
        tags: [],
      };
    default:
      return state;
  }
};
