import React from "react";
import "./paystack.scss";
import {
  usePaystackPayment,
  PaystackButton,
  PaystackConsumer,
} from "react-paystack";
import { formatCurrency } from "utils";
// import axios from "axios";

// const PaystackHookExample = () => {
//   const initializePayment = usePaystackPayment(config);
//   return (
//     <div>
//       <button
//         onClick={() => {
//           initializePayment();
//         }}
//       >
//         Paystack Hooks Implementation
//       </button>
//     </div>
//   );
// };

function CheckoutPaystack({
  amount,
  handlePayment,
  bookingData,
  callback,
  currency,
  disabled
}) {
  // console.log(bookingData.amount, "PAYSTCK");
  const config = {
    reference: () => new Date().getTime(),
    email: "user@example.com",
    label: "adspace",
    amount: bookingData.amount * 100,
    channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
    publicKey: "pk_test_9d8caedc32374b2064c85c1257c9646b18a740a7",
  };
  const componentProps = {
    ...config,
    text: `Pay ${formatCurrency(
      bookingData.amount,
      1,
      currency
    )} with Paystack`,
    onSuccess: callback,
    onClose: () => null,

  };
  const sendToServer = async (payload) => {
    // console.log(payload, "PAYSTACK");
    const response = await fetch(
      "https://adspace-node.herokuapp.com/api/v1/payment/paystack/verify",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    // console.log(response.json());
    const res = await response.json();

    if (res.status === "success") {
      handlePayment({ ...bookingData, amount: res.amount });
    }
  };
  return (
    <div>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      {/* <PaystackHookExample /> */}
      <PaystackButton

        className={`paystack-btn ${disabled ? "btn-disable" : ""}  MuiButtonBase-root MuiButton-root MuiButton-text makeStyles-button-257`}
        {...componentProps}
      />
      {/* <PaystackConsumer {...componentProps}>
        {({ initializePayment }) => (
          <button onClick={() => initializePayment()}>
            Paystack Consumer Implementation
          </button>
        )}
      </PaystackConsumer> */}
    </div>
  );
}

export default CheckoutPaystack;
