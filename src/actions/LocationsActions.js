import {
    LOCATIONS_FETCH_SUCCESS,
    LOCATIONS_FETCH_FAILED,
    LOCATIONS_FETCH, LOCATIONS_SUBCATS_FETCH,
    LOCATIONS_SUBCATS_FETCH_FAILED, LOCATIONS_SUBCATS_FETCH_SUCCESS, LOCATIONS_SORT, LOCATIONS_GET_MORE, LOCATIONS_FILTER_BY_SUBCATEGORY
} from "./type";
import {getAuth, getDb, getDocumentId} from "../firebase";
import moment from "moment";
import { pageSize } from '../config';
import _ from 'underscore';


function isStartDateValid(startDate, dates = []){
    let res = [];
    if (dates && dates.length > 0) {
        dates.map((date) => {
            if (startDate >= date.start.seconds && startDate <= date.end.seconds) {
                res.push(1);
            }
        })
    }
    return res || [];
}

/*export const getLocations = (query = {}, getMore, lastItem, currentLocations) => {
    return async (dispatch) => {
        dispatch({ type: LOCATIONS_FETCH });
        let state = query.state || '', city = query.city || '', category = query.category || '', locSnapshot, startDate = query.startDate || '', timestamp,
            tags = query.tags || [], subCategory = query.subCategory || '', last = lastItem;
        state = state.trim(); city = city.trim(); category = category.trim(); startDate = startDate.trim();
        if (startDate.length > 0)
            timestamp = moment(startDate.replace("-","/")).unix();
        try{
            let location = {}, locations = [];
            if (state === '' && city === '' && category === ''){
                if (getMore)
                    locSnapshot = await getDb().collection("locations").where("status" , "==", 0).orderBy(getDocumentId()).startAfter(last).limit(pageSize).get();
                else
                    locSnapshot = await getDb().collection("locations").where("status" , "==", 0).orderBy(getDocumentId()).limit(pageSize).get();
                locSnapshot.forEach(doc => {
                   location = doc.data();
                   location["id"] = doc.id;
                   if (timestamp){
                       if (isStartDateValid(timestamp, location.unavailableDates).length === 0){
                           if (tags && tags.length > 0){
                               let isFounded = location.tags.some( tag => tags.includes(tag));
                               if (isFounded)
                                   locations.push(location);
                           }else {
                               locations.push(location);
                           }
                       }
                   }else{
                       if (tags && tags.length > 0){
                           let isFounded = location.tags.some( tag => tags.includes(tag));
                           if (isFounded)
                               locations.push(location);
                       }else {
                           locations.push(location);
                       }
                   }
                });
                let lastItem = locSnapshot.docs[locSnapshot.docs.length - 1];
                return dispatch({ type: LOCATIONS_FETCH_SUCCESS, payload: {locations: getMore ? [ ...currentLocations, ...locations] : locations, query, lastItem}})
            }
            if (state.length > 0 && city.length > 0 && category.length > 0){
                if (getMore){
                    locSnapshot = await getDb().collection("locations")
                        .where("state.id","==", state)
                        .where("city.id","==", city)
                        .where("category.id","==", category)
                        .where("status" , "==", 0).orderBy("created_at", "desc").startAfter(last).limit(pageSize).get();
                }else{
                    locSnapshot = await getDb().collection("locations")
                        .where("state.id","==", state)
                        .where("city.id","==", city)
                        .where("category.id","==", category)
                        .where("status" , "==", 0).orderBy("created_at", "desc").limit(pageSize).get();
                }
                locSnapshot.forEach(doc => {
                    location = doc.data();
                    location["id"] = doc.id;
                    if (timestamp){
                        if (isStartDateValid(timestamp, location.unavailableDates).length === 0){
                            if (tags && tags.length > 0){
                                let isFounded = location.tags.some( tag => tags.includes(tag));
                                if (isFounded)
                                    locations.push(location);
                            }else {
                                locations.push(location);
                            }
                        }
                    }else{
                        if (tags && tags.length > 0){
                            let isFounded = location.tags.some( tag => tags.includes(tag));
                            if (isFounded)
                                locations.push(location);
                        }else {
                            locations.push(location);
                        }
                    }
                });
                let lastItem = locSnapshot.docs[locSnapshot.docs.length - 1];
                return dispatch({ type: LOCATIONS_FETCH_SUCCESS, payload: {locations: getMore ? [ ...currentLocations, ...locations] : locations, query, lastItem}})
            }
            if (state.length > 0 && city.length > 0){
                if (getMore){
                    locSnapshot = await getDb().collection("locations")
                        .where("state.id","==", state)
                        .where("city.id","==", city)
                        .where("status" , "==", 0).orderBy("created_at", "desc").startAfter(last).limit(pageSize).get();
                }else{
                    locSnapshot = await getDb().collection("locations")
                        .where("state.id","==", state)
                        .where("city.id","==", city)
                        .where("status" , "==", 0).orderBy("created_at", "desc").limit(pageSize).get();
                }
                locSnapshot.forEach(doc => {
                    location = doc.data();
                    location["id"] = doc.id;
                    if (timestamp){
                        if (isStartDateValid(timestamp, location.unavailableDates).length === 0){
                            if (tags && tags.length > 0){
                                let isFounded = location.tags.some( tag => tags.includes(tag));
                                if (isFounded)
                                    locations.push(location);
                            }else {
                                locations.push(location);
                            }
                        }
                    }else{
                        if (tags && tags.length > 0){
                            let isFounded = location.tags.some( tag => tags.includes(tag));
                            if (isFounded)
                                locations.push(location);
                        }else {
                            locations.push(location);
                        }
                    }
                });
                let lastItem = locSnapshot.docs[locSnapshot.docs.length - 1];
                return dispatch({ type: LOCATIONS_FETCH_SUCCESS, payload: {locations: getMore ? [ ...currentLocations, ...locations] : locations, query, lastItem}})
            }
            if (state.length > 0 && category.length > 0){
                if (getMore){
                    locSnapshot = await getDb().collection("locations")
                        .where("state.id","==", state)
                        .where("category.id","==", category)
                        .where("status" , "==", 0).orderBy("created_at", "desc").startAfter(last).limit(pageSize).get();
                }else {
                    locSnapshot = await getDb().collection("locations")
                        .where("state.id","==", state)
                        .where("category.id","==", category)
                        .where("status" , "==", 0).orderBy("created_at", "desc").limit(pageSize).get();
                }
                locSnapshot.forEach(doc => {
                    location = doc.data();
                    location["id"] = doc.id;
                    if (timestamp){
                        if (isStartDateValid(timestamp, location.unavailableDates).length === 0){
                            if (tags && tags.length > 0){
                                let isFounded = location.tags.some( tag => tags.includes(tag));
                                if (isFounded)
                                    locations.push(location);
                            }else {
                                locations.push(location);
                            }
                        }
                    }else{
                        if (tags && tags.length > 0){
                            let isFounded = location.tags.some( tag => tags.includes(tag));
                            if (isFounded)
                                locations.push(location);
                        }else {
                            locations.push(location);
                        }
                    }
                });
                let lastItem = locSnapshot.docs[locSnapshot.docs.length - 1];
                return dispatch({ type: LOCATIONS_FETCH_SUCCESS, payload: {locations: getMore ? [ ...currentLocations, ...locations] : locations, query, lastItem}})
            }
            if (state.length > 0){
                if (getMore){
                    locSnapshot = await getDb().collection("locations")
                        .where("state.id","==", state)
                        .where("status" , "==", 0).orderBy("created_at", "desc").startAfter(last).limit(pageSize).get();
                }else{
                    locSnapshot = await getDb().collection("locations")
                        .where("state.id","==", state)
                        .where("status" , "==", 0).orderBy("created_at", "desc").limit(pageSize).get();
                }
                locSnapshot.forEach(doc => {
                    location = doc.data();
                    location["id"] = doc.id;
                    if (timestamp){
                        if (isStartDateValid(timestamp, location.unavailableDates).length === 0){
                            if (tags && tags.length > 0){
                                let isFounded = location.tags.some( tag => tags.includes(tag));
                                if (isFounded)
                                    locations.push(location);
                            }else {
                                locations.push(location);
                            }
                        }
                    }else{
                        if (tags && tags.length > 0){
                            let isFounded = location.tags.some( tag => tags.includes(tag));
                            if (isFounded)
                                locations.push(location);
                        }else {
                            locations.push(location);
                        }
                    }
                });
                let lastItem = locSnapshot.docs[locSnapshot.docs.length - 1];
                return dispatch({ type: LOCATIONS_FETCH_SUCCESS, payload: {locations: getMore ? [ ...currentLocations, ...locations] : locations, query, lastItem}})
            }
            if (city.length > 0 && category.length > 0){
                if (getMore){
                    locSnapshot = await getDb().collection("locations")
                        .where("city.id","==", city)
                        .where("category.id","==", category)
                        .where("status" , "==", 0).orderBy("created_at", "desc").startAfter(last).limit(pageSize).get();
                }else{
                    locSnapshot = await getDb().collection("locations")
                        .where("city.id","==", city)
                        .where("category.id","==", category)
                        .where("status" , "==", 0).orderBy("created_at", "desc").limit(pageSize).get();
                }
                locSnapshot.forEach(doc => {
                    location = doc.data();
                    location["id"] = doc.id;
                    if (timestamp){
                        if (isStartDateValid(timestamp, location.unavailableDates).length === 0){
                            if (tags && tags.length > 0){
                                let isFounded = location.tags.some( tag => tags.includes(tag));
                                if (isFounded)
                                    locations.push(location);
                            }else {
                                locations.push(location);
                            }
                        }
                    }else{
                        if (tags && tags.length > 0){
                            let isFounded = location.tags.some( tag => tags.includes(tag));
                            if (isFounded)
                                locations.push(location);
                        }else {
                            locations.push(location);
                        }
                    }
                });
                let lastItem = locSnapshot.docs[locSnapshot.docs.length - 1];
                return dispatch({ type: LOCATIONS_FETCH_SUCCESS, payload: {locations: getMore ? [ ...currentLocations, ...locations] : locations, query, lastItem}})
            }
            if (city.length > 0){
                if (getMore){
                    locSnapshot = await getDb().collection("locations")
                        .where("city.id","==", city)
                        .where("status" , "==", 0).orderBy("created_at", "desc").startAfter(last).limit(pageSize).get();
                }else{
                    locSnapshot = await getDb().collection("locations")
                        .where("city.id","==", city)
                        .where("status" , "==", 0).orderBy("created_at", "desc").limit(pageSize).get();
                }
                locSnapshot.forEach(doc => {
                    location = doc.data();
                    location["id"] = doc.id;
                    if (timestamp){
                        if (isStartDateValid(timestamp, location.unavailableDates).length === 0){
                            if (tags && tags.length > 0){
                                let isFounded = location.tags.some( tag => tags.includes(tag));
                                if (isFounded)
                                    locations.push(location);
                            }else {
                                locations.push(location);
                            }
                        }
                    }else{
                        if (tags && tags.length > 0){
                            let isFounded = location.tags.some( tag => tags.includes(tag));
                            if (isFounded)
                                locations.push(location);
                        }else {
                            locations.push(location);
                        }
                    }
                });
                let lastItem = locSnapshot.docs[locSnapshot.docs.length - 1];
                return dispatch({ type: LOCATIONS_FETCH_SUCCESS, payload: {locations: getMore ? [ ...currentLocations, ...locations] : locations, query, lastItem}})
            }
            if (category.length > 0){
                if (getMore){
                    locSnapshot = await getDb().collection("locations")
                        .where("category.id","==", category)
                        .where("status" , "==", 0).orderBy("created_at", "desc").startAfter(last).limit(pageSize).get();
                }else{
                    locSnapshot = await getDb().collection("locations")
                        .where("category.id","==", category)
                        .where("status" , "==", 0).orderBy("created_at", "desc").limit(pageSize).get();
                }
                locSnapshot.forEach(doc => {
                    location = doc.data();
                    location["id"] = doc.id;
                    if (timestamp){
                        if (isStartDateValid(timestamp, location.unavailableDates).length === 0){
                            if (tags && tags.length > 0){
                                let isFounded = location.tags.some( tag => tags.includes(tag));
                                if (isFounded)
                                    locations.push(location);
                            }else {
                                locations.push(location);
                            }
                        }
                    }else{
                        if (tags && tags.length > 0){
                            let isFounded = location.tags.some( tag => tags.includes(tag));
                            if (isFounded)
                                locations.push(location);
                        }else {
                            locations.push(location);
                        }
                    }
                });
                let lastItem = locSnapshot.docs[locSnapshot.docs.length - 1];
                return dispatch({ type: LOCATIONS_FETCH_SUCCESS, payload: {locations: getMore ? [ ...currentLocations, ...locations] : locations, query, lastItem}})
            }
        }
        catch (e) {
            console.log(e);
            return dispatch({ type: LOCATIONS_FETCH_FAILED });
        }
    }
};*/

