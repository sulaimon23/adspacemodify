import {CURRENCY, CURRENCY_FAILED} from "../actions/type";
import {getDb} from "../firebase";

export const getCurrency = (id) => {
    return async (dispatch) => {
        dispatch({ type: CURRENCY });
        try{
           let currencySnapshot = await getDb().collection("currency").doc(id).get();
           let currency = currencySnapshot.data();
           currency["id"] = currencySnapshot.id;
           return dispatch({ type: CURRENCY, payload: currency });
        }
        catch (e) {
            console.log(e);
            return dispatch({ type: CURRENCY_FAILED, payload: "" });
        }
    }
};
