import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Instruction from "components/Instruction/Instruction";
import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { setPaymentObj, submitBooking, logOut } from "../../actions";
import { numberWithCommas, substringText, formatCurrency, convertPrice } from "../../utils";
import productStyle from "../../assets/jss/material-kit-pro-react/views/productStyle.js";
import Header from "../../components/Header/Header";
import HeaderLinks from "../../components/Header/HeaderLinks";
import moment from "moment";
import { Button, CircularProgress, withStyles } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import CheckoutStripe from "views/Stripe/stripe";
import CheckoutPaystack from "views/Paystack";
import "./paymentPage.scss";
import AlertDialog from "views/Modal";
import NewNavbar from "components/NewNavbar";

const PaymentPage = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    campaignTitle,
    quantity,
    startDate,
    endDate,
    amount,
    photo,
    apcon,
    notes,
    period,
    notApplicable,
    voucher,
    locationObject,
    location,
    vouch,
    classes,
  } = useSelector((state) => state.location.payment);

  const {
    loading,
    submitBooking,
    error,
    message,
    success,
    isAuthenticated,
    user,
    logOut,
    exchange,
    currency,
    order,
  } = props;
  let total = locationObject.discountedPrice
    ? locationObject.discountedPrice.checked
      ? (locationObject.discountedPrice.value
        ? Number(locationObject.discountedPrice.value)
        : 0) *
      quantity *
      (notApplicable ? 1 : period)
      : (locationObject.price ? Number(locationObject.price) : 0) *
      quantity *
      (notApplicable ? 1 : period)
    : (locationObject.price ? Number(locationObject.price) : 0) *
    quantity *
    (notApplicable ? 1 : period);
    let vat  = (7.5/100) * total
    total = total + vat
  const callback = () => {
    submitBooking(
      1,
      campaignTitle,
      quantity,
      amount,
      photo,
      apcon,
      notes,
      locationObject,
      startDate,
      endDate,
      period,
      notApplicable,
      location.pricingOption,
      voucher,
      vouch,
      props.currency,
      props.exchange,
      vat
    );
  };

  if (success) {
    return (
      <Redirect
        to={{
          pathname: "/orderSummary",
          state: { route: "/orderSummary", orderObject: order },
        }}
      />
    );
  }

  return (
    <div
      //   className={classes.productPage}
      // style={{
      //   marginTop: "7rem",
      // }}
      className={classes.pageHeader}
      style={{
        backgroundImage: `url(${location.resizedImages ? (location.resizedImages[0] || '') : (location.images ? location.images[0] || '' : '')})`,
        paddingTop: '7rem',
        backgroundSize: 'cover',
        height: '100vh',
        opacity: "1",
      }}
    >
      <NewNavbar  isAuthenticated={isAuthenticated}
              user={user}
              logOutUser={() => logOut()} />
      <GridContainer >
        <GridItem xs={12} sm={6} md={6} lg={6} className="mx-auto" 
          style={{backgroundColor: '#fff', padding: 25, borderRadius: 10}}
        >
          {/* NOTICE MODAL START */}

          <h4 className={classes.modalTitle}>
            <strong style={{ color: "#000", fontSize: 18, fontWeight: "Bold", marginTop: 7 }}>Confirmation</strong>
          </h4>

          <div
            id="notice-modal-slide-description"
            className={classes.modalBody}
          >
            <Instruction
              title="Adspace Details"
              className="b"
              text={
                <>
                  <span style={{ color: "#000", fontSize: 15, marginTop: 15 }}>
                    Name: {"  "} {location.name || ""} <br />
                  </span>
                  <span style={{ color: "#000", fontSize: 15, marginTop: 15 }}>
                    Adtype: {"  "}{" "}
                    {location.category ? location.category.name : ""} <br />
                  </span>
                  <span style={{ color: "#000", fontSize: 15, marginTop: 15 }}>
                  Adtype Category: {"  "}{" "}
                    {location.subCategory ? location.subCategory.name : ""}
                    <br />
                  </span>
                  <span style={{ color: "#000", fontSize: 15, marginTop: 15 }}>
                    Price: &nbsp;
                    {numberWithCommas(
                    formatCurrency(
                      location.discountedPrice
                        ? location.discountedPrice.checked
                          ? location.discountedPrice.value
                          : location.price || ""
                        : location.price || "",
                      exchange,
                      currency
                    )
                  )}{" "}
                    <br />
                  </span>
                </>
              }
              image={location.resizedImages ? (location.resizedImages[0] || '') : (location.images ? location.images[0] || '' : '')}
              className={classes.instructionNoticeModal}
              imageClassName={classes.imageNoticeModal}
            />
            <Instruction
              title="Order Details"
              className="b"
              text={
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flex: 1,
                      justifyContent: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        flex: 0.3,
                        justifyContent: "flex-start",
                        alignItems: "left",
                        flexDirection: "row",
                        display: "flex",
                      }}
                    >
                      <h6 style={{ textAlign: "left", fontSize: 15, marginTop: 7, color: '#000' }}>Campaign Title:</h6>
                    </div>
                    <div
                      style={{
                        flex: 0.7,
                        justifyContent: "flex-start",
                        alignItems: "left",
                        flexDirection: "row",
                        display: "flex",
                      }}
                    >
                      <h6 style={{ color: "#000", fontSize: 15, marginTop: 7 }}>{campaignTitle || ""}</h6>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flex: 1,
                      justifyContent: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        flex: 0.3,
                        justifyContent: "space-around",
                        alignItems: "left",
                        flexDirection: "row",
                        display: "flex",
                      }}
                    >
                      <div style={{ flex: 1, justifyContent: "flex-start" }}>
                        <h6 style={{ color: "#000", fontSize: 15, marginTop: 7 }}>Quantity:</h6>
                      </div>
                      <div style={{ flex: 1, justifyContent: "flex-start" }}>
                        <h6 style={{ color: "#000", fontSize: 15, marginTop: 7 }}>{quantity || ""}</h6>
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 0.4,
                        justifyContent: "space-around",
                        alignItems: "left",
                        flexDirection: "row",
                        display: "flex",
                      }}
                    >
                      <div style={{ flex: 1, justifyContent: "flex-start" }}>
                        <h6 style={{ color: "#000", fontSize: 15, marginTop: 7 }}>Start Date:</h6>
                      </div>
                      <div style={{ flex: 1, justifyContent: "flex-start" }}>
                        <h6 style={{ color: "#000", fontSize: 15, marginTop: 7 }}>
                          {startDate
                            ? moment(startDate).format("DD/MM/YYYY")
                            : ""}
                        </h6>
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 0.3,
                        justifyContent: "space-around",
                        alignItems: "left",
                        flexDirection: "row",
                        display: "flex",
                      }}
                    >
                      <div style={{ flex: 1, justifyContent: "flex-start" }}>
                        <h6 style={{ color: "#000", fontSize: 15, marginTop: 7 }}>Period:</h6>
                      </div>
                      <div style={{ flex: 1, justifyContent: "flex-start" }}>
                        <h6 style={{ color: "#000", fontSize: 15, marginTop: 7 }}>
                          {notApplicable
                            ? "Not applicable"
                            : period +
                            ` ${location.pricingOption
                              ? location.pricingOption.name
                                ? location.pricingOption.name.toLowerCase() +
                                "/s"
                                : ""
                              : ""
                            }`}
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flex: 1,
                      justifyContent: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        flex: 0.3,
                        justifyContent: "flex-start",
                        alignItems: "left",
                        flexDirection: "row",
                        display: "flex",
                      }}
                    >
                      <h6 style={{ textAlign: "left", color: "#000", fontSize: 15, marginTop: 7, }}>Voucher Code:</h6>
                    </div>
                    <div
                      style={{
                        flex: 0.7,
                        justifyContent: "flex-start",
                        alignItems: "left",
                        flexDirection: "row",
                        display: "flex",
                      }}
                    >
                      <h6 style={{ color: "#000", fontSize: 15, marginTop: 7 }}>{vouch ? vouch.name : ""}</h6>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flex: 1,
                      justifyContent: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        flex: 0.3,
                        justifyContent: "flex-start",
                        alignItems: "left",
                        flexDirection: "row",
                        display: "flex",
                      }}
                    >
                      <h6 style={{ textAlign: "left", color: "#000", fontSize: 15, marginTop: 7 }}>Sub Total:</h6>
                    </div>
                    <div
                      style={{
                        flex: 0.7,
                        justifyContent: "flex-start",
                        alignItems: "left",
                        flexDirection: "row",
                        display: "flex",
                      }}
                    >
                      <h6 style={{ textAlign: "center", color: "#000", fontSize: 15, marginTop: 7 }}>
                        {formatCurrency(total - vat, exchange, currency)}
                      </h6>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flex: 1,
                      justifyContent: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        flex: 0.3,
                        justifyContent: "flex-start",
                        alignItems: "left",
                        flexDirection: "row",
                        display: "flex",
                      }}
                    >
                      <h6 style={{ textAlign: "left", color: "#000", fontSize: 15, marginTop: 7 }}>Voucher:</h6>
                    </div>
                    <div
                      style={{
                        flex: 0.7,
                        justifyContent: "flex-start",
                        alignItems: "left",
                        flexDirection: "row",
                        display: "flex",
                      }}
                    >
                      {/* <h6
                        style={{
                          textAlign: "center",
                          color: "#000",
                          textDecoration: "line-through",
                          textDecorationStyle: "double",
                        }}
                      >
                        N
                      </h6> */}
                      <h6 style={{ textAlign: "center", color: "#000", fontSize: 15, marginTop: 7 }}>
                      {formatCurrency(( vat), exchange, currency)}
                      </h6>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "row",
                      flex: 1,
                      justifyContent: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        flex: 0.3,
                        justifyContent: "flex-start",
                        alignItems: "left",
                        flexDirection: "row",
                        display: "flex",
                      }}
                    >
                      <h6 style={{ textAlign: "left", color: "#000", fontSize: 15, marginTop: 7 }}>Total:</h6>
                    </div>
                    <div
                      style={{
                        flex: 0.7,
                        justifyContent: "flex-start",
                        alignItems: "left",
                        flexDirection: "row",
                        display: "flex",
                      }}
                    >
                      {/* <h6
                        style={{
                          textAlign: "center",
                          color: "#000",
                          textDecoration: "line-through",
                          textDecorationStyle: "double",
                        }}
                      >
                        N
                      </h6> */}
                      <h6 style={{ textAlign: "center", color: "#000", fontSize: 15, marginTop: 7 }}>
                        {/* {numberWithCommas(
                        total -
                          (voucher === "" ? 0 : total * (vouch.value / 100))
                      )} */}
                        {formatCurrency(total, exchange, currency)}
                      </h6>
                    </div>
                  </div>
                </div>
                /*<>
                                        <span>
                                            Campaign Title:&nbsp; &nbsp; &nbsp; &nbsp;{campaignTitle || ''} <br/>
                                        </span>
                                        <span>
                                            Quantity:&nbsp; &nbsp; &nbsp; &nbsp;{quantity || ''} <br/>
                                        </span>
                                        <span>
                                            Start Date:&nbsp; &nbsp; &nbsp; &nbsp;{startDate ? moment(startDate.toDate()).format('DD/MM/YYYY') : ''} <br/>
                                        </span>
                                        <span>
                                            Period: &nbsp; &nbsp; &nbsp; &nbsp;{notApplicable ? 'Not applicable' : (period + ` ${location.pricingOption ? (location.pricingOption.name ? location.pricingOption.name.toLowerCase() + '/s' : '') : ''}`)}<br/>
                                        </span>
                                        <span>
                                            Sub Total:&nbsp; &nbsp; &nbsp; &nbsp;{quantity || ''} <br/>
                                        </span>
                                        <div style={{ display: 'flex', flexDirection: 'row'}}>
                                            <h4 style={{ textAlign: 'center', color: '#000', fontSize: 14}}>Sub Total: </h4>
                                            <h4 style={{ textAlign: 'center', color: '#000', fontSize: 14, paddingLeft: 10, textDecoration: 'line-through', textDecorationStyle: 'double'}}>N</h4>
                                            <h4 style={{ textAlign: 'center', color: '#000', fontSize: 14}}>
                                                {numberWithCommas(total)}
                                            </h4>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row'}}>
                                            <h4 style={{ textAlign: 'center', color: '#000', fontSize: 14}}>Voucher: </h4>
                                            <h4 style={{ textAlign: 'center', color: '#000', fontSize: 14, paddingLeft: 10, textDecoration: 'line-through', textDecorationStyle: 'double'}}>N</h4>
                                            <h4 style={{ textAlign: 'center', color: '#000', fontSize: 14}}>
                                                {`${voucher === '' ? '0.00' : numberWithCommas(total * (vouch.value / 100))}`}
                                            </h4>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row'}}>
                                            <h4 style={{ textAlign: 'center', color: '#000', fontSize: 14}}>Total: </h4>
                                            <h4 style={{ textAlign: 'center', color: '#000', fontSize: 14, paddingLeft: 10, textDecoration: 'line-through', textDecorationStyle: 'double'}}>N</h4>
                                            <h4 style={{ textAlign: 'center', color: '#000', fontSize: 14}}>
                                                -{`${numberWithCommas(total - (voucher === '' ? 0 : total * (vouch.value / 100)))}`}
                                            </h4>
                                        </div>
                                    </>*/
              }
              className={classes.instructionNoticeModal}
              imageClassName={classes.imageNoticeModal}
            />
            {/*<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                <h4 style={{ textAlign: 'center', color: '#000'}} className={classes.modalTitle}>TOTAL: </h4>
                                <h4 style={{ textAlign: 'center', color: '#000', paddingLeft: 10, textDecoration: 'line-through', textDecorationStyle: 'double'}} className={classes.modalTitle}>N</h4>
                                <h4 style={{ textAlign: 'center', color: '#000'}} className={classes.modalTitle}>
                                    {`${numberWithCommas(locationObject.discountedPrice ? (locationObject.discountedPrice.checked ? ((locationObject.discountedPrice.value ? (Number(locationObject.discountedPrice.value)) : 0) * quantity * (notApplicable ? 1 : period)) : (locationObject.price ? (Number(locationObject.price)) : 0) * quantity * (notApplicable ? 1 : period) ) : (locationObject.price ? (Number(locationObject.price)) : 0) * quantity * (notApplicable ? 1 : period))}`}
                                </h4>
                            </div>*/}
            {/* <p>
                                Please click "Book Adspace"
                                to book your AD right away.
                            </p>*/}
            {error && (
              <GridContainer justify="flex-end">
                <GridItem xs={12} sm={12} md={6}>
                  <p style={{ color: "#ef5350", fontWeight: "bold" }}>
                    {message || ""}
                  </p>
                </GridItem>
              </GridContainer>
            )}
            {loading && (
              <GridContainer justify="flex-end">
                <GridItem xs={12} sm={12} md={6}>
                  <CircularProgress />
                </GridItem>
              </GridContainer>
            )}
          </div>
          <div
            className={classes.modalFooter + " " + classes.modalFooterCenter}
          >
            {success ? (
              <Link to="/">
                <Button round color="success">
                  Continue Browsing
                </Button>
              </Link>
            ) : (
                <div >
                  <AlertDialog isOpen={isOpen} message={"hello"} callback={() =>

                    submitBooking(
                      0,
                      campaignTitle,
                      quantity,
                     amount ,
                      photo,
                      apcon,
                      notes,
                      locationObject,
                      startDate,
                      endDate,
                      period,
                      notApplicable,
                      location.pricingOption,
                      voucher,
                      vouch,
                      props.currency,
                      props.exchange,
                      vat
                    )} />
                  {/* <Button

                    style={{ width: "100%", backgroundColor: "#0b28ba", color: '#fff' }}
                  // round
                  >
                    Pay with Cheque/Bank
              </Button> */}
 <CheckoutPaystack
                      handlePayment={() => "d"}
                      callback={callback}
                      currency={currency}
                      exchange={exchange}
                      bookingData={{
                        campaignTitle,
                        quantity,
                        amount: total,
                        photo,
                        apcon,
                        notes,
                        locationObject,
                        startDate,
                        endDate,
                        period,
                        notApplicable,
                        location,
                        voucher,
                        vouch,
                      }}
                    />

              {/* DO NOT TOUCH */}
                  {/* {props.currency === "NGN" ? (
                    <CheckoutPaystack
                      handlePayment={() => "d"}
                      callback={callback}
                      currency={currency}
                      exchange={exchange}
                      bookingData={{
                        campaignTitle,
                        quantity,
                        amount: total + vat,
                        photo,
                        apcon,
                        notes,
                        locationObject,
                        startDate,
                        endDate,
                        period,
                        notApplicable,
                        location,
                        voucher,
                        vouch,
                      }}
                    />
                  ) : (
                      <CheckoutStripe
                        callback={callback}
                        amount={
                          total - (voucher === "" ? 0 : (total * vouch.value) / 100) + vat
                        }
                      />
                    )} */}

                    {/* DO NOT TOUCH */}

                  {/* <CheckoutStripe />
                  <CheckoutPaystack
                    handlePayment={this.handlePayment}
                    bookingData={{
                      campaignTitle,
                      quantity,
                      amount:
                        total -
                        (voucher === "" ? 0 : (total * vouch.value) / 100),
                      photo,
                      apcon,
                      notes,
                      locationObject,
                      startDate,
                      endDate,
                      period,
                      notApplicable,
                      location,
                      voucher,
                      vouch,
                    }}
                  /> */}
                </div>
              )}
          </div>

          {/* NOTICE MODAL END */}
        </GridItem>
      </GridContainer>
    </div>
  );
};

const mapStateToProps = ({ location, login, booking, paymentType }) => {
  const { loading, error, message, success, order } = booking;
  const { currency, exchange } = paymentType;
  const { isAuthenticated, user } = login;
  return {
    loading,
    error,
    message,
    isAuthenticated,
    success,

    currency,
    exchange,
  };
};

export default connect(
  mapStateToProps,
  {
    setPaymentObj,
    logOut,
    submitBooking,
  }
)(withStyles(productStyle)(PaymentPage));