export const getLocations = (query = {}, getMore, lastItem, currentLocations, user, userInfo) => {
    return async (dispatch) => {
        dispatch({ type: LOCATIONS_FETCH });
        let state = query.state || '', city = query.city || '', category = query.category || '', locSnapshot, startDate = query.startDate || '', timestamp,
            tags = query.tags || [], subCategory = query.subCategory || '', last = lastItem, user_;

        state = state.trim(); city = city.trim(); category = category.trim(); startDate = startDate.trim();
        if (startDate.length > 0)
            timestamp = moment(startDate.replace("-","/")).unix();

        try{
            if ((!userInfo || _.isEmpty(userInfo)) && user){
                let userSnapshot = await getDb().collection("users").doc(user.email).get();
                user_ = userSnapshot.data();
                user_['id'] = userSnapshot.id;
            }else {
                user_ = userInfo
            }

            let location = {}, locations = [];
            if (state === '' && city === '' && category === ''){
                locSnapshot = await getDb().collection("locations").where("status" , "==", 0).orderBy(getDocumentId()).get();

                locSnapshot.forEach(doc => {
                    location = doc.data();
                    location["id"] = doc.id;
                    if (timestamp){
                        if (isStartDateValid(timestamp, location.unavailableDates).length === 0){
                            if (tags && tags.length > 0){
                                let isFounded = location.tags.some( tag => tags.includes(tag));
                                if (isFounded)
                                    locations.push(location);
                            }else {
                                locations.push(location);
                            }
                        }
                    }else{
                        if (tags && tags.length > 0){
                            let isFounded = location.tags.some( tag => tags.includes(tag));
                            if (isFounded)
                                locations.push(location);
                        }else {
                            locations.push(location);
                        }
                    }
                });
                let lastItem = locSnapshot.docs[locSnapshot.docs.length - 1];
                return dispatch({ type: LOCATIONS_FETCH_SUCCESS, payload: {locations: getMore ? [ ...currentLocations, ...locations] : locations, query, lastItem, user: user_}})
            }

            if (state.length > 0 && city.length > 0 && category.length > 0){
                locSnapshot = await getDb().collection("locations")
                    .where("state.id","in", [state, "nationwide"])
                    .where("city.id","==", city)
                    .where("category.id","==", category)
                    .where("status" , "==", 0).orderBy(getDocumentId()).get();

                locSnapshot.forEach(doc => {
                    location = doc.data();
                    location["id"] = doc.id;
                    if (timestamp){
                        if (isStartDateValid(timestamp, location.unavailableDates).length === 0){
                            if (tags && tags.length > 0){
                                let isFounded = location.tags.some( tag => tags.includes(tag));
                                if (isFounded)
                                    locations.push(location);
                            }else {
                                locations.push(location);
                            }
                        }
                    }else{
                        if (tags && tags.length > 0){
                            let isFounded = location.tags.some( tag => tags.includes(tag));
                            if (isFounded)
                                locations.push(location);
                        }else {
                            locations.push(location);
                        }
                    }
                });
                let lastItem = locSnapshot.docs[locSnapshot.docs.length - 1];
                return dispatch({ type: LOCATIONS_FETCH_SUCCESS, payload: {locations: getMore ? [ ...currentLocations, ...locations] : locations, query, lastItem, user: user_}})
            }

            if (state.length > 0 && city.length > 0){
                locSnapshot = await getDb().collection("locations")
                    .where("state.id","in", [state, "nationwide"])
                    .where("city.id","==", city)
                    .where("status" , "==", 0).orderBy(getDocumentId()).get();
                locSnapshot.forEach(doc => {
                    location = doc.data();
                    location["id"] = doc.id;
                    if (timestamp){
                        if (isStartDateValid(timestamp, location.unavailableDates).length === 0){
                            if (tags && tags.length > 0){
                                let isFounded = location.tags.some( tag => tags.includes(tag));
                                if (isFounded)
                                    locations.push(location);
                            }else {
                                locations.push(location);
                            }
                        }
                    }else{
                        if (tags && tags.length > 0){
                            let isFounded = location.tags.some( tag => tags.includes(tag));
                            if (isFounded)
                                locations.push(location);
                        }else {
                            locations.push(location);
                        }
                    }
                });
                let lastItem = locSnapshot.docs[locSnapshot.docs.length - 1];
                return dispatch({ type: LOCATIONS_FETCH_SUCCESS, payload: {locations: getMore ? [ ...currentLocations, ...locations] : locations, query, lastItem, user: user_}})
            }

            if (state.length > 0 && category.length > 0){
                locSnapshot = await getDb().collection("locations")
                    .where("state.id","in", [state, "nationwide"])
                    .where("category.id","==", category)
                    .where("status" , "==", 0).orderBy(getDocumentId()).get();

                locSnapshot.forEach(doc => {
                    location = doc.data();
                    location["id"] = doc.id;
                    if (timestamp){
                        if (isStartDateValid(timestamp, location.unavailableDates).length === 0){
                            if (tags && tags.length > 0){
                                let isFounded = location.tags.some( tag => tags.includes(tag));
                                if (isFounded)
                                    locations.push(location);
                            }else {
                                locations.push(location);
                            }
                        }
                    }else{
                        if (tags && tags.length > 0){
                            let isFounded = location.tags.some( tag => tags.includes(tag));
                            if (isFounded)
                                locations.push(location);
                        }else {
                            locations.push(location);
                        }
                    }
                });
                let lastItem = locSnapshot.docs[locSnapshot.docs.length - 1];
                return dispatch({ type: LOCATIONS_FETCH_SUCCESS, payload: {locations: getMore ? [ ...currentLocations, ...locations] : locations, query, lastItem, user: user_}})
            }

            if (state.length > 0){

                locSnapshot = await getDb().collection("locations")
                    .where("state.id","in", [state, "nationwide"])
                    .where("status" , "==", 0).orderBy(getDocumentId()).get();

                locSnapshot.forEach(doc => {
                    location = doc.data();
                    location["id"] = doc.id;
                    if (timestamp){
                        if (isStartDateValid(timestamp, location.unavailableDates).length === 0){
                            if (tags && tags.length > 0){
                                let isFounded = location.tags.some( tag => tags.includes(tag));
                                if (isFounded)
                                    locations.push(location);
                            }else {
                                locations.push(location);
                            }
                        }
                    }else{
                        if (tags && tags.length > 0){
                            let isFounded = location.tags.some( tag => tags.includes(tag));
                            if (isFounded)
                                locations.push(location);
                        }else {
                            locations.push(location);
                        }
                    }
                });
                let lastItem = locSnapshot.docs[locSnapshot.docs.length - 1];
                return dispatch({ type: LOCATIONS_FETCH_SUCCESS, payload: {locations: getMore ? [ ...currentLocations, ...locations] : locations, query, lastItem, user: user_}})
            }

            if (city.length > 0 && category.length > 0){
                locSnapshot = await getDb().collection("locations")
                    .where("city.id","in", [city, "nationwide"])
                    .where("category.id","==", category)
                    .where("status" , "==", 0).orderBy(getDocumentId()).get();

                locSnapshot.forEach(doc => {
                    location = doc.data();
                    location["id"] = doc.id;
                    if (timestamp){
                        if (isStartDateValid(timestamp, location.unavailableDates).length === 0){
                            if (tags && tags.length > 0){
                                let isFounded = location.tags.some( tag => tags.includes(tag));
                                if (isFounded)
                                    locations.push(location);
                            }else {
                                locations.push(location);
                            }
                        }
                    }else{
                        if (tags && tags.length > 0){
                            let isFounded = location.tags.some( tag => tags.includes(tag));
                            if (isFounded)
                                locations.push(location);
                        }else {
                            locations.push(location);
                        }
                    }
                });
                let lastItem = locSnapshot.docs[locSnapshot.docs.length - 1];
                return dispatch({ type: LOCATIONS_FETCH_SUCCESS, payload: {locations: getMore ? [ ...currentLocations, ...locations] : locations, query, lastItem, user: user_}})
            }

            if (city.length > 0){
                locSnapshot = await getDb().collection("locations")
                    .where("city.id","in", [city, "nationwide"])
                    .where("status" , "==", 0).orderBy(getDocumentId()).get();

                locSnapshot.forEach(doc => {
                    location = doc.data();
                    location["id"] = doc.id;
                    if (timestamp){
                        if (isStartDateValid(timestamp, location.unavailableDates).length === 0){
                            if (tags && tags.length > 0){
                                let isFounded = location.tags.some( tag => tags.includes(tag));
                                if (isFounded)
                                    locations.push(location);
                            }else {
                                locations.push(location);
                            }
                        }
                    }else{
                        if (tags && tags.length > 0){
                            let isFounded = location.tags.some( tag => tags.includes(tag));
                            if (isFounded)
                                locations.push(location);
                        }else {
                            locations.push(location);
                        }
                    }
                });
                let lastItem = locSnapshot.docs[locSnapshot.docs.length - 1];
                return dispatch({ type: LOCATIONS_FETCH_SUCCESS, payload: {locations: getMore ? [ ...currentLocations, ...locations] : locations, query, lastItem, user: user_}})
            }

            if (category.length > 0){
                locSnapshot = await getDb().collection("locations")
                    .where("category.id","==", category)
                    .where("status" , "==", 0).orderBy(getDocumentId()).get();

                locSnapshot.forEach(doc => {
                    location = doc.data();
                    location["id"] = doc.id;
                    if (timestamp){
                        if (isStartDateValid(timestamp, location.unavailableDates).length === 0){
                            if (tags && tags.length > 0){
                                let isFounded = location.tags.some( tag => tags.includes(tag));
                                if (isFounded)
                                    locations.push(location);
                            }else {
                                locations.push(location);
                            }
                        }
                    }else{
                        if (tags && tags.length > 0){
                            let isFounded = location.tags.some( tag => tags.includes(tag));
                            if (isFounded)
                                locations.push(location);
                        }else {
                            locations.push(location);
                        }
                    }
                });
                let lastItem = locSnapshot.docs[locSnapshot.docs.length - 1];
                return dispatch({ type: LOCATIONS_FETCH_SUCCESS, payload: {locations: getMore ? [ ...currentLocations, ...locations] : locations, query, lastItem, user: user_}})
            }


        }
        catch (e) {
            console.log(e);
            return dispatch({ type: LOCATIONS_FETCH_FAILED });
        }
    }
};

