import { getDb } from "../firebase";

export const getRate = () => {
  return async (dispatch) => {
    dispatch({ type: "RATES_FETCH" });
    try {
      let rate = {},
        rates = [];
      let ratesRef = await getDb()
        .collection("rates")
        .get();
      ratesRef.forEach((doc) => {
        rate = doc.data();
        rate["id"] = doc.id;
        rates.push(rate);
      });
      //   console.log(rates, "RATES");
      const curr = { MYR: 91.59 };
      rates.forEach((rate) => {
        if (rate.name === "USD") {
          Object.assign(curr, { USD: rate.value });
        } else if (rate.name === "EUR") {
          Object.assign(curr, { EUR: rate.value });
        } else if (rate.name === "GBP") {
          Object.assign(curr, { GBP: rate.value });
        }
        if (rate.name === "MYR") {
          Object.assign(curr, { MYR: rate.value });
        }
      });
      //   const curr = { ...rates };


      return dispatch({
        type: "RATES_FETCH_SUCCESS",
        payload: curr || {},
      });
    } catch (e) {
      console.log(e);
      return dispatch({
        type: "RATES_FETCH_FAILED",
        payload: "ERROR 101: FETCHING STATES",
      });
    }
  };
};
