import { store } from "./index";
import {getAuth} from "./firebase";

export const numberWithCommas = (x) => {
  let parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

export const substringText = (string = "", value = 66) => {
  if (string.length < value) return string;
  else return string.substr(0, value - 1) + "...";
};

const persist = async (item) => {
  localStorage.setItem("exchange", item);
};

export const formatCurrency = (price, val = 1, currency = "NGN") => {
  // await persist(val);
  // localStorage.getItem("exchange")

  const formatter = new Intl.NumberFormat(
      `en-${currency === "NGN"
          ? "NG"
          : currency === "USD"
              ? "US"
              : currency === "GBP"
                  ? "UK"
                  : currency === "EUR"
                      ? "EU"
                      : currency === "MYR"
                          ? "MY"
                          : ""
      }`,
      {
        style: "currency",
        currency: currency,
        //maximumSignificantDigits: 2,
        minimumFractionDigits: 2,
      }
  );

  if (currency === "NGN") {
    return formatter.format(price).replace(/\D00(?=\D*$)/, '');
  } else {
    const data = price / val;
    return formatter.format(data).replace(/\D00(?=\D*$)/, '');
  }
};

export const convertPrice = (price, val = 1, needConvert) =>
  needConvert ? price / val : price;

export const isUserLoggedIn = async () => {
  let loggedInUser = undefined;
  try {
    await new Promise((resolve, reject) =>
        getAuth().onAuthStateChanged(
            user => {
              if (user) {
                loggedInUser = user;
                // User is signed in.
                resolve(loggedInUser)
              } else {
                // No user is signed in.
                return reject(loggedInUser)
              }
            },
            // Prevent console error
            error => reject(loggedInUser)
        )
    );
    return loggedInUser
  } catch (error) {
    return loggedInUser
  }
};
