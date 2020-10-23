import {
    PROFILE_CHANGE_BRAND, PROFILE_DELETE_ACCOUNT, PROFILE_DELETE_ACCOUNT_FAILED, PROFILE_DELETE_ACCOUNT_SUCCESS,
    PROFILE_DISPLAY_MESSAGE,
    PROFILE_FETCH,
    PROFILE_FETCH_FAILED,
    PROFILE_FETCH_ORDERS,
    PROFILE_FETCH_ORDERS_FAILED,
    PROFILE_FETCH_ORDERS_SUCCESS,
    PROFILE_FETCH_SUCCESS,
    PROFILE_NAME_CHANGE,
    PROFILE_SAVE,
    PROFILE_SAVE_FAILED,
    PROFILE_SAVE_SUCCESS, PROFILE_SHOW_CHANGE_PASSWORD_CARD,
    PROFILE_SHOW_EDIT,
    PROFILE_SUBSCRIBE_CHANGE
} from "../actions/type";

const INITIAL_STATE = {
    loading: false,
    error: false,
    message: '',
    isEdit: false,
    displayName: '',
    subscribe: false,
    ordersArray: [],
    ordersLoader: false,
    userInfo: {},
    selectedBrand: 0,
    success: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PROFILE_SHOW_EDIT:
            return { ...state, isEdit: action.payload, subscribe: state.subscribe, ordersArray: state.ordersArray, ordersLoader: state.ordersLoader };
        case PROFILE_NAME_CHANGE:
            return { ...state, displayName: action.payload, success: false };
        case PROFILE_SUBSCRIBE_CHANGE:
            return { ...state, subscribe: action.payload, success: false };
        case PROFILE_FETCH:
            return { ...state, loading: true, success: false };
        case PROFILE_FETCH_FAILED:
            return { ...state, loading: false, error: true, message: action.payload , success: false};
        case PROFILE_FETCH_SUCCESS:
            return { ...state, loading: false, subscribe: action.payload.subscribe || false, userInfo: action.payload,
            selectedBrand: getSelectedBrand(action.payload), success: false};
        case PROFILE_DISPLAY_MESSAGE:
            return { ...state, error: true, message: action.payload, success: false };
        case PROFILE_SAVE:
            return { ...state, loading: true, success: false };
        case PROFILE_SAVE_SUCCESS:
            return { ...INITIAL_STATE, subscribe: state.subscribe, ordersArray: state.ordersArray, ordersLoader: state.ordersLoader,
                userInfo: action.payload ? (action.payload.userInfo ? action.payload.userInfo : state.userInfo) : state.userInfo  ,
                selectedBrand: action.payload ? (action.payload.selectedBrand || 0) : state.selectedBrand, success: true };
        case PROFILE_SAVE_FAILED:
            return { ...state, error: true, message: action.payload, loading: false, success: false };
        case PROFILE_FETCH_ORDERS:
            return { ...state, ordersLoader: true, success: false };
        case PROFILE_FETCH_ORDERS_FAILED:
            return { ...state, ordersLoader: false, error: true, message: action.payload, success: false };
        case PROFILE_FETCH_ORDERS_SUCCESS:
            return { ...state, ordersLoader: false, ordersArray: action.payload, success: false };
        case PROFILE_CHANGE_BRAND:
            return { ...state, selectedBrand: action.payload , success: false};
        case PROFILE_DELETE_ACCOUNT_SUCCESS:
            return { ...INITIAL_STATE };
        case PROFILE_DELETE_ACCOUNT:
            return { ...state, loading: true };
        case PROFILE_DELETE_ACCOUNT_FAILED:
            return { ...state, message: action.payload, loading: false };
        default:
            return state;
    }
}

function getSelectedBrand(userInfo) {
    if (userInfo.hasOwnProperty("brands") && userInfo.hasOwnProperty("currentBrand")){
        let brands = userInfo.brands, currentBrand = userInfo.currentBrand, value;
        if(currentBrand && brands){
            brands.map((brand, index) => {
                if (brand.brandName === currentBrand.brandName) value = index + 1;
            });
            return value
        }else return 0;
    }else return 0;

}
