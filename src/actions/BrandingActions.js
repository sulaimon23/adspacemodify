import {
    BRANDING_FETCH,
    BRANDING_FETCH_FAILED,
    BRANDING_FETCH_SUCCESS, BRANDING_SAVE, BRANDING_SAVE_SUCCESS
} from "./type";
import {getAuth, getDb} from "../firebase";


export const getAgeGenderInterests = () => {
    return async (dispatch) => {
        dispatch({ type: BRANDING_FETCH });

        try{
            let ages = [], age = {}, genders = [], gender = {}, interests = [], interest = {};
            let ageSnapshot = await getDb().collection("ages").orderBy("min","asc").get();
            let genderSnapshot = await getDb().collection("genders").orderBy("description","asc").get();
            let interestSnapshot = await getDb().collection("interests").orderBy("description", "asc").get();

            ageSnapshot.forEach(doc => {
                age = doc.data();
                age['id'] = doc.id;
                ages.push(age);
            });
            genderSnapshot.forEach(doc => {
                gender = doc.data();
                gender['id'] = doc.id;
                genders.push(gender);
            });
            interestSnapshot.forEach(doc => {
               interest = doc.data();
               interest['id'] = doc.id;
               interests.push(interest);
            });

            return dispatch({ type: BRANDING_FETCH_SUCCESS, payload: {ages, genders, interests }})
        }
        catch (e) {
            console.log(e);
            return dispatch({ type: BRANDING_FETCH_FAILED, payload: 'OOPS SOMETHING WENT WRONG, PLEASE RELOAD THE PAGE'})
        }
    }
};


export const saveBrands = (brands, branding) => {
    return async (dispatch) => {
        dispatch({ type: BRANDING_SAVE });

        try{
            let user = getAuth().currentUser;
            await getDb().collection("users").doc(user.email).set({isMulti: branding === 'multi', brands: brands}, {merge: true});
            return dispatch({ type: BRANDING_SAVE_SUCCESS })
        }
        catch (e) {
            console.log(e);
            return dispatch({ type: BRANDING_SAVE, payload: 'ERROR SAVING BRANDS'})
        }
    }
};