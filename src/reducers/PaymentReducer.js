import { CURRENCY, CURRENCY_FAILED } from "../actions/type";

const INITIAL_STATE = {
  loading: false,
  error: false,
  currency: "NGN",
  exchange: 1,
  currencies: {
    EUR: 451.64,
    USD: 381.5,
    GBP: 506.99,
    MYR: 91.59,
  },
};

export default (state = INITIAL_STATE, action) => {
  const getCurrency = (payload) => {
    if (payload === "USD") {
      return state.currencies.USD;
    } else if (payload === "EUR") {
      return state.currencies.EUR;
    } else if (payload === "GBP") {
      return state.currencies.GBP;
    } else if (payload === "MYR") {
      return state.currencies.MYR;
    }

    // : payload === "EUR"
    // ? state.currencies.EUR
    // : payload === "GBP"
    // ? state.currencies.GBP
    // : payload === "MYR"
    // ? state.currencies.MYR
    // : 1;
  };
  switch (action.type) {
    case CURRENCY:
      return {
        ...state,
        loading: true,
        error: false,
        currencies: { ...action.payload },
      };
    case "RATES_FETCH_SUCCESS":
      return {
        ...state,
        loading: true,
        error: false,
        currencies: action.payload,
      };
    case "CHANGE_CURRENCY":
      return {
        ...state,
        loading: true,
        error: false,
        currency: action.payload,
        exchange: getCurrency(action.payload),
      };
    case CURRENCY_FAILED:
      return { ...state, loading: false, error: true, message: action.payload };
    default:
      return state;
  }
};
