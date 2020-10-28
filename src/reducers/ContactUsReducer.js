import {CONTACTUS_SAVE, CONTACTUS_SAVE_FAILED, CONTACTUS_SAVE_SUCCESS} from "../actions/type";

const INITIAL_STATE = {
    loading: false,
    error: false,
    message: '',
    success: false
};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CONTACTUS_SAVE:
            return { ...INITIAL_STATE, loading: true };
        case CONTACTUS_SAVE_FAILED:
            return INITIAL_STATE;
        case CONTACTUS_SAVE_SUCCESS:
            return { ...INITIAL_STATE, success: true };
        default:
            return state;
    }
}