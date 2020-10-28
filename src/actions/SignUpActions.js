import {SIGNUP_DISPLAY_MESSAGE, SIGNUP_SAVE, SIGNUP_SAVE_FAILED, SIGNUP_SAVE_SUCCESS} from "./type";
import {createUser, getDb, getTimestamp} from "../firebase";


export const displaySignUpMessage =(message) => {
    return { type: SIGNUP_DISPLAY_MESSAGE, payload: message };
} ;

export const signUpUser = (email, fullName, companyName, phoneNumber, password, subscribe) => {
    return async (dispatch) => {
        dispatch({ type: SIGNUP_SAVE });
        try{
            let res = await createUser(email, password);
            if (res.err){
                if (res.err.code === "auth/email-already-in-use")
                    return dispatch({ type: SIGNUP_SAVE_FAILED, payload: "THIS EMAIL IS ALREADY IN USE, PLEASE SIGN IN TO CONTINUE"});
                else if (res.err.code === "auth/weak-password")
                    return dispatch({ type: SIGNUP_SAVE_FAILED, payload: "THE PASSWORD PROVIDED IS WEAK"});
                else
                    return dispatch({ type: SIGNUP_SAVE_FAILED, payload: "Oops Something went wrong, please try again."})
            }
            else {
                let user = res.user;
                let actionCodeSettings = {
                    url: `https://www.adspace.ng/branding`
                };
                await user.user.sendEmailVerification(actionCodeSettings);
                await user.user.updateProfile({
                    displayName: fullName || ''
                });

                let email_ = user.user.email;
                let uuid = user.user.uid;
                let data = {
                    name: fullName ? fullName.trim() : '',
                    displayName: fullName ? fullName.trim() : '',
                    created_at: getTimestamp(),
                    phoneNumber: phoneNumber,
                    companyName: companyName || '',
                    role: 2,
                    uuid: uuid,
                    status: 0,
                    subscribe: subscribe || false,
                    adWallet: {
                        balance: 1000
                    }
                };

                await getDb().collection("users").doc(email_).set(data);
                return dispatch({ type: SIGNUP_SAVE_SUCCESS, payload: {email, password} });
            }
        }
        catch (e) {
            console.log(e);
            if (e.code === "auth/email-already-in-use")
                return dispatch({ type: SIGNUP_SAVE_FAILED, payload: "THIS EMAIL IS ALREADY IN USE, PLEASE SIGN IN TO CONTINUE"});
            else if (e.code === "auth/weak-password")
                return dispatch({ type: SIGNUP_SAVE_FAILED, payload: "THE PASSWORD PROVIDED IS WEAK"});
            else
                return dispatch({ type: SIGNUP_SAVE_FAILED, payload: "Opps Something went wrong, please try again."})
        }
    }
};
