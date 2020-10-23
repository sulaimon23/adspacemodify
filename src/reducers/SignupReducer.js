import {SIGNUP_DISPLAY_MESSAGE, SIGNUP_SAVE, SIGNUP_SAVE_FAILED, SIGNUP_SAVE_SUCCESS} from "../actions/type";

const INITIAL_STATE = {
    loading: false,
    error: false,
    message: '',
    success: false,
    email: '',
    password: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SIGNUP_SAVE:
            return { ...INITIAL_STATE, loading: true };
        /*case SIGNUP_SAVE_SUCCESS:
            return { ...INITIAL_STATE, success: true, email: action.payload.email, password: action.payload.password,
            message: "USER ACCOUNT HAS BEEN CREATED, WE HAVE SENT YOU EMAIL, PLEASE CHECK YOUR INBOX TO VERIFY YOUR ACCOUNT"};*/
        case SIGNUP_SAVE_SUCCESS:
            return { ...INITIAL_STATE, success: true,}
        case SIGNUP_DISPLAY_MESSAGE:
            return { ...state, error: true, message: action.payload };
        case SIGNUP_SAVE_FAILED:
            return { ...state, error: true, message: action.payload, loading: false };
        default:
            return state;
    }
}
