import {
    MEDIA_PLANNING_ADD_REDUCE,
    MEDIA_PLANNING_DATE,
    MEDIA_PLANNING_FETCH,
    MEDIA_PLANNING_FETCH_FAILED,
    MEDIA_PLANNING_FETCH_SUCCESS,
    MEDIA_PLANNING_FILEUPLOAD, MEDIA_PLANNING_LOAD_SAVED_PLAN_SUCCESS,
    MEDIA_PLANNING_MESSAGE,
    MEDIA_PLANNING_NOT_APPLICABLE_CHANGE,
    MEDIA_PLANNING_OPENROW,
    MEDIA_PLANNING_PAGINATED,
    MEDIA_PLANNING_PERIOD_CHANGE,
    MEDIA_PLANNING_REFINING_SUCCESS, MEDIA_PLANNING_REMOVED_BRAND,
    MEDIA_PLANNING_SAVE,
    MEDIA_PLANNING_SAVE_FAILED,
    MEDIA_PLANNING_SAVE_PLAN,
    MEDIA_PLANNING_SAVE_SUCCESS, MEDIA_PLANNING_SELECT_PLANS,
    MEDIA_PLANNING_SHOW_BOOKING,
    MEDIA_PLANNING_SORT,
    PROFILE_UPDATE_MEDIAPLANNING_USER,
    MEDIA_PLANNING_SHOW_SIGN_IN, MEDIA_PLANNING_SHOW_CURRENT_STATE
} from "../actions/type";
import _ from "underscore";
import {func} from "prop-types";
import moment from "moment";

