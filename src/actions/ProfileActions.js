import {
    MEDIA_PLANNING_REMOVED_BRAND,
    PROFILE_CHANGE_BRAND,
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
    PROFILE_SAVE_SUCCESS,
    PROFILE_SHOW_EDIT,
    PROFILE_SUBSCRIBE_CHANGE, PROFILE_UPDATE_LOCATIONS_USER,
    PROFILE_UPDATE_MEDIAPLANNING_USER,
    PROFILE_DELETE_ACCOUNT, PROFILE_DELETE_ACCOUNT_FAILED,
    PROFILE_DELETE_ACCOUNT_SUCCESS, LOGOUT
} from "./type";
import {firebaseObject, getAuth, getDb} from "../firebase";


export const editProfile = (show) => {
    return { type: PROFILE_SHOW_EDIT, payload: show };
};

export const profileNameChange = (name) => {
    return { type: PROFILE_NAME_CHANGE, payload: name }
};

export const profileSubscribeChange = (subscribe) => {
      return { type: PROFILE_SUBSCRIBE_CHANGE, payload: subscribe };
};

export const getUser = (email) => {
      return async (dispatch) => {
          dispatch({ type: PROFILE_FETCH });
          try{
              let userRef = await getDb().collection("users").doc(email).get();
              let user = userRef.data();
              user["id"]  = userRef.id;
              return dispatch({ type: PROFILE_FETCH_SUCCESS, payload: user });
          }
          catch (e) {
              console.log(e);
              return dispatch({ type: PROFILE_FETCH_FAILED, payload: "OOPS SOMETHING WENT WRONG!"})
          }
      }
};


export const displayProfileMessage = (message) => {
    return { type: PROFILE_DISPLAY_MESSAGE, payload: message };
};

export const saveProfile = (user, displayName, subscribe, userInfo) => {
    return async (dispatch) => {
        dispatch({ type: PROFILE_SAVE });
        try{
            await getDb().collection("users").doc(user.email).set({ name: displayName, displayName, subscribe }, { merge: true});
            await user.updateProfile({ displayName: displayName || ''});
            return dispatch({ type: PROFILE_SAVE_SUCCESS, payload: {userInfo: userInfo || undefined} });
        }
        catch (e) {
            console.log(e);
            return dispatch({ type: PROFILE_SAVE_FAILED, payload: "OOPS FAILED TO SAVE PROFILE"});
        }
    }
};

export const getUserOrders = (email) => {
    return async (dispatch) => {
        dispatch({ type: PROFILE_FETCH_ORDERS });
        try{
            let orders = [], order = {};
            let ordersSnapshot = await getDb().collection("orders").where("user.email","==",email)
                .orderBy("created_at","desc").limit(10).get();
            ordersSnapshot.forEach(doc => {
                order = doc.data();
                order["id"]  = doc.id;
                orders.push(order);
            });

            return dispatch({ type: PROFILE_FETCH_ORDERS_SUCCESS, payload: orders });
        }
        catch (e) {
            console.log(e);
            return dispatch({ type: PROFILE_FETCH_ORDERS_FAILED, payload: "OOPS FAILED TO LOAD ORDERS" });
        }
    }
};

