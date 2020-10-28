import {
  LOCATION_FETCH,
  LOCATION_FETCH_FAILED,
  LOCATION_FETCH_SUCCESS,
  LOCATION_SET,
  LOCATION_SIMILAR_FETCH,
  LOCATION_SIMILAR_FETCH_FAILED,
  LOCATION_SIMILAR_FETCH_SUCCESS,
  LOCATIONS_SHOW_BOOKING_DETAILS,
  LOCATION_VOUCHERS,
  LOCATION_PRICING_OPTIONS,
} from "./type";
import { getDb } from "../firebase";
import _ from "underscore";


export const setLocationObject = (location) => {
  return async (dispatch) => {
    dispatch({ type: LOCATION_SET, payload: location });
    try {
      let locations = [],
        loc = {};
      let locSnapshot = await getDb()
        .collection("locations")
        .where("category.id", "==", location.category.id)
        .orderBy("created_at", "desc")
        .limit(50)
        .get();
      locSnapshot.forEach((doc) => {
        loc = doc.data();
        loc["id"] = doc.id;
        locations.push(loc);
      });
      locations = locations.sort(() => Math.random() - 0.5);
      locations = locations.filter((f) => f.id !== location.id);
      locations.length = 4;
      dispatch({ type: LOCATION_SIMILAR_FETCH_SUCCESS, payload: locations });

      let pricingOptions = [],
        option = {};
      let pOptSnapshot = await getDb()
        .collection("pricingoptions")
        .get();
      pOptSnapshot.forEach((doc) => {
        option = doc.data();
        option["id"] = doc.id;
        pricingOptions.push(option);
      });
      dispatch({ type: LOCATION_PRICING_OPTIONS, payload: pricingOptions });

      let vouchers = [],
        voucher = {};
      let voucherSnapshot = await getDb()
        .collection("vouchers")
        .get();
      voucherSnapshot.forEach((doc) => {
        voucher = doc.data();
        voucher["id"] = doc.id;
        vouchers.push(voucher);
      });
      return dispatch({ type: LOCATION_VOUCHERS, payload: vouchers });
    } catch (e) {
      console.log(e);
      return dispatch({ type: LOCATION_SIMILAR_FETCH_FAILED });
    }
  };
};

export const getLocation = (id) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOCATION_FETCH });
      let locationRef = await getDb()
        .collection("locations")
        .doc(id)
        .get();
      let location = locationRef.data();
      location["id"] = locationRef.id;

      dispatch({ type: LOCATION_FETCH_SUCCESS, payload: location });

      let locations = [],
        loc = {};
      let locSnapshot = await getDb()
        .collection("locations")
        .where("category.id", "==", location.category.id)
        .orderBy("created_at", "desc")
        .limit(50)
        .get();
      locSnapshot.forEach((doc) => {
        loc = doc.data();
        loc["id"] = doc.id;
        locations.push(loc);
      });
      locations = locations.sort(() => Math.random() - 0.5);
      locations = locations.filter((f) => f.id !== location.id);
      locations.length = 4;
      dispatch({ type: LOCATION_SIMILAR_FETCH_SUCCESS, payload: locations });

      let pricingOptions = [],
        option = {};
      let pOptSnapshot = await getDb()
        .collection("pricingoptions")
        .get();
      pOptSnapshot.forEach((doc) => {
        option = doc.data();
        option["id"] = doc.id;
        pricingOptions.push(option);
      });
      dispatch({ type: LOCATION_PRICING_OPTIONS, payload: pricingOptions });

      let vouchers = [],
        voucher = {};
      let voucherSnapshot = await getDb()
        .collection("vouchers")
        .get();
      voucherSnapshot.forEach((doc) => {
        voucher = doc.data();
        voucher["id"] = doc.id;
        vouchers.push(voucher);
      });
      return dispatch({ type: LOCATION_VOUCHERS, payload: vouchers });
    } catch (e) {
      console.log(e);
      return dispatch({ type: LOCATION_FETCH_FAILED });
    }
  };
};

export const locationShowBookingDetails = () => {
  return { type: LOCATIONS_SHOW_BOOKING_DETAILS };
};

export const getSimilarLocations = (location) => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOCATION_SIMILAR_FETCH });

      let locations = [],
        location = {};
      let locSnapshot = await getDb()
        .collection("locations")
        .where("category.id", "==", location.category.id)
        .limit(4)
        .get();

      locSnapshot.forEach((doc) => {
        location = doc.data();
        location["id"] = doc.id;
        locations.push(location);
      });
      let newLocs = locations.filter((f) => f.id !== location.id);
      return dispatch({
        type: LOCATION_SIMILAR_FETCH_SUCCESS,
        payload: newLocs || [],
      });
    } catch (e) {
      console.log(e);
      return dispatch({ type: LOCATION_SIMILAR_FETCH_FAILED });
    }
  };
};

export const setPaymentObj = (payload, history) => {
  return async (dispatch) => {
    dispatch({ type: "PAYMENT_START", payload });
    history.push("/payment");
  };
};
