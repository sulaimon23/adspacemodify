import {
  BRANDING_RESET_BRANDING,
  MEDIA_PLANNING_ADD_REDUCE,
  MEDIA_PLANNING_DATE,
  MEDIA_PLANNING_FETCH,
  MEDIA_PLANNING_FETCH_FAILED,
  MEDIA_PLANNING_FETCH_SUCCESS,
  MEDIA_PLANNING_FILEUPLOAD,
  MEDIA_PLANNING_LOAD_SAVED_PLAN,
  MEDIA_PLANNING_LOAD_SAVED_PLAN_FAILED,
  MEDIA_PLANNING_LOAD_SAVED_PLAN_SUCCESS,
  MEDIA_PLANNING_MESSAGE,
  MEDIA_PLANNING_NOT_APPLICABLE_CHANGE,
  MEDIA_PLANNING_OPENROW,
  MEDIA_PLANNING_PAGINATED,
  MEDIA_PLANNING_PERIOD_CHANGE,
  MEDIA_PLANNING_REFINING,
  MEDIA_PLANNING_REFINING_FAILED,
  MEDIA_PLANNING_REFINING_SUCCESS,
  MEDIA_PLANNING_SAVE,
  MEDIA_PLANNING_SAVE_FAILED,
  MEDIA_PLANNING_SAVE_PLAN,
  MEDIA_PLANNING_SAVE_SUCCESS,
  MEDIA_PLANNING_SELECT_PLANS,
  MEDIA_PLANNING_SHOW_BOOKING,
  MEDIA_PLANNING_SORT,
  MEDIA_PLANNING_SHOW_SIGN_IN,
  MEDIA_PLANNING_SHOW_CURRENT_STATE,
  MEDIA_PLANNING_AFTER_SIGNUP,
  MEDIA_PLANNING_AFTER_SIGNUP_FAILED, LOGIN_SET_AUTHENTICATED, MEDIA_PLANNING_DO_NOTHING
} from "./type";
import { getAuth, getDb, getTimestamp, firebaseObject, } from "../firebase";
import _ from "underscore";
import { isUserLoggedIn } from "../utils";
const { cloud_api } = require("../config");

export const getAllLocations = (brandingObject) => {
  return async (dispatch) => {
    dispatch({ type: MEDIA_PLANNING_FETCH });
    try {
      let locations = [],
        location = {},
        tags = [],
        tag = {},
        categories = [],
        category = {},
        subCategories = [],
        subCategory = {},
        states = [],
        state = {},
        cities = [],
        city = {};
      let locationsSnapshot = await getDb()
        .collection("locations")
        .where("status", "==", 0)
        .limit(500)
        .get();
      /*let tagsSnapshot = await getDb()
        .collection("tags")
        .limit(20)
        .get();*/
      let categoriesSnapshot = await getDb()
        .collection("categories")
        .get();
      let subCats = await getDb()
        .collectionGroup("subcategories")
        .limit(50)
        .get();
      let statesSnapshot = await getDb()
        .collection("states")
        .get();
      let citiesSnapshot = await getDb()
        .collectionGroup("cities")
        .limit(100)
        .get();
      locationsSnapshot.forEach((doc) => {
        location = doc.data();
        location["id"] = doc.id;
        location["userAddedQuantity"] = 0;
        location["period"] = 1;
        location["notApplicable"] = false;
        locations.push(location);
      });
      /*tagsSnapshot.forEach((doc) => {
        tag = doc.data();
        tag["id"] = doc.id;
        tags.push(tag);
      });*/
      categoriesSnapshot.forEach((doc) => {
        category = doc.data();
        category["id"] = doc.id;
        categories.push(category);
      });
      subCats.forEach((doc) => {
        subCategory = doc.data();
        subCategory["id"] = doc.id;
        subCategory["cat_id"] = doc.ref.parent.parent.id;
        subCategories.push(subCategory);
      });
      statesSnapshot.forEach((doc) => {
        state = doc.data();
        state["id"] = doc.id;
        states.push(state);
      });
      citiesSnapshot.forEach((doc) => {
        city = doc.data();
        city["id"] = doc.id;
        city["state_id"] = doc.ref.parent.parent.id;
        cities.push(city);
      });

      let user = getAuth().currentUser, userInfo;
      if (user){
        let userDoc = await getDb().collection("users").doc(user.email).get();
        if (userDoc.exists) {
          userInfo = userDoc.data();
          let savedPlans = userInfo.savedPlans;
          dispatch({ type: MEDIA_PLANNING_SELECT_PLANS, payload: savedPlans });
        }
      }

      if (userInfo){
        dispatch({ type: BRANDING_RESET_BRANDING })
      }

      return dispatch({
        type: MEDIA_PLANNING_FETCH_SUCCESS,
        payload: { locations, tags, categories, subCategories, states, cities, brandingObject, user: userInfo },
      });


    } catch (e) {
      console.log(e);
      return dispatch({
        type: MEDIA_PLANNING_FETCH_FAILED,
        payload: "OOPS SOMETHING WENT WRONG FETCHING ADSPACES",
      });
    }
  };
};

