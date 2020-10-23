import {
    CONTACTUS_SAVE,
    CONTACTUS_SAVE_FAILED,
    CONTACTUS_SAVE_SUCCESS
} from "./type";
const { cloud_api } = require('../config');

export const sendEmail = (firstname, lastname, email, message, phone, twitter, companyName, instagram) => {
    return async (dispatch) => {
        dispatch({ type: CONTACTUS_SAVE});

        try {
            let data = {};
            let mess = `First Name: ${firstname || ''}\nLast Name: ${lastname || ''}\nEmail: ${email || ''}\nPhone: ${phone ? String(phone) : ''}\nTwitter: ${twitter || ''}\nInstagram: ${instagram || ''}\nCompany Name: ${companyName || ''}\nMessage: ${message || ''}\n\n`;

            data.subject = 'New Email Contact US';
            data.message = mess;

            let res = await fetch(`${cloud_api}/sendContactUsEmail`, {
                method: 'POST',
                headers: {
                    'Accept':       'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return dispatch({ type: CONTACTUS_SAVE_SUCCESS })
        }
        catch (e) {
            console.log(e);
            return dispatch({ type: CONTACTUS_SAVE_FAILED });
        }
    }
};
