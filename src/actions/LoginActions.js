import {
    LOGIN_SAVE_FAILED,
    LOGIN_SAVE_SUCCESS,
    LOGIN_SAVE,
    LOGIN_DISPLAY_MESSAGE,
    LOGIN_SET_AUTHENTICATED,
    LOGOUT,
    LOGOUT_SUCCESS,
    LOGIN_FORGOT_PASSWORD_SHOW,
    LOGIN_FORGOT_PASSWORD_SAVE_FAILED,
    LOGIN_FORGOT_PASSWORD_SAVE, LOGIN_FORGOT_PASSWORD_SAVE_SUCCESS
} from "./type";
import {getAuth, getDb, userLogin, userLogout} from "../firebase";

export const displayLoginMessage = (message) => {
    return { type: LOGIN_DISPLAY_MESSAGE, payload: message };
};

export const loginUser = (email, password) => {
    return async (dispatch) => {
        dispatch({ type: LOGIN_SAVE });
        try{
            let res = await userLogin(email, password);
            if (res.err)
                return dispatch({ type: LOGIN_SAVE_FAILED, payload: res.err.message || "Error Login"});
            else {

                let email = res.user.user.email;
                let userRef = await getDb().collection("users").doc(email).get();
                let user = userRef.data();
                user.id = userRef.id;
                user.emailVerified = res.user.user.emailVerified;
                if (user.role !== 2){
                    return dispatch({ type: LOGIN_SAVE_FAILED, payload: "ERROR: THIS ACCOUNT IS NOT ALLOWED TO LOGIN" });
                }else{
                    if (user.status === 0)
                        return dispatch({ type: LOGIN_SAVE_SUCCESS, payload: user });
                    else
                        return dispatch({ type: LOGIN_SAVE_FAILED, payload: "ERROR: USER IS NOT ACTIVE, MAYBE DISABLED" });
                }
            }
        }
        catch (e) {
            console.log(e);
            return dispatch({ type: LOGIN_SAVE_FAILED, payload: e.message || "ERROR: LOG IN USER"})
        }
    }
};

export const setAuthenticated = (set, user) => {
    return { type:LOGIN_SET_AUTHENTICATED, payload: {set, user} };
};

export const logOut = () => {
    return async (dispatch) => {
        dispatch({ type: LOGOUT });
        try{
            await userLogout();
            return dispatch({ type: LOGOUT_SUCCESS });
        }
        catch (e) {
            console.log(e);
            return dispatch({ type: LOGOUT });
        }
    }
};

export const sendVerificationEmail = () => {
    return async (dispatch) => {
        dispatch({type: LOGIN_SAVE});
        try {
            let actionCodeSettings = {
                url: `https://www.adspace.ng/branding`
            };
            let user = getAuth().currentUser;
            await user.sendEmailVerification(actionCodeSettings);
            return dispatch({type: LOGIN_DISPLAY_MESSAGE, payload: "VERIFICATION EMAIL HAS BEEN SENT TO YOUR INBOX"})
        } catch (e) {
            console.log(e);
            return dispatch({type: LOGIN_SAVE_FAILED, payload: e.message || "ERROR: SENDING VERIFICATION EMAIL"})
        }
    }
};

export const showForgotPassword = (show) => {
    return { type: LOGIN_FORGOT_PASSWORD_SHOW, payload: show }
};

export const sendForgotPassword = (email) => {
    return async (dispatch) => {
        dispatch({ type: LOGIN_FORGOT_PASSWORD_SAVE });
        try {
            await getAuth().sendPasswordResetEmail(email);
            return dispatch({ type: LOGIN_FORGOT_PASSWORD_SAVE_SUCCESS });
        }
        catch (e) {
            console.log(e);
            return dispatch({ LOGIN_FORGOT_PASSWORD_SAVE_FAILED , payload: "FAILED TO SEND EMAIL, PLEASE TRY AGAIN LATER"})
        }
    }
};