export const querySearch = (
  checkedTags = [],
  checkedCategories = [],
  tagsArray,
  categoriesArray,
  locations,
  price,
  checkedSubCategories = [],
  subCategoriesArray,
  checkedStates = [],
  checkedCities = [],
  citiesArray,
  statesArray,
  currentLocations
) => {
  return async (dispatch) => {
    dispatch({ type: MEDIA_PLANNING_REFINING });
    try {
      let tags = [],
        categories = [],
        fullLocations = [],
        pricedLocations = [],
        subCategories = [],
        states = [],
        cities = [];
      if (
        checkedTags.length === 0 &&
        checkedCategories.length === 0 &&
        checkedSubCategories.length === 0 &&
        checkedStates.length === 0 &&
        checkedCities.length === 0
      ) {
        if (price.startValue !== -1) {
          pricedLocations = locations.filter(
            (f) => f.price <= price.endValue && f.price >= price.startValue
          );
        } else pricedLocations = locations;
        return dispatch({
          type: MEDIA_PLANNING_REFINING_SUCCESS,
          payload: pricedLocations,
        });
      }

      checkedTags.forEach((tag) => {
        tagsArray.forEach((tag_, index) => {
          if (tag === index) {
            tags.push(tag_.id);
          }
        });
      });

      checkedCategories.forEach((cat) => {
        categoriesArray.forEach((cat_, index) => {
          if (cat === index) {
            categories.push(cat_.id);
          }
        });
      });

      checkedSubCategories.forEach((subCat) => {
        subCategoriesArray.forEach((subCat_, index) => {
          if (subCat === index) subCategories.push(subCat_.id);
        });
      });

      checkedStates.forEach((state) => {
        statesArray.forEach((state_, index) => {
          if (state === index) {
            states.push(state_.id);
          }
        });
      });

      checkedCities.forEach((city) => {
        citiesArray.forEach((city_, index) => {
          if (city === index) cities.push(city_.id);
        });
      });

      /*
       * 1. Check if only states are checked and then get states
       * 2. Check if only states and cities are checked, use cities and states to compare
       * 3. Check if only states , cities and categories are checked, use state, cities and categories to compare
       * 4. Check if only state, cities , categories and subcategories are checked, use state, cities, category and subcategories to compare
       * 5. Check if only states and categories are checked, use states and categories to compare
       * 6. Check if only states ,categories and subcategories are checked, use states, categories and subcategories to compare
       * 7. Check if only categories are checked, use categories to compare
       * 8. Check if only categories , subcategories are checked, use subcategories to compare
       * */

      let newLocations = [],
        taggedLocations = [],
        finalLocations = [];

      if (
        tags &&
        tags.length > 0 &&
        (states &&
          states.length === 0 &&
          (cities && cities.length === 0) &&
          (categories && categories.length === 0) &&
          (subCategories && subCategories.length === 0))
      ) {
        newLocations = locations.filter((f) =>
          f.tags.some((r) => tags.includes(r))
        );
        newLocations.forEach((doc) => {
          fullLocations.push(doc);
        });
        finalLocations = fullLocations;
      } else {
        if (
          states &&
          states.length > 0 &&
          (cities && cities.length === 0) &&
          (categories && categories.length === 0) &&
          (subCategories && subCategories.length === 0)
        ) {
          newLocations = locations.filter((f) =>
            states.includes(f.state ? f.state.id : "")
          );
          newLocations.forEach((doc) => {
            fullLocations.push(doc);
          });
          let nationWideLocations = locations.filter((f) => f.state.id === 'nationwide');
          fullLocations = fullLocations.concat(nationWideLocations);
        } else if (
          states &&
          states.length > 0 &&
          (cities && cities.length > 0) &&
          (categories && categories.length === 0) &&
          (subCategories && subCategories.length === 0)
        ) {
          let aloneStates = [], pushedStates = [];
          newLocations = locations.filter(f => {
            if (states.includes(f.state ? f.state.id : '')) {
              if (cities.includes(f.city ? f.city.id : '')) {
                if (pushedStates.indexOf(f.state.id) === -1)
                  pushedStates.push(f.state.id);
                return true;
              }

              return false;
            } else {
              return false;
            }
          });

          aloneStates = states.filter(function (obj) {
            return pushedStates.indexOf(obj) === -1;
          });

          let aloneStatesLocs = locations.filter(f => aloneStates.includes(f.state ? f.state.id : ''));

          let sniffedLocations = newLocations.concat(aloneStatesLocs);

          sniffedLocations.forEach(doc => {
            fullLocations.push(doc);
          });

          let nationWideLocations = locations.filter((f) => f.state.id === 'nationwide');
          let stateWideLocations = locations.filter(f => states.includes(f.city ? f.city.id : ''));
          fullLocations = fullLocations.concat(nationWideLocations);
          fullLocations = fullLocations.concat(stateWideLocations);

        } else if (
          states &&
          states.length > 0 &&
          (cities && cities.length > 0) &&
          (categories && categories.length > 0) &&
          (subCategories && subCategories.length === 0)
        ) {
          newLocations = locations.filter(
            (f) =>
              cities.includes(f.city ? f.city.id : "") &&
              categories.includes(f.category ? f.category.id : "")
          );
          newLocations.forEach((doc) => {
            fullLocations.push(doc);
          });

          let nationWideLocations = locations.filter((f) => f.state.id === 'nationwide' && categories.includes(f.category ? f.category.id : ""));
          let stateWideLocations = locations.filter(f => states.includes(f.city ? f.city.id : ''));
          fullLocations = fullLocations.concat(nationWideLocations);
          fullLocations = fullLocations.concat(stateWideLocations);
        } else if (
          states &&
          states.length > 0 &&
          (cities && cities.length > 0) &&
          (categories && categories.length > 0) &&
          (subCategories && subCategories.length > 0)
        ) {
          newLocations = locations.filter(
            (f) =>
              cities.includes(f.city ? f.city.id : "") &&
              subCategories.includes(f.subCategory ? f.subCategory.id : "")
          );
          newLocations.forEach((doc) => {
            fullLocations.push(doc);
          });

          let nationWideLocations = locations.filter((f) => f.state.id === 'nationwide' &&
              subCategories.includes(f.subCategory ? f.subCategory : ""));
          let stateWideLocations = locations.filter(f => states.includes(f.city ? f.city.id : ''));
          fullLocations = fullLocations.concat(nationWideLocations);
          fullLocations = fullLocations.concat(stateWideLocations);
        } else if (
          states &&
          states.length > 0 &&
          (cities && cities.length === 0) &&
          (categories && categories.length > 0) &&
          (subCategories && subCategories.length === 0)
        ) {
          newLocations = locations.filter(
            (f) =>
              states.includes(f.state ? f.state.id : "") &&
              categories.includes(f.category ? f.category.id : "")
          );
          newLocations.forEach((doc) => {
            fullLocations.push(doc);
          });

          let nationWideLocations = locations.filter((f) => f.state.id === 'nationwide' && categories.includes(f.category ? f.category.id : ""));
          fullLocations = fullLocations.concat(nationWideLocations);

        } else if (
          states &&
          states.length > 0 &&
          (cities && cities.length === 0) &&
          (categories && categories.length > 0) &&
          (subCategories && subCategories.length > 0)
        ) {
          newLocations = locations.filter(
            (f) =>
              states.includes(f.state ? f.state.id : "") &&
              subCategories.includes(f.subCategory ? f.subCategory.id : "")
          );
          newLocations.forEach((doc) => {
            fullLocations.push(doc);
          });

            let nationWideLocations = locations.filter((f) => f.state.id === 'nationwide' &&
                subCategories.includes(f.subCategory ? f.subCategory : ""));
            fullLocations = fullLocations.concat(nationWideLocations);

        } else if (
          states &&
          states.length === 0 &&
          (cities && cities.length === 0) &&
          (categories && categories.length > 0) &&
          (subCategories && subCategories.length === 0)
        ) {
          newLocations = locations.filter((f) =>
            categories.includes(f.category ? f.category.id : "")
          );
          newLocations.forEach((doc) => {
            fullLocations.push(doc);
          });

          //let nationWideLocations = locations.filter((f) => f.state.id === 'nationwide');
          //fullLocations = fullLocations.concat(nationWideLocations);

        } else if (
          states &&
          states.length === 0 &&
          (cities && cities.length === 0) &&
          (categories && categories.length > 0) &&
          (subCategories && subCategories.length > 0)
        ) {
          newLocations = locations.filter((f) =>
            subCategories.includes(f.subCategory ? f.subCategory.id : "")
          );
          newLocations.forEach((doc) => {
            fullLocations.push(doc);
          });
        }

        if (tags && tags.length > 0) {
          taggedLocations = fullLocations.filter((f) =>
            f.tags.some((r) => tags.includes(r))
          );
          taggedLocations.forEach((doc) => {
            finalLocations.push(doc);
          });
        } else finalLocations = fullLocations;
      }

      let removedDups = _.uniq(finalLocations, "id");
      if (price.startValue !== -1) {
        pricedLocations = removedDups.filter(
          (f) => f.price <= price.endValue && f.price >= price.startValue
        );
      } else pricedLocations = removedDups;

      return dispatch({
        type: MEDIA_PLANNING_REFINING_SUCCESS,
        payload: pricedLocations,
      });
    } catch (e) {
      console.log(e);
      return dispatch({
        type: MEDIA_PLANNING_REFINING_FAILED,
        payload: "OOPS SOMETHING WENT WRONG!",
      });
    }
  };
};