const INITIAL_STATE = {
    loading: false,
    error: false,
    message: '',
    locationsArray: [],
    tagsArray: [],
    categoriesArray: [],
    subCategoriesArray: [],
    statesArray: [],
    citiesArray: [],
    originalLocationsArray: [],
    totalPrice: 0,
    showMDDetails: false,
    saveLoader: false,
    saveMessage: '',
    saveError: false,
    orders: [],
    success: false,
    orderNos: '',
    userInfo: undefined,
    openRow: 0,
    savedPlans: [],
    savedPlan: '',
    showSignIn: false
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case MEDIA_PLANNING_FETCH:
            return { ...state, loading: true, showMDDetails: false, success: false, orderNos: '', showSignIn: false };
        case MEDIA_PLANNING_FETCH_FAILED:
            return { ...state, error: true, message: action.payload, loading: false, showMDDetails: false,success: false, showSignIn: false };
        case MEDIA_PLANNING_FETCH_SUCCESS:

            let newLocations = getLocationsWithBestMatch(action.payload.locations, action.payload.user, action.payload.brandingObject);
            return { ...INITIAL_STATE, locationsArray: newLocations || [], tagsArray: action.payload.tags || [],
                categoriesArray: action.payload.categories || [], originalLocationsArray: newLocations || [], showMDDetails: false,
            success: false, orderNos: '', subCategoriesArray: action.payload.subCategories || [], statesArray: action.payload.states || [],
            citiesArray: action.payload.cities, userInfo: action.payload.user , showSignIn: false, savedPlans: state.savedPlans};
        case MEDIA_PLANNING_REFINING_SUCCESS:
            return { ...state, locationsArray: action.payload, showMDDetails: false, success: false , orderNos: '', showSignIn: false};
        case MEDIA_PLANNING_ADD_REDUCE:
            let {
                locations, totalPrice
            } = addReduceQty(state.originalLocationsArray, action.payload.id, action.payload.action, state.totalPrice, action.payload.quantity);
            return { ...state, error: false, message: '', showMDDetails: state.showMDDetails, originalLocationsArray: locations , totalPrice:  totalPrice,
                locationsArray: addReduceQty(state.locationsArray, action.payload.id, action.payload.action, state.totalPrice, action.payload.quantity).locations,
            saveLoader: false, saveError: false, saveMessage: '' , success: false  , showSignIn: false };
        case MEDIA_PLANNING_MESSAGE:
            return { ...state, error: true, message: action.payload , success: false, showSignIn: false};
        case MEDIA_PLANNING_SHOW_BOOKING:
            return { ...state, showMDDetails: action.payload , showSignIn: false};
        case MEDIA_PLANNING_PERIOD_CHANGE:
            let {
                locations_, totalPrice_
            } = changePeriodFunc(state.originalLocationsArray, action.payload.id, state.totalPrice, action.payload.period);
            return { ...state , orderNos: '', success: false, error: false, message: '', showMDDetails: state.showMDDetails, originalLocationsArray: locations_, totalPrice: totalPrice_, showSignIn: false};
        case MEDIA_PLANNING_NOT_APPLICABLE_CHANGE:
            let { locs, ttPrice } = changeNotApplicable(state.originalLocationsArray, action.payload, state.totalPrice);
            return { ...state, success: false, error: false, message: '', showMDDetails: state.showMDDetails, originalLocationsArray: locs, totalPrice: ttPrice, showSignIn: false};
        case MEDIA_PLANNING_SAVE:
            return { ...state, error: false, message: '', showMDDetails: true, saveLoader: true, success: false, orderNos: '', showSignIn: false };
        case MEDIA_PLANNING_SAVE_FAILED:
            return { ...state, error: false, message: '', showMDDetails: true, saveLoader: false, saveError: true, saveMessage: action.payload , success: false, showSignIn: false};
        case MEDIA_PLANNING_SAVE_SUCCESS:   
            return { ...state, error: false, message: '', showMDDetails: state.showMDDetails, saveLoader: false, saveError: false, saveMessage: '',
            success: true, orders: action.payload.orderArray, orderNos: action.payload.orderNos, totalPrice: action.payload.totalPrice, showSignIn: false };
        case MEDIA_PLANNING_PAGINATED:
            return { ...state, locationsArray: action.payload, showSignIn: false };
        case MEDIA_PLANNING_SORT:
            let sortedLocations = [];
            if (action.payload === 1){ //by price
                sortedLocations = _.sortBy(state.locationsArray, 'price');
            }else if (action.payload === 2){
                sortedLocations = _.sortBy(state.locationsArray, 'price').reverse();
            }else if (action.payload === 3){
                sortedLocations = _.sortBy(state.locationsArray, 'name');
            }else if (action.payload === 4){
                sortedLocations = _.sortBy(state.locationsArray, 'name').reverse();
            }
            return { ...state, locationsArray: sortedLocations, showSignIn: false };
        case PROFILE_UPDATE_MEDIAPLANNING_USER:
            return { ...state, userInfo: action.payload, showSignIn: false};
        case MEDIA_PLANNING_DATE:
            return { ...state, originalLocationsArray: updateLocationsStartEndDate(action.payload.action, action.payload.date, action.payload.location, state.originalLocationsArray),
                openRow: action.payload.row, showSignIn: false};
        case MEDIA_PLANNING_OPENROW:
            return { ...state, openRow: action.payload, showSignIn: false };
        case MEDIA_PLANNING_FILEUPLOAD:
            return { ...state, showSignIn: false,
                originalLocationsArray: updateLocationWithFile(action.payload.file, action.payload.name, action.payload.location, state.originalLocationsArray)};
        case MEDIA_PLANNING_SAVE_PLAN:
            return { ...state, saveError: true, saveMessage: "Your plan has been saved successfully", saveLoader: false, savedPlans: action.payload};
        case MEDIA_PLANNING_LOAD_SAVED_PLAN_SUCCESS:
            return { ...state, originalLocationsArray: loadSavedPlanIntoLocations(action.payload.plan.locations, state.originalLocationsArray),
                showMDDetails: true, totalPrice: action.payload.plan.totalPrice, savedPlan: action.payload.selectedBrand, showSignIn: false};
        case MEDIA_PLANNING_SELECT_PLANS:
            return { ...state, savedPlans: action.payload , showSignIn: false};
        case MEDIA_PLANNING_REMOVED_BRAND:
            return { ...state, savedPlans: action.payload , showSignIn: false};
        case MEDIA_PLANNING_SHOW_SIGN_IN:
            return { ...state, showSignIn: true};
        case MEDIA_PLANNING_SHOW_CURRENT_STATE:
            return { ...state, showSignIn: action.payload.set};
        default:
            return state;
    }
}

function addReduceQty(locations, locationId, action, totalPrice, quantity) {

    let newTotalPrice = totalPrice;
    return {
        locations: locations.map((location) => {
            if (location.id !== locationId) return location;

            if (action === 'add'){
                newTotalPrice = newTotalPrice + (location.discountedPrice ?
                    (location.discountedPrice.checked ? (location.discountedPrice.value * quantity * location.period) : location.price * quantity * location.period)
                    : location.price * quantity * location.period);
            }else if (action === 'reduce') {
                newTotalPrice = newTotalPrice - (location.discountedPrice ? (location.discountedPrice.checked ? (location.discountedPrice.value * quantity * location.period) : location.price * quantity * location.period) : location.price * quantity * location.period);
            }else if (action === 'none'){
                let abs = location.userAddedQuantity - quantity;
                if (abs < 0){
                    newTotalPrice = newTotalPrice + (location.discountedPrice ?
                        (location.discountedPrice.checked ? (location.discountedPrice.value * (abs * -1) * location.period)
                            : location.price * (abs * -1) * location.period)
                        : location.price * (abs * -1) * location.period)
                }else if (abs > 0){
                    newTotalPrice = newTotalPrice - (location.discountedPrice ?
                        (location.discountedPrice.checked ? (location.discountedPrice.value * (abs) * location.period)
                            : location.price * (abs) * location.period)
                        : location.price * (abs) * location.period)
                }else {
                    newTotalPrice = newTotalPrice - (location.discountedPrice ?
                        (location.discountedPrice.checked ? (location.discountedPrice.value * location.userAddedQuantity * location.period)
                            : location.price * location.userAddedQuantity * location.period)
                        : location.price * location.userAddedQuantity * location.period)
                }
            }

            if (action === 'none'){
                return {
                    ...location,
                    userAddedQuantity: quantity,
                    period: (location.userAddedQuantity === 1 && quantity === 0) ? quantity + 1 : location.period
                }
            }else{
                return {
                    ...location,
                    userAddedQuantity: action === 'add' ? location.userAddedQuantity + quantity : location.userAddedQuantity - 1,
                    period: (location.userAddedQuantity === 1 && action === 'reduce') ? quantity : location.period
                }
            }
        }),
        totalPrice: newTotalPrice
    }
}

