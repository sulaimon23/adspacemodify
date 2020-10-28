import {
  LOCATION_FETCH,
  LOCATION_FETCH_FAILED,
  LOCATION_FETCH_SUCCESS,
  LOCATION_PRICING_OPTIONS,
  LOCATION_SET,
  LOCATION_SIMILAR_FETCH,
  LOCATION_SIMILAR_FETCH_SUCCESS,
  LOCATION_VOUCHERS,
  LOCATIONS_SHOW_BOOKING_DETAILS,
} from "../actions/type";

const INITIAL_STATE = {
  loading: false,
  error: false,
  message: "",
  locationObject: {},
  showBookingDetails: false,
  locationsArray: [],
  pricingOptions: [],
  vouchers: [],
  payment: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOCATION_SET:
      return { ...INITIAL_STATE, locationObject: action.payload };
    case LOCATION_FETCH:
      return { ...INITIAL_STATE, loading: true, showBookingDetails: false };
    case LOCATION_FETCH_FAILED:
      return {
        ...state,
        error: true,
        message: action.payload || "",
        loading: false,
        showBookingDetails: false,
      };
    case LOCATION_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        message: "",
        locationObject: action.payload,
        showBookingDetails: false,
      };
    case LOCATIONS_SHOW_BOOKING_DETAILS:
      return { ...state, showBookingDetails: true };
    case LOCATION_SIMILAR_FETCH_SUCCESS:
      return { ...state, locationsArray: action.payload };
    case LOCATION_PRICING_OPTIONS:
      return { ...state, pricingOptions: action.payload };
    case LOCATION_VOUCHERS:
      return { ...state, vouchers: action.payload };
    case "PAYMENT_START":
      return { ...state, payment: action.payload };
    default:
      return state;
  }
};
