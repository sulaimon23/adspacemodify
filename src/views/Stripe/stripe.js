import React, { useState } from "react";
import ReactDOM from "react-dom";
// import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@material-ui/core";
import StripeCheckout from "react-stripe-checkout";
import { useSelector } from "react-redux";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// const stripePromise = loadStripe(
//   "pk_test_51HLPQtJFfNyDVbe3EM3bD6C6Huo5hc3EzhQMRi6FiMIKPQ9QIbgHxZYfefx7JTHm40WS1IGa9T9agBukhrVgIZZN00CZmyXfUi"
// );

function CheckoutStripe({ amount, callback, disabled }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const currency = useSelector((state) => state.paymentType.currency);
  const exchange = useSelector((state) => state.paymentType.exchange);
  const convertedAmount = amount / exchange;
  const handleClick = async (event) => {
    // Get Stripe.js instance
    // const stripe = await stripePromise;
    setLoading(true);
    // Call your backend to create the Checkout Session
    // const response = await fetch(
    //   "http://localhost:4200/api/v1/payment/stripe/create-checkout-session",
    //   {
    //     method: "POST",
    //   }
    // );

    // const session = await response.json();
    // setToken(session.id);
    // setLoading(false);
    // When the customer clicks on the button, redirect them to Checkout.
    // const result = await stripe.redirectToCheckout({
    //   sessionId: session.id,
    // });
    // console.log(result);
    // if (result.error) {
    //   // If `redirectToCheckout` fails due to a browser or network
    //   // error, display the localized error message to your customer
    //   // using `result.error.message`.
    // }
  };
  const onToken = (token) => {

  };
  return (
    <div>
      {/* {token ? ( */}
      <StripeCheckout
        stripeKey="pk_test_51HLPQtJFfNyDVbe3EM3bD6C6Huo5hc3EzhQMRi6FiMIKPQ9QIbgHxZYfefx7JTHm40WS1IGa9T9agBukhrVgIZZN00CZmyXfUi"
        token={onToken}
        amount={convertedAmount * 100}
        token={callback}
        // image="https://alligator.io/images/alligator-logo3.svg"
        label="Pay with Stripe"
        locale="auto"
        name="Adspace"
        currency={currency}
        disabled={disabled}
      />
      {/* ) : (
        <Button
          style={{ width: "100%", backgroundColor: "#0b28ba" }}
          role="link"
          onClick={handleClick}
        >
          Checkout
        </Button>
      )} */}
    </div>
  );
}

export default CheckoutStripe;