export const addReduceQuantity = (locationId, action) => {
  return {
    type: MEDIA_PLANNING_ADD_REDUCE,
    payload: { id: locationId, action, quantity: 1 },
  };
};


export const addReduceQuantityByInput = (locationId, location, quantity) => {

  return {
    type: MEDIA_PLANNING_ADD_REDUCE,
    payload: { id: locationId, action: 'none', quantity: quantity },
  };
};

export const displayMDMessage = (message) => {
  return { type: MEDIA_PLANNING_MESSAGE, payload: message };
};

export const showMDbooking = (show) => {
  return { type: MEDIA_PLANNING_SHOW_BOOKING, payload: show };
};

export const periodChange = (locationId, period) => {
  return {
    type: MEDIA_PLANNING_PERIOD_CHANGE,
    payload: { id: locationId, period },
  };
};

export const changeNotApplicable = (id) => {
  return { type: MEDIA_PLANNING_NOT_APPLICABLE_CHANGE, payload: id };
};

export const submitAdspaces = (
  locations,
  startDate,
  totalPrice,
  campaignTitle,
  status = 0,
  currency,
  exchange
) => {
  if (campaignTitle === "")
    return {
      type: MEDIA_PLANNING_SAVE_FAILED,
      payload: "PLEASE PROVIDE A CAMPAIGN TITLE",
    };

  if (!locations || locations.length <= 0)
    return {
      type: MEDIA_PLANNING_SAVE_FAILED,
      payload: "ERROR: NO ADSPACES TO CREATE ORDERS",
    };

  return async (dispatch) => {
    dispatch({ type: MEDIA_PLANNING_SAVE });
    try {
      let token;
      let user = getAuth().currentUser;

      if (user) token = await user.getIdToken(true);
      if (!token)
        return dispatch({
          type: MEDIA_PLANNING_SAVE_FAILED,
          payload: "OOPS, SOMETHING WENT WRONG PLEASE LOG OUT AND LOG IN",
        });

      let data = {};
      data.user = {
        email: user.email,
        name: user.displayName,
      };

      let locationData = locations.map((locationObject) => {
        return {
          user: { email: user.email, name: user.displayName },
          campaignTitle: campaignTitle,

          quantity: locationObject.userAddedQuantity,
          currency,
          exchange,
          location: {
            id: locationObject.id,
            name: locationObject.name,
            company: locationObject.company,
            price: locationObject.price,
            category: locationObject.category,
            subCategory: locationObject.subCategory,
            discountedPrice: locationObject.discountedPrice,
            geolocation: locationObject.geolocation,
            state: locationObject.state ? locationObject.state : {},
            city: locationObject.city ? locationObject.city : {},
            imageUrl: locationObject.resizedImages ? (locationObject.resizedImages[0] || '') : (locationObject.images ? locationObject.images[0] : ''),
          },
          startDate: getTimestamp(startDate._d),
          notApplicable: locationObject.notApplicable,
          status: status,
          period: locationObject.period,
          totalPrice: locationObject.discountedPrice
            ? locationObject.discountedPrice.checked
              ? (locationObject.discountedPrice.value
                ? Number(locationObject.discountedPrice.value)
                : 0) *
              locationObject.userAddedQuantity *
              (locationObject.notApplicable ? 1 : locationObject.period)
              : (locationObject.price ? Number(locationObject.price) : 0) *
              locationObject.userAddedQuantity *
              (locationObject.notApplicable ? 1 : locationObject.period)
            : (locationObject.price ? Number(locationObject.price) : 0) *
            locationObject.userAddedQuantity *
            (locationObject.notApplicable ? 1 : locationObject.period),
        };
      });

      let orderArray = [],
        orderNos = "";
      for (let location of locationData) {
        let res = await fetch(`${cloud_api}/createOrder`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(location),
        });

        if (res.status === 200) {
          let order = await res.json();
          if (order.code === 0) {
            location.orderNo = order.orderNo;
            orderNos = orderNos + location.orderNo + ", ";
            orderArray.push(location);
          }
        }
      }

      return dispatch({
        type: MEDIA_PLANNING_SAVE_SUCCESS,
        payload: { orderArray, orderNos, totalPrice },
      });
    } catch (e) {
      console.log(e);
      return dispatch({
        type: MEDIA_PLANNING_SAVE_FAILED,
        payload: "ERROR MAKING YOUR ORDER",
      });
    }
  };
};

