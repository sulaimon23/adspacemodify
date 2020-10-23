import {BOOKING_DISPLAY_ERROR, BOOKING_SAVE,
    BOOKING_SAVE_FAILED, BOOKING_SAVE_SUCCESS,
    BOOKING_RESET
} from "../actions/type";


const INITIAL_STATE = {
    loading: false,
    error: false,
    message: '',
    success: false,
    order: undefined
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case BOOKING_DISPLAY_ERROR:
            return { ...state, error: true, message: action.payload, success: false };
        case BOOKING_SAVE:
            return { ...state, loading: true, error: false, message: '', success: false};
        case BOOKING_SAVE_FAILED:
            return { ...state, loading: false, error: true, message: action.payload, success: false };
        case BOOKING_SAVE_SUCCESS:
            return { ...state, loading: false, error: false, message: '' , success: true, order: action.payload};
        case BOOKING_RESET:
            return INITIAL_STATE;
        default:
            return INITIAL_STATE;
    }
}