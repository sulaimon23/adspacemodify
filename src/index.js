/*!
=========================================================
* Material Kit PRO React - v1.8.0
=========================================================
* Product Page: https://www.creative-tim.com/product/material-kit-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router";
import {
  createFilter,
  createBlacklistFilter,
} from "redux-persist-transform-filter";
import "assets/scss/material-kit-pro-react.scss?v=1.8.0";
import Home from "./views/Home/Home";
// import Locations from "./views/Locations/Locations";
// import LocationsByCompany from "./views/Locations/LocationsByCompany";

// import PageFooter from "./components/Footer/PageFooter";

import reducers from "./reducers";
import ReduxThunk from "redux-thunk";
import { applyMiddleware, compose, createStore } from "redux";
import { Provider } from "react-redux";
import { init } from "./firebase";
import { Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'

// import Blogs from "./views/Blogs/Blogs";
// import Blog from "./views/Blogs/Blog";
// import MediaPlanning from "./views/MediaPlanning/MediaPlanning";
import Login from "./views/Login/Login";
import SignUp from "./views/SignUp/SignUp";
// import Location from "./views/Locations/Location";
// import Booking from "./views/Booking/Booking";
// import ContactUs from "./views/ContactUs/ContactUs";
// import Profile from "./views/Profile/Profile";
// import OrderSummary from "./views/Locations/OrderSummary";
// import Branding from "./views/Branding/Branding";
import "./index.css";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import { PersistGate } from "redux-persist/integration/react";
// import Location2 from "views/Locations/Location2";
// import PaymentPage from "views/Locations/PaymentPage";
const persistConfig = {
  key: "root",
  storage,
  blacklist: ['locations','location', 'mediaplanning', 'contactus', 'signup', 'booking', 'profile']
};
// pages for this product
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const persistedReducer = persistReducer(persistConfig, reducers);
export const store = createStore(
  persistedReducer,
  {},
  composeEnhancers(applyMiddleware(ReduxThunk))
);

const saveSubsetFilter = createFilter("paymentType", [
  "currency",
  "exchange",
  "currencies",
]);
const persistor = persistStore(store, {
  transforms: [saveSubsetFilter],
});
var hist = createBrowserHistory();
init();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router history={hist}>
        <Switch>
          <Route exact path="/" component={Home} />
          {/* <Route exact path="/" component={MediaPlanning} /> */}
          {/* <Route exact path="/branding" component={Branding} /> */}
          {/* <Route exact path="/profile" component={Profile} /> */}
          {/* <Route exact path="/contactus" component={ContactUs} /> */}
          {/* <Route exact path="/orderSummary" component={OrderSummary} /> */}
          {/* <Route exact path="/booking/:id" component={Booking} /> */}
{/*          <Route exact path="/locations" component={Locations} />
          <Route exact path="/location/:id" component={Location} />*/}
          {/* <Route
            exact
            path="/mediaplanning-details/:id"
            component={Location2}
          /> */}
          {/* <Route exact path="/payment" component={PaymentPage} /> */}
          {/* <Route exact path="/blogs" component={Blogs} /> */}
          {/* <Route exact path="/blog/:id" component={Blog} /> */}
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          {/* <Route exact path="/:id" component={LocationsByCompany} /> */}
          <Redirect to="/" />
        </Switch>
        {/* <PageFooter /> */}
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