export const submitAdspacesPaid = (
  locations,
  startDate,
  totalPrice,
  campaignTitle,
  status = 1,
  currency,
  exchange,

) => {
  if (campaignTitle === "")
    return {
      type: MEDIA_PLANNING_SAVE_FAILED,
      payload: "PLEASE PROVIDE A CAMPAIGN TITLE",
    };

  if (!locations || locations.length <= 0)
    return {
      type: MEDIA_PLANNING_SAVE_FAILED,
      payload: "ERROR: NO ADSPACES TO CREATE ORDERS",
    };

  return async (dispatch) => {
    dispatch({ type: MEDIA_PLANNING_SAVE });
    try {
      let token;
      let user = getAuth().currentUser;

      if (user) token = await user.getIdToken(true);
      if (!token)
        return dispatch({
          type: MEDIA_PLANNING_SAVE_FAILED,
          payload: "OOPS, SOMETHING WENT WRONG PLEASE LOG OUT AND LOG IN",
        });

      let data = {};
      data.user = {
        email: user.email,
        name: user.displayName,
      };

      let locationData = locations.map((locationObject) => {
        const total = locationObject.discountedPrice
          ? locationObject.discountedPrice.checked
            ? (locationObject.discountedPrice.value
              ? Number(locationObject.discountedPrice.value)
              : 0) *
            locationObject.userAddedQuantity *
            (locationObject.notApplicable ? 1 : locationObject.period)
            : (locationObject.price ? Number(locationObject.price) : 0) *
            locationObject.userAddedQuantity *
            (locationObject.notApplicable ? 1 : locationObject.period)
          : (locationObject.price ? Number(locationObject.price) : 0) *
          locationObject.userAddedQuantity *
          (locationObject.notApplicable ? 1 : locationObject.period)
        const vat = (7.5 / 100) * total
        return {
          user: { email: user.email, name: user.displayName },
          campaignTitle: campaignTitle,
          quantity: locationObject.userAddedQuantity,
          currency,
          exchange,
          location: {
            id: locationObject.id,
            name: locationObject.name,
            company: locationObject.company,
            price: locationObject.price,
            category: locationObject.category,
            subCategory: locationObject.subCategory,
            discountedPrice: locationObject.discountedPrice,
            geolocation: locationObject.geolocation,
            state: locationObject.state ? locationObject.state : {},
            city: locationObject.city ? locationObject.city : {},
            imageUrl: locationObject.resizedImages ? (locationObject.resizedImages[0] || '') : (locationObject.images ? locationObject.images[0] || '' : '')
          },
          startDate: getTimestamp(startDate._d),
          notApplicable: locationObject.notApplicable,
          status,
          period: locationObject.period,
          totalPrice: vat + total
        };
      });

      let orderArray = [],
        orderNos = "";
      for (let location of locationData) {
        let res = await fetch(`${cloud_api}/createOrder`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(location),
        });

        if (res.status === 200) {
          let order = await res.json();
          if (order.code === 0) {
            location.orderNo = order.orderNo;
            orderNos = orderNos + location.orderNo + ", ";
            orderArray.push(location);
          }
        }
      }

      return dispatch({
        type: MEDIA_PLANNING_SAVE_SUCCESS,
        payload: { orderArray, orderNos, totalPrice },
      });
    } catch (e) {
      console.log(e);
      return dispatch({
        type: MEDIA_PLANNING_SAVE_FAILED,
        payload: "ERROR MAKING YOUR ORDER",
      });
    }
  };
};