export const saveBrandsProfile = (brands_, userInfo, selectedBrand = 0) => {
    return async (dispatch) => {
        dispatch({ type: PROFILE_SAVE });
        try{
            selectedBrand = selectedBrand - 1;
            //if (!userInfo.hasOwnProperty("brands")) return dispatch({ type: PROFILE_SAVE_FAILED, payload: "OOPS FAILED TO SAVE PROFILE"});
            let brands = userInfo.brands || [];
            let user = getAuth().currentUser;

            brands_.map(brand => {
                if (brand.gender !== undefined)
                    brands.push(brand);
            });

            let currentBrand;
            if (selectedBrand !== -1)
                currentBrand = brands[selectedBrand];

            userInfo.brands = brands;
            userInfo.currentBrand = currentBrand;

            let bestMatchArray = [];
            if (currentBrand){
                if (currentBrand.ages){
                    currentBrand.ages.map(age => {
                        if (age.id) bestMatchArray.push(age.id);
                    })
                }
                if (currentBrand.gender){
                    if (currentBrand.gender.id) bestMatchArray.push(currentBrand.gender.id);
                }
                if (currentBrand.interests){
                    currentBrand.interests.map(interest => {
                        if (interest.id) bestMatchArray.push(interest.id);
                    })
                }
                let data = {
                    brands: brands,
                    currentBrand: currentBrand,
                    bestMatch: bestMatchArray || []
                };
                await getDb().collection("users").doc(user.email).set(data, {merge: true});
            }else {
                if (selectedBrand === -1 && (brands_[0].gender !== undefined || brands_[0].brandName !== '' )){
                    await getDb().collection("users").doc(user.email).set({brands: brands}, {merge: true});
                }else{
                    await getDb().collection("users").doc(user.email).update({
                        currentBrand: firebaseObject().firestore.FieldValue.delete(),
                        bestMatch: firebaseObject().firestore.FieldValue.delete()
                    })
                }
            }

            dispatch({ type: PROFILE_UPDATE_LOCATIONS_USER, payload: userInfo });
            dispatch({ type: PROFILE_UPDATE_MEDIAPLANNING_USER, payload: userInfo });
            return dispatch({ type: PROFILE_SAVE_SUCCESS, payload: {userInfo, selectedBrand: selectedBrand + 1} });
        }
        catch (e) {
            console.log(e);
            return dispatch({ type: PROFILE_SAVE_FAILED, payload: "OOPS FAILED TO SAVE PROFILE"});
        }
    }
};

export const changeSelectedBrand = (index) => {
    return { type: PROFILE_CHANGE_BRAND, payload: index}
};

export const removeBrand = (index, selectedBrand, userInfo) => {

    return async (dispatch) => {
        dispatch({type: PROFILE_SAVE});
        try{
            selectedBrand = selectedBrand - 1;
            index = index - 1;

            if (userInfo.brands){
                let brands = userInfo.brands;
                let brandName = brands[index] ? brands[index].brandName || '' : '';

                brands.splice(index, 1);

                let savedPlans = userInfo.savedPlans || [];
                let ind = -1;
                savedPlans.map((plan, index) => {
                    if (plan.brandName === brandName){
                        ind = index;
                    }
                });

                if (ind !== -1)
                    savedPlans.splice(ind, 1);

                let data = {
                    brands: brands,
                    savedPlans: savedPlans
                };
                if (index === selectedBrand){
                    data.currentBrand = [];
                    data.bestMatch = [];
                }
                await getDb().collection("users").doc(userInfo.id).set(data, {merge: true});

                selectedBrand = selectedBrand + 1;
                index = index + 1;

                dispatch({ type: PROFILE_SAVE_SUCCESS, payload: {userInfo, selectedBrand: index === selectedBrand ? 0 : selectedBrand} });

                return dispatch({ type: MEDIA_PLANNING_REMOVED_BRAND, payload: savedPlans });
            }
        }
        catch (e) {
            console.log(e);
            return dispatch({ type: PROFILE_SAVE_FAILED, payload: "OOPS FAILED TO SAVE PROFILE"});
        }
    }
};

export const deleteAccount = (email, password) => {
    return async (dispatch) => {
        dispatch({ type: PROFILE_DELETE_ACCOUNT });
        try{
            //sigin in first

            await getAuth().signInWithEmailAndPassword(email, password);

            let user = getAuth().currentUser;
            let email_ = user.email;

            let res = await getDb().collection("users").doc(email_).delete();

            await user.delete();
            dispatch({ type: LOGOUT });
            return dispatch({ type: PROFILE_DELETE_ACCOUNT_SUCCESS })
        }
        catch (e) {
            console.log(e);
            if (e.code === 'auth/wrong-password')
                return dispatch({ type: PROFILE_DELETE_ACCOUNT_FAILED, payload: 'PASSWORD OR EMAIL IS INVALID' });
            else return dispatch({ type: PROFILE_DELETE_ACCOUNT_FAILED, payload: 'Failed to Delete Your account, try again later' });
        }
    }
};