export const getSubCategories = (cat_id = '') => {
    return async (dispatch) => {
        dispatch({ type: LOCATIONS_SUBCATS_FETCH });

        try{
            let subCategories = [], subCategory = {};
            let subCats = await getDb().collectionGroup("subcategories").get();
            subCats.forEach(doc => {
                subCategory = doc.data();
                subCategory["id"] = doc.id;
                subCategory["value"] = doc.id;
                subCategory["label"] = subCategory.name;
                subCategory["cat_id"] = doc.ref.parent.parent.id;
                subCategories.push(subCategory);
            });
            let filteredSubCat = subCategories.filter((cat) => cat.cat_id === cat_id);

            dispatch({ type: LOCATIONS_SUBCATS_FETCH_SUCCESS, payload: {subCategories, filteredSubCat} });
        }
        catch (e) {
            console.log(e);
            return dispatch({ type: LOCATIONS_SUBCATS_FETCH_FAILED, payload: "ERROR FAILED TO FETCH SUB CATEGORIES"})
        }
    };
};

export const sortLocations = (value) => {
    return { type: LOCATIONS_SORT, payload: value }
};

export const loadMoreLocations = (value) => {
    return { type: LOCATIONS_GET_MORE, payload: value }
};

export const getLocationsByCompanyUsername = (username = '') => {
    return async (dispatch) => {
        dispatch({ type: LOCATIONS_FETCH });
        let locSnapshot;
        username = username.substring(1, username.length);
        username.trim();
        try{
            let location = {}, locations = [];
            locSnapshot = await getDb().collection("locations")
                    .where("company.username","==", username)
                    .where("status" , "==", 0).get();
            locSnapshot.forEach(doc => {
                    location = doc.data();
                    location["id"] = doc.id;
                    locations.push(location);
                });


            let lastItem = locSnapshot.docs[locSnapshot.docs.length - 1];

            return dispatch({ type: LOCATIONS_FETCH_SUCCESS, payload: {locations, query: ''}})
        }
        catch (e) {
            console.log(e);
            return dispatch({ type: LOCATIONS_FETCH_FAILED });
        }
    }
};


export const subCategoryChange = (subCategoryId) => {
    return { type: LOCATIONS_FILTER_BY_SUBCATEGORY, payload: subCategoryId }
};