export const displayMDMessageBookingDetails = (message) => {
  return { type: MEDIA_PLANNING_SAVE_FAILED, payload: message };
};

export const paginateLocations = (value, locations) => {
  return { type: MEDIA_PLANNING_PAGINATED, payload: locations };
};

export const sortMDLocations = (value) => {
  return { type: MEDIA_PLANNING_SORT, payload: value };
};

export const updateLocationWithStartEndDate = (action, date, location, row) => {
  return { type: MEDIA_PLANNING_DATE, payload: { action, date, location, row } }
};

export const updateOpenRow = (row) => {
  return { type: MEDIA_PLANNING_OPENROW, payload: row }
};

export const fileInputChange = (file, name, location) => {
  return { type: MEDIA_PLANNING_FILEUPLOAD, payload: { file, name, location } }
};

export const loadSavedPlan = () => {
  return async (dispatch) => {
    dispatch({ type: MEDIA_PLANNING_LOAD_SAVED_PLAN });

    try {
      let user = getAuth().currentUser;
      let userDoc = await getDb().collection("users").doc(user.email).get();
      if (userDoc.exists) {
        let userInfo = userDoc.data();
        let savedPlan = userInfo.savedPlans;
        return dispatch({ type: MEDIA_PLANNING_LOAD_SAVED_PLAN_SUCCESS, payload: savedPlan });
      }
      else
        return dispatch({ type: MEDIA_PLANNING_LOAD_SAVED_PLAN_FAILED });
    }
    catch (e) {
      console.log(e)
      return dispatch({ type: MEDIA_PLANNING_LOAD_SAVED_PLAN_FAILED });
    }
  }
};

