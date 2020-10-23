import {
    LOGIN_SET_AUTHENTICATED,
    SIGNUP_DISPLAY_MESSAGE,
    SIGNUP_SAVE,
    SIGNUP_SAVE_FAILED,
    SIGNUP_SAVE_SUCCESS
} from "./type";
// import {createUser, getDb, getTimestamp} from "../firebase";
import {createUser, getAuth} from "../firebase";


export const displaySignUpMessage =(message) => {
    return { type: SIGNUP_DISPLAY_MESSAGE, payload: message };
} ;

export const signUpUser = (email, fullName, companyName, phoneNumber, password, subscribe) => async dispatch => {
    try {
      
        getAuth()
        createUser(email, fullName, companyName, phoneNumber, password, subscribe)
        .then(dataBeforeEmail => {
          getAuth().onAuthStateChanged(function(user) {
            user.sendEmailVerification();
            localStorage.setItem('responses', user)
        });
        })
        .then(dataAfterEmail => {
          getAuth().onAuthStateChanged(function(user) {
            
            localStorage.setItem('response', user)
            if (user.emailVerified) {
              // Email is verified
              dispatch({
                type: SIGNUP_SAVE_SUCCESS,
                payload:
                {email, password}
              });
            } else {
              // Email is not verified
              dispatch({
                type: SIGNUP_SAVE_FAILED,
                payload:
                  "Verify email"
              });
            }
          });
        })
        .catch(function(error) {
          dispatch({
            type: SIGNUP_SAVE_FAILED,
            payload:
              "Something went wrong, we couldn't create your account. Please try again."
          });
        });
    } catch (err) {
      dispatch({
        type: SIGNUP_SAVE_FAILED,
        payload:
          "Something went wrong, we couldn't create your account. Please try again."
      });
    }
  };


  
// export const signUpUser = (email, fullName, companyName, phoneNumber, password, subscribe) =>  async dispatch => {
//         dispatch({ type: SIGNUP_SAVE }); 
        
//             let res = await createUser(email, password);
//             localStorage.setItem('response', res.err.code)
//             if (res.err){
//                 if (res.err.code === "auth/email-already-in-use")
//                     return dispatch({ type: SIGNUP_SAVE_FAILED, payload: "THIS EMAIL IS ALREADY IN USE, PLEASE SIGN IN TO CONTINUE"});
//                 else if (res.err.code === "auth/weak-password")
//                     return dispatch({ type: SIGNUP_SAVE_FAILED, payload: "THE PASSWORD PROVIDED IS WEAK"});
//                 else
//                     return dispatch({ type: SIGNUP_SAVE_FAILED, payload: "Oops Something went wrong, please try again."})
//             }
//             else {
//                 let user = res.user;
//                 let actionCodeSettings = {
//                     url: `https://www.adspace.ng/`
//                 };
//                 await user.user.sendEmailVerification(actionCodeSettings);
//                 await user.user.updateProfile({
//                     displayName: fullName || ''
//                 });

//                 let email_ = user.user.email;
//                 let uuid = user.user.uid;
//                 let data = {
//                     name: fullName ? fullName.trim() : '',
//                     displayName: fullName ? fullName.trim() : '',
//                     created_at: getTimestamp(),
//                     phoneNumber: phoneNumber,
//                     companyName: companyName || '',
//                     role: 2,
//                     uuid: uuid,
//                     status: 0,
//                     subscribe: subscribe || false,
//                     adWallet: {
//                         balance: 1000
//                     }
//                 };

//                 await getDb().collection("users").doc(email_).set(data);
//                 dispatch({ type: LOGIN_SET_AUTHENTICATED, payload: {set: true, user}})
//                 return dispatch({ type: SIGNUP_SAVE_SUCCESS, payload: {email, password} });
//             }
        // catch (e) {
        //     console.log(e);
        //     if (e.code === "auth/email-already-in-use")
        //         return dispatch({ type: SIGNUP_SAVE_FAILED, payload: "THIS EMAIL IS ALREADY IN USE, PLEASE SIGN IN TO CONTINUE"});
        //     else if (e.code === "auth/weak-password")
        //         return dispatch({ type: SIGNUP_SAVE_FAILED, payload: "THE PASSWORD PROVIDED IS WEAK"});
        //     else
        //         return dispatch({ type: SIGNUP_SAVE_FAILED, payload: "Opps Something went wrong, please try again."})
        // }
// };