function changePeriodFunc(locations, locationId, totalPrice, period) {
    let newTotalPrice = totalPrice;
    return {
        locations_: locations.map(location => {
            if (location.id !== locationId) return location;

            newTotalPrice = newTotalPrice -
                (location.discountedPrice ? (location.discountedPrice.checked ? (location.discountedPrice.value * location.userAddedQuantity * (location.notApplicable ? 1 : location.period)) : location.price * location.userAddedQuantity * (location.notApplicable ? 1 : location.period)) :
                    location.price * location.userAddedQuantity * (location.notApplicable ? 1 : location.period)) +
                (location.discountedPrice ? (location.discountedPrice.checked ? (location.discountedPrice.value * location.userAddedQuantity * (location.notApplicable ? 1 : period)) : location.price * location.userAddedQuantity * (location.notApplicable ? 1 : period)) : location.price * location.userAddedQuantity * (location.notApplicable ? 1 : period));


            return {
                ...location,
                period: period
            }
        }),
        totalPrice_: newTotalPrice
    }
}

function changeNotApplicable(locations, locationId, totalPrice) {
    let newTotalPrice = totalPrice;
    return {
        locs: locations.map(location => {
            if (location.id !== locationId) return location;

            if (!location.notApplicable === true) {
                newTotalPrice = newTotalPrice -
                    (location.discountedPrice ? (location.discountedPrice.checked ? (location.discountedPrice.value * location.userAddedQuantity * (location.notApplicable ? 1 : location.period)) : location.price * location.userAddedQuantity * (location.notApplicable ? 1 : location.period)) :
                        location.price * location.userAddedQuantity * (location.notApplicable ? 1 : location.period)) +
                    (location.discountedPrice ? (location.discountedPrice.checked ? (location.discountedPrice.value * location.userAddedQuantity) : location.price * location.userAddedQuantity ) : location.price * location.userAddedQuantity );
            }
            return {
                ...location,
                notApplicable: !location.notApplicable,
                period: !location.notApplicable === true ? 1 : location.period
            }
        }),
        ttPrice: newTotalPrice
    }
}

function getLocationsWithBestMatch(locations, user, brandingObject) {
    if (!user) user = brandingObject;

    if (!user) return locations;
    if (!user.hasOwnProperty("currentBrand")) return locations;

    if (!user.hasOwnProperty("bestMatch")) return locations;

    let  userBestMatch = user.bestMatch;
    let newLocations = locations.map((location, index) => {
        if (!location.hasOwnProperty("bestMatch")) return { ...location, count: 0 };
        let locationBestMatch = location.bestMatch, count = 0;
        userBestMatch.map(match => {
            count = locationBestMatch.includes(match) ? count + 1 : count;
        });
        return { ...location, count: count}
    });
    newLocations = _.sortBy(newLocations, 'count').reverse();
    return newLocations || locations;
}

function updateLocationsStartEndDate(action, date, location, locations) {
    return locations.map((element) => {
        if (element.userAddedQuantity > 0 && element.id === location.id){
            if (action === 'start')
                return { ...element, startDate: moment(date.toDate()).format("DD/MM/YYYY") };
            else
                return { ...element, endDate: moment(date.toDate()).format("DD/MM/YYYY")}
        }else return element
    })
}

function updateLocationWithFile(file, name, location, locations) {
    return locations.map((element) => {
        if (element.userAddedQuantity > 0 && element.id === location.id){
            return { ...element, adContent: {file, name}}
        }else return element
    })
}

function loadSavedPlanIntoLocations(savedLocations, originalLocations) {
    return originalLocations.map(element => {
        let location = _.findWhere(savedLocations, {id: element.id});
        if (location === undefined)
            return element;
        else {
            return { ...element, userAddedQuantity: location.userAddedQuantity };
        }
    })
}