export const savePlanToUserObject = (locations, campaignTitle, totalPrice, brandingObject) => {
  return async (dispatch) => {
    dispatch({ type: MEDIA_PLANNING_SAVE });

    try {
      let user = getAuth().currentUser, brandName = '', savedPlans = [], data;
      let userDoc = await getDb().collection("users").doc(user.email).get();
      if (userDoc.exists) {
        data = userDoc.data();
        brandName = data.currentBrand ? data.currentBrand.brandName || '' : '';
      }

      if (brandName === '' && brandingObject === undefined) {
        return dispatch({ type: MEDIA_PLANNING_SAVE_FAILED, payload: "YOU DO NOT HAVE A CURRENT ACTIVE BRAND" });
      }
      else if (brandName === '' && brandingObject !== undefined)
        brandName = brandingObject.currentBrand.brandName || '';

      let exists = false;

      if (data.hasOwnProperty("savedPlans")) {
        if (data.savedPlans.length === 0)
          savedPlans.push({ campaignTitle, locations, totalPrice, brandName });
        else {
          savedPlans = data.savedPlans.map(element => {
            if (element.brandName === brandName) {
              exists = true;
              return { ...element, locations, campaignTitle, totalPrice }
            }
            else
              return element;
          });
          if (exists === false)
            savedPlans.push({ locations, campaignTitle, totalPrice, brandName });
        }
      } else {
        savedPlans.push({ campaignTitle, locations, totalPrice, brandName });
      }

      let dataToSave = {
        savedPlans
      };

      if (brandingObject !== undefined){
        dataToSave['isMulti'] = brandingObject.branding === 'multi';
        dataToSave['currentBrand'] = brandingObject.currentBrand;
        dataToSave['bestMatch'] = brandingObject.bestMatch || [];
        dataToSave['brands'] = brandingObject.brands;
      }
      await getDb().collection("users").doc(user.email).set(dataToSave, { merge: true });

      return dispatch({ type: MEDIA_PLANNING_SAVE_PLAN, payload: savedPlans })
    }
    catch (e) {
      console.log(e);
      return dispatch({
        type: MEDIA_PLANNING_SAVE_FAILED,
        payload: "ERROR SAVING MEDIA PLAN",
      });
    }
  }
};

export const savedPlanSelected = (selectedBrand, savedPlans) => {
  let plan = _.findWhere(savedPlans, { brandName: selectedBrand });
  return { type: MEDIA_PLANNING_LOAD_SAVED_PLAN_SUCCESS, payload: { plan, selectedBrand } }
};


export const showSignInPageCard = () => {
  return { type: MEDIA_PLANNING_SHOW_SIGN_IN }
};


export const showCurrentState = () => {
  return { type: MEDIA_PLANNING_SHOW_CURRENT_STATE, payload: {set: undefined} }
};
