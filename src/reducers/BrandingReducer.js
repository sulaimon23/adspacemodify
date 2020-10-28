import {
    BRANDING_FETCH_FAILED,
    BRANDING_FETCH,
    BRANDING_FETCH_SUCCESS, BRANDING_SAVE, BRANDING_SAVE_FAILED, BRANDING_SAVE_SUCCESS
} from "../actions/type";

const INITIAL_STATE = {
    loading: false,
    error: false,
    message: '',
    agesArray: [],
    gendersArray: [],
    interestsArray: [],
    success: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case BRANDING_FETCH:
            return { ...state, loading: true, error: false, message: '', success: false };
        case BRANDING_FETCH_FAILED:
            return { ...state, loading: false, error: true, message: action.payload, success: false };
        case BRANDING_FETCH_SUCCESS:
            return { ...state, loading: false, error: false, message: '', agesArray: action.payload.ages || [],
                gendersArray: action.payload.genders || [], interestsArray: action.payload.interests || [], success: false};
        case BRANDING_SAVE:
            return { ...state, success: false, loading: true, error: false, message: ''};
        case BRANDING_SAVE_FAILED:
            return { ...state, success: false, loading: false, error: true, message: action.payload };
        case BRANDING_SAVE_SUCCESS:
            return { ...INITIAL_STATE, success: true };
        default:
            return state;
    }
}