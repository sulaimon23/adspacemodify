import React, { Component } from "react";
import Header from "../../components/Header/Header";
import HeaderLinks from "../../components/Header/HeaderLinks";
import productStyle from "../../assets/jss/material-kit-pro-react/views/productStyle.js";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core";
import { logOut } from "../../actions";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import CardHeader from "../../components/Card/CardHeader";
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardFooter from "../../components/Card/CardFooter";
import Button from "../../components/CustomButtons/Button";
import { Link, Redirect } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { formatCurrency, numberWithCommas } from "../../utils";
import moment from "moment";
import image from "../../assets/img/Background 2.jpg";
import "./ordersummary.scss";
import NewNavbar from "components/NewNavbar";

class OrderSummary extends Component {
  render() {
    const {
      classes,
      isAuthenticated,
      user,
      logOut,
      location,
      success,
      exchange,
      currency,
    } = this.props;
    if (!location || !location.state) {
      return <Redirect to="/" />;
    }

    const order = location.state.orderObject;
    const orders = location.state.orders;
    const orderNos = location.state.orderNos;
    const totalPrice = location.state.totalPrice;

    // console.log(orders, 'orders')

    /*if (!success){
            return(
                <Redirect to="/" />
                )
        }*/
    if (order) {
      return (
        <div>
          <NewNavbar  isAuthenticated={isAuthenticated}
              user={user}
              logOutUser={() => logOut()} />
          <div className="order-background">
            <GridContainer justify="center">
              {/* <GridItem xs={12} md={6} sm={12}>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
                                    <Card style={{ padding: 15, alignItems: "center", marginTop: 65}}>
                                        <CardHeader style={{ alignItems: "center", marginTop: 10, display: "flex", flexDirection: "column"}}>
                                            <h5>Your Order has been</h5>
                                            <h3 style={{ fontWeight: "bold", textCenter: "center"}}>Placed</h3>
                                        </CardHeader>
                                        <CardBody style={{ marginBottom: 30}}>
                                            <img src={require('../../assets/img/success.png')} height={100} width={100} />
                                        </CardBody>
                                        <CardFooter>
                                            <Link to="/">
                                                <Button round color="success">
                                                    Continue Browsing
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </GridItem> */}
              <GridItem xs={4} md={4} sm={12}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                  }}
                >
                  <Card
                    style={{
                      paddingLeft: 40,
                      paddingRight: 40,
                      paddingTop: 20,
                      paddingBottom: 20,
                      marginTop: 65,
                    }}
                  >
                    <CardHeader
                      style={{
                        marginTop: 0,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <h4 style={{ fontWeight: "bold", textAlign: "center" }}>
                        YAY YOUR AD SPACE HAS BEEN LOCKED!
                      </h4>
                    </CardHeader>
                    <CardBody>
                      <img
                        height="200px"
                        width="100%"
                        src={order.location ? order.location.imageUrl : ""}
                      />
                      <h4
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                          marginTop: 20,
                          marginBottom: 20,
                        }}
                      >
                        ORDER DETAILS
                      </h4>
                      <GridContainer justify="left">
                        <GridItem xs={6} md={4} sm={6}>
                          <h5 style={{ fontWeight: "800", fontSize: 14 }}>
                            ORDER NUMBER:
                          </h5>
                        </GridItem>
                        <GridItem xs={6} md={8} sm={6}>
                          <h5 style={{ fontWeight: "800", fontSize: 14 }}>
                            {order ? order.orderNo || "" : ""}
                          </h5>
                        </GridItem>
                      </GridContainer>
                      <GridContainer justify="left">
                        <GridItem xs={6} md={4} sm={6}>
                          <h5 style={{ fontWeight: "800", fontSize: 14 }}>
                            START DATE:{" "}
                          </h5>
                        </GridItem>
                        <GridItem xs={6} md={8} sm={6}>
                          <h5 style={{ fontWeight: "800", fontSize: 14 }}>
                            {moment
                              .unix(order.startDate.seconds)
                              .format("DD/MM/YYYY")}
                          </h5>
                        </GridItem>
                      </GridContainer>

                      <GridContainer>
                        <GridItem xs={6} md={4} sm={6}>
                          <h5 style={{ fontWeight: "800", fontSize: 14 }}>
                            CATEGORY:{" "}
                          </h5>
                        </GridItem>
                        <GridItem xs={6} md={8} sm={6}>
                          <h5 style={{ fontWeight: "800", fontSize: 14 }}>
                            {order
                              ? `${order.location.category.name} ADVERTS` || ""
                              : ""}
                          </h5>
                        </GridItem>
                      </GridContainer>

                      <GridContainer>
                        <GridItem xs={6} md={4} sm={6}>
                          <h5 style={{ fontWeight: "800", fontSize: 14 }}>
                            LOCATION:{" "}
                          </h5>
                        </GridItem>
                        <GridItem xs={6} md={8} sm={6}>
                          <h5 style={{ fontWeight: "800", fontSize: 14 }}>
                            {order.location
                              ? order.location
                                ? order.location.name
                                : ""
                              : ""}
                          </h5>
                        </GridItem>
                      </GridContainer>
                      <br />

                      <GridContainer>
                        <GridItem xs={6} md={4} sm={6}>
                          <h5 style={{ fontWeight: "800", fontSize: 14 }}>
                            TOTAjjkL:{" "}
                          </h5>
                        </GridItem>
                        <GridItem xs={6} md={8} sm={6}>
                          <h5 style={{ fontWeight: "800", fontSize: 14 }}>
                            {formatCurrency(order.totalPrice, exchange, currency)}
                          </h5>
                        </GridItem>
                      </GridContainer>

                      <div style={{ textAlign: "center", marginTop: 20 }}>
                        <Link to="/">
                          <Button
                            style={{
                              backgroundColor: "#2a87d0",
                              borderRadius: 10,
                            }}
                          >
                            Continue Browsing
                          </Button>
                        </Link>
                      </div>
                      {/* <GridContainer>
                                                <div style={{ border: 1, borderColor: "#000"}} />
                                            </GridContainer>
                                            <GridContainer>
                                                <GridItem xs={3} md={2} sm={3}>
                                                    <p style={{ fontWeight: "bold"}}>{order.location ? (order.quantity ? order.quantity + ' x' : '') : ''}</p>
                                                </GridItem>
                                                <GridItem xs={5} md={7} sm={5}>
                                                    <p>{order.location ? (order.location ? order.location.name : '') : ''}</p>
                                                </GridItem>
                                                <GridItem xs={4} md={3} sm={4}>
                                                    <p>N {numberWithCommas(order.location ? (order.location.discountedPrice ? (order.location.discountedPrice.checked ? (order.location.discountedPrice.value || '') : (order.location.price || '')) : (order.location.price || '')) : '')}</p>
                                                </GridItem>
                                            </GridContainer>
                                            <GridContainer justify="center">
                                                <GridItem xs={12} md={12} sm={12}>`
                                                    <p style={{ fontWeight: "bold", textAlign: "center"}}>Sub Total: N{numberWithCommas(order.subTotal ? order.subTotal : '')}</p>
                                                </GridItem>
                                            </GridContainer>
                                            {order.voucher &&
                                            <GridContainer justify="center">
                                                <GridItem xs={12} md={12} sm={12}>`
                                                    <p style={{ fontWeight: "bold", textAlign: "center"}}>Voucher: -N{numberWithCommas(order.subTotal ? (order.subTotal * (order.voucher.value ? (order.voucher.value / 100) : 1 ) ) : '')}</p>
                                                </GridItem>
                                                <GridItem xs={12} md={12} sm={12}>`
                                                    <p style={{ fontWeight: "bold", textAlign: "center"}}>Voucher Code: {order.voucher.name || ''}</p>
                                                </GridItem>
                                            </GridContainer>
                                            } */}
                      {/* <GridContainer justify="center">
                                                <GridItem xs={12} md={12} sm={12}>`
                                                    <p style={{ fontWeight: "bold", textAlign: "center"}}>Total: N{numberWithCommas(order.subTotal ? order.subTotal - (order.subTotal * (order.voucher ? (order.voucher.value ? order.voucher.value / 100 : 0) : 0) ) : '')}</p>
                                                </GridItem>
                                            </GridContainer> */}
                    </CardBody>
                  </Card>
                </div>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <NewNavbar  isAuthenticated={isAuthenticated}
              user={user}
              logOutUser={() => logOut()} />
          <div className={classes.container} style={{ marginTop: 50 }}>
            <GridContainer justify="center">
              <GridItem xs={12} md={6} sm={12}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <Card
                    style={{ padding: 15, alignItems: "center", marginTop: 65 }}
                  >
                    <CardHeader
                      style={{
                        alignItems: "center",
                        marginTop: 10,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <h5>Your Order has been</h5>
                      <h3 style={{ fontWeight: "bold", textCenter: "center" }}>
                        Placed
                      </h3>
                    </CardHeader>
                    <CardBody style={{ marginBottom: 30 }}>
                      <img
                        src={require("../../assets/img/success.png")}
                        height={100}
                        width={100}
                      />
                    </CardBody>
                    <CardFooter>
                      <Link to="/">
                        <Button round color="success">
                          Continue Browsing
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </GridItem>
              <GridItem xs={12} md={6} sm={12}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                  }}
                >
                  <Card style={{ padding: 15, marginTop: 65 }}>
                    <CardHeader
                      style={{
                        marginTop: 0,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <h4 style={{ fontWeight: "bold" }}>Order Details</h4>
                    </CardHeader>
                    <CardBody>
                      <GridContainer>
                        <>
                          <GridItem xs={6} md={4} sm={6}>
                            <h5>Order Number: </h5>
                          </GridItem>
                          <GridItem xs={6} md={8} sm={6}>
                            <h5 style={{ fontWeight: "bold" }}>
                              {orderNos
                                ? orderNos.substring(0, orderNos.length - 2)
                                : ""}
                            </h5>
                          </GridItem>
                        </>
                      </GridContainer>
                      {/*<GridContainer>
                                                <GridItem xs={6} md={4} sm={6}>
                                                    <h5>Start Date: </h5>
                                                </GridItem>
                                                <GridItem xs={6} md={8} sm={6}>
                                                    <h5 style={{ fontWeight: "bold"}}>{moment.unix(order.startDate.seconds).format("DD/MM/YYYY")}</h5>
                                                </GridItem>
                                            </GridContainer>*/}
                      <br />
                      <GridContainer>
                        <div style={{ border: 1, borderColor: "#000" }} />
                      </GridContainer>
                      {orders &&
                        orders.map((order, index) => {
                          return (
                            <GridContainer key={index}>
                              <GridItem xs={3} md={2} sm={3}>
                                <p style={{ fontWeight: "bold" }}>
                                  {order.location
                                    ? order.quantity
                                      ? order.quantity + " x"
                                      : ""
                                    : ""}
                                </p>
                              </GridItem>
                              <GridItem xs={5} md={7} sm={5}>
                                <p>
                                  {order.location
                                    ? order.location
                                      ? order.location.name
                                      : ""
                                    : ""}
                                </p>
                              </GridItem>
                              <GridItem xs={4} md={3} sm={4}>
                                <p>

                                  {formatCurrency(
                                    order.location
                                      ? order.location.discountedPrice
                                        ? order.location.discountedPrice.checked
                                          ? order.location.discountedPrice
                                            .value || 0
                                          : order.location.price || 0
                                        : order.location.price || 0
                                      : 0
                                    , exchange, currency
                                  )}
                                </p>
                              </GridItem>
                            </GridContainer>
                          );
                        })}
                      {order ? (
                        <GridContainer justify="center">
                          <GridItem xs={12} md={12} sm={12}>
                            `
                            <p
                              style={{
                                fontWeight: "bold",
                                textAlign: "center",
                              }}
                            >
                              Total: {formatCurrency(order.totalPrice || 0, currency, exchange)}
                            </p>
                          </GridItem>
                        </GridContainer>
                      ) : (
                          <GridContainer justify="center">
                            <GridItem xs={12} md={12} sm={12}>
                              `
                            <p
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "center",
                                }}
                              >
                                Total: {formatCurrency(totalPrice || 0, exchange, currency)}
                              </p>
                            </GridItem>
                          </GridContainer>
                        )}
                    </CardBody>
                  </Card>
                </div>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = ({ login, mediaplanning, paymentType }) => {
  const { isAuthenticated, user } = login;
  const { success } = mediaplanning;
  const { currency, exchange } = paymentType;
  return {
    isAuthenticated, user, success, exchange,
    currency
  };
};

export default connect(
  mapStateToProps,
  {
    logOut,
  }
)(withStyles(productStyle)(OrderSummary));
