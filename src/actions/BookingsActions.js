import {
    BOOKING_DISPLAY_ERROR, BOOKING_RESET, BOOKING_SAVE,
    BOOKING_SAVE_FAILED, BOOKING_SAVE_SUCCESS
} from "./type";
import { getAuth, getTimestamp } from "../firebase";
import _ from 'underscore';
const { cloud_api } = require('../config');


export const displayBookingError = (message) => {
    return { type: BOOKING_DISPLAY_ERROR, payload: message }
};

export const submitBooking = (status = 0, campaignTitle, quantity, amount, photo, apcon, notes = '', locationObject, startDate, endDate, period, notApplicable, pricingOption, voucher, vouch, currency, exchange, vat) => {
    ;
    if (quantity > locationObject.quantity) {
        return { type: BOOKING_SAVE_FAILED, payload: `The maximum quantity for this location is ${locationObject.quantity || 0}` }
    }

    return async (dispatch) => {
        dispatch({ type: BOOKING_SAVE });
        try {
            let token;
            let user = getAuth().currentUser;
            let total = (locationObject.discountedPrice ? (locationObject.discountedPrice.checked ? ((locationObject.discountedPrice.value ? (Number(locationObject.discountedPrice.value)) : 0) * quantity * (notApplicable ? 1 : period)) : (locationObject.price ? (Number(locationObject.price)) : 0) * quantity * (notApplicable ? 1 : period)) : (locationObject.price ? (Number(locationObject.price)) : 0) * quantity * (notApplicable ? 1 : period));

            if (user)
                token = await user.getIdToken(true);
            if (!token)
                return dispatch({ type: BOOKING_SAVE_FAILED, payload: "OOPS, SOMETHING WENT WRONG PLEASE LOG OUT AND LOG IN" });

            let data = {};
            data.user = {
                email: user.email,
                name: user.displayName
            };
            data.campaignTitle = campaignTitle || '';
            data.quantity = Number(quantity) || 1;
            if (Number(amount) > 0)
                data.offerAmount = Number(amount) ;
            data.apcon = apcon || false;
            if (notes !== '')
                data.notes = notes || '';
            data.location = {
                id: locationObject.id,
                name: locationObject.name,
                company: locationObject.company,
                price: locationObject.price,
                category: locationObject.category,
                subCategory: locationObject.subCategory,
                discountedPrice: locationObject.discountedPrice,
                geolocation: locationObject.geolocation,
                state: locationObject.state ? locationObject.state : {},
                city: locationObject.city ? locationObject.city : {},
                imageUrl: locationObject.resizedImages ? (locationObject.resizedImages[0] || '') : (locationObject.images ? locationObject.images[0] || '' : '')
            };

            data.startDate = getTimestamp(startDate._d);
            data.notApplicable = notApplicable;
            data.period = period;
            data.status = status;
            data.pricingOption = pricingOption.name || '';
            data.totalPrice = total - (voucher === '' ? 0 : (total * vouch.value / 100)) + vat;
            //data.totalPrice = (locationObject.price ? (Number(locationObject.price)) : 0) * quantity * (notApplicable ? 1 : period);
            //data.endDate = getTimestamp(endDate._d);
            if (!_.isEmpty(vouch)) {
                data.voucher = vouch;
            }
            data.subTotal = total ;
            data.currency = currency;
            data.exchange = exchange;
            let res = await fetch(`${cloud_api}/createOrder`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(data)
            });

            if (res.status === 200) {
                let order = await res.json();
                if (order.code === 0) {
                    data.orderNo = order.orderNo;
                    return dispatch({ type: BOOKING_SAVE_SUCCESS, payload: data });
                }
                else
                    return dispatch({ type: BOOKING_SAVE_FAILED, payload: order.message || 'Error' });
            } else
                return dispatch({ type: BOOKING_SAVE_FAILED, payload: res.statusText || 'Error' })
        }
        catch (e) {
            console.log(e);
            return dispatch({ type: BOOKING_SAVE_FAILED, payload: e.message })
        }
    }
};

export const resetBookingProps = () => {
    return { type: BOOKING_RESET }
};
