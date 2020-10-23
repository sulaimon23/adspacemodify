import {
    LOGIN_DISPLAY_MESSAGE,
    LOGIN_FORGOT_PASSWORD_SAVE,
    LOGIN_FORGOT_PASSWORD_SAVE_FAILED,
    LOGIN_FORGOT_PASSWORD_SAVE_SUCCESS,
    LOGIN_FORGOT_PASSWORD_SHOW,
    LOGIN_SAVE,
    LOGIN_SAVE_FAILED,
    LOGIN_SAVE_SUCCESS,
    LOGIN_SET_AUTHENTICATED,
    LOGOUT,
    LOGOUT_SUCCESS
} from "../actions/type";

const INITIAL_STATE = {
    loading: false,
    error: false,
    message: '',
    isAuthenticated: undefined,
    user: {},
    success: false,
    emailVerified: true,
    showForgotPass: false,
    forgotPasswordEmailSent: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN_SAVE:
            return { ...state, loading: true, error: false, message: '', success: false, emailVerified: true, showForgotPass: false, forgotPasswordEmailSent: false };
        case LOGIN_SAVE_FAILED:
            return { ...state, loading: false, error: true, message: action.payload, success: false, isAuthenticated: false, showForgotPass: false, forgotPasswordEmailSent: false };
        case LOGIN_SAVE_SUCCESS:
            return { ...state, loading: false, error: !action.payload.emailVerified, message: !action.payload.emailVerified ? "THIS EMAIL ACCOUNT IS NOT VERIFIED, PLEASE CLICK VERIFY, AND CHECK YOUR EMAIL INBOX FOR A VERIFICATION EMAIL" : '',
                success: action.payload.emailVerified, isAuthenticated: action.payload.emailVerified,
            user: action.payload.emailVerified ? action.payload : {}, emailVerified: action.payload.emailVerified, showForgotPass: false, forgotPasswordEmailSent: false
            };
        case LOGIN_DISPLAY_MESSAGE:
            return { ...state, loading: false, error: true, message: action.payload, success: false, isAuthenticated: false , forgotPasswordEmailSent: false};
        case LOGIN_SET_AUTHENTICATED:
            return { ...INITIAL_STATE, isAuthenticated: action.payload.set, user: action.payload.user };
        case LOGOUT:
            return state;
        case LOGOUT_SUCCESS:
            return { ...INITIAL_STATE, isAuthenticated: null};
        case LOGIN_FORGOT_PASSWORD_SHOW:
            return { ...INITIAL_STATE, showForgotPass: action.payload, isAuthenticated: null };
        case LOGIN_FORGOT_PASSWORD_SAVE:
            return { ...state, loading: true, forgotPasswordEmailSent: false, error: false, message: '' };
        case LOGIN_FORGOT_PASSWORD_SAVE_FAILED:
            return { ...state, error: true, message: action.payload , forgotPasswordEmailSent: false, loading: false};
        case LOGIN_FORGOT_PASSWORD_SAVE_SUCCESS:
            return { ...INITIAL_STATE, showForgotPass: true, forgotPasswordEmailSent: true , isAuthenticated: null };
        default:
            return state;
    }
}