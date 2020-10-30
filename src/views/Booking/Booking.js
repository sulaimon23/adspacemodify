import React, { Component } from "react";
import { connect } from "react-redux";
import blogPostPageStyle from "../../assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";
// import Header from "../../components/Header/Header";
// import HeaderLinks from "../../components/Header/HeaderLinks";
import { logOut } from "../../actions";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Footer from "../../components/Footer/Footer";
import {
  CircularProgress,
  LinearProgress,
  withStyles,
} from "@material-ui/core";
import classNames from "classnames";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import Card from "../../components/Card/Card";
import image from "../../assets/img/dg9.jpg";
import _ from "underscore";
import { getAuth } from "../../firebase";
import {
  setAuthenticated,
  displayBookingError,
  submitBooking,
} from "../../actions";
import { Link, Redirect } from "react-router-dom";
import CustomInput from "../../components/CustomInput/CustomInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Check, Email } from "@material-ui/icons";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import ImageUpload from "../../components/CustomUpload/ImageUpload";
import Button from "../../components/CustomButtons/Button";
import NewNavbar from "components/NewNavbar.js";

class Booking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      campaignTitle: "",
      quantity: 1,
      amount: 0,
      notes: "",
      photo: "",
      apcon: false,
    };
  }

  componentDidMount() {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified === true)
          this.props.setAuthenticated(true, user);
        else this.props.setAuthenticated(false, user);
      } else {
        this.props.setAuthenticated(false, user);
      }
    });
  }

  handleSubmit() {
    const { campaignTitle, quantity, amount, photo, apcon, notes } = this.state;
    const { locationObject } = this.props;
    if (campaignTitle === "") {
      this.props.displayBookingError("PLEASE PROVIDE A CAMPAIGN TITLE");
    } else if (apcon && photo === "")
      this.props.displayBookingError(
        "SINCE YOU CHOSE APCON APPROVAL, YOU NEED TO PROVIDE A PHOTO"
      );
    else {
      this.props.submitBooking(
        campaignTitle,
        quantity,
        amount,
        photo,
        apcon,
        notes,
        locationObject
      );
    }
  }

  render() {
    if (!isAuthenticated) {
      return (
          <Redirect to={{ pathname: '/login' }} />
      )
  }
    const {
      classes,
      isAuthenticated,
      user,
      loading,
      error,
      message,
      locationObject,
      success,
    } = this.props;
    const { campaignTitle, quantity, amount, photo, apcon, notes } = this.state;
    if (_.isEmpty(locationObject)) {
      return <Redirect to="/" />;
    }

    return (
      <div>
       <NewNavbar isAuthenticated={isAuthenticated}
              user={user}
              logOutUser={() => logOut()} />
        <div className={classes.main} style={{ marginBottom: 30 }}>
          <div className={classes.sectionTestimonials}>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem
                  md={10}
                  className={classNames(classes.mlAuto, classes.mrAuto)}
                >
                  <Card raised>
                    <CardHeader>
                      <h3 className={classes.title}>Booking</h3>
                    </CardHeader>
                    <CardBody>
                      <GridContainer>
                        <GridItem md={2} xs={12}>
                          <img src={image} height={80} width={100} />
                        </GridItem>
                        <GridItem md={5} xs={12}>
                          <p style={{ fontWeight: "bold", textAlign: "left" }}>
                            {locationObject.name || ""}
                          </p>
                          <p style={{ textAlign: "left" }}>
                            {`${
                              locationObject.category
                                ? locationObject.category.name || ""
                                : ""
                            } (${
                              locationObject.subCategory
                                ? locationObject.subCategory.name || ""
                                : ""
                            })`}
                          </p>
                          <h4
                            style={{
                              textAlign: "left",
                              fontWeight: "bold",
                              color: "#66bb6a",
                            }}
                          >{`N${locationObject.price || ""}`}</h4>
                        </GridItem>
                        <GridItem md={5} xs={12}>
                          <GridContainer justify="center">
                            <GridItem xs={12} sm={12} md={12}>
                              <CustomInput
                                labelText="CAMPAIGN / PRODUCT TITLE"
                                id="campaign"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  type: "text",
                                  autoFocus: true,
                                  value: campaignTitle,
                                  onChange: (e) => {
                                    this.setState({
                                      campaignTitle: e.target.value,
                                    });
                                  },
                                }}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12}>
                              <CustomInput
                                labelText="Quantity"
                                id="quantity"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  type: "number",
                                  value: quantity,
                                  onChange: (e) => {
                                    this.setState({ quantity: e.target.value });
                                  },
                                }}
                              />
                            </GridItem>
                            {/*<GridItem xs={12} sm={12} md={12}>
                                                            <CustomInput
                                                                labelText="Offer Amount"
                                                                id="offer_amount"
                                                                formControlProps={{
                                                                    fullWidth: true
                                                                }}
                                                                inputProps={{
                                                                    type: "number",
                                                                    value: amount,
                                                                    onChange: (e) => {
                                                                        this.setState({amount: e.target.value})
                                                                    }
                                                                }}
                                                            />
                                                            <p>***Please be reasonable with your offer amount**</p>
                                                        </GridItem>*/}
                            <GridItem xs={12} sm={12} md={12}>
                              <CustomInput
                                labelText="Additional Notes (optional)"
                                id="notes"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                multiline={true}
                                rows={5}
                                inputProps={{
                                  type: "text",
                                  value: notes,
                                  onChange: (e) => {
                                    this.setState({ notes: e.target.value });
                                  },
                                }}
                              />
                            </GridItem>
                            {/* <GridItem xs={12} sm={12} md={12}>
                                                            <div
                                                                className={
                                                                    classes.checkboxAndRadio +
                                                                    " " +
                                                                    classes.checkboxAndRadioHorizontal
                                                                }
                                                            >
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            tabIndex={-1}
                                                                            onClick={() => this.setState({apcon: !apcon})}
                                                                            checkedIcon={<Check className={classes.checkedIcon} />}
                                                                            icon={<Check className={classes.uncheckedIcon} />}
                                                                            classes={{
                                                                                checked: classes.checked,
                                                                                root: classes.checkRoot
                                                                            }}
                                                                        />
                                                                    }
                                                                    classes={{ label: classes.label, root: classes.labelRoot }}
                                                                    label="APCON Approval ?"
                                                                />
                                                            </div>
                                                        </GridItem>
                                                        <GridItem xs={12} sm={12} md={12}>
                                                            <p>Upload a photo of your campaign</p>
                                                            <input
                                                                type="file"
                                                                multiple="multiple"
                                                                onChange={e => this.setState({photo: e.target.files[0]})}
                                                            />
                                                        </GridItem>*/}
                            <br />
                            <br />
                            <br />
                            {error && (
                              <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                  <p
                                    style={{
                                      color: "#ef5350",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {message || ""}
                                  </p>
                                </GridItem>
                              </GridContainer>
                            )}
                            {loading && (
                              <GridContainer justify="center">
                                <GridItem xs={12} sm={12} md={12}>
                                  <CircularProgress />
                                </GridItem>
                              </GridContainer>
                            )}
                            {success && (
                              <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                  <p
                                    style={{
                                      color: "#66bb6a",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {message || ""}
                                  </p>
                                </GridItem>
                              </GridContainer>
                            )}
                            {success ? (
                              <GridItem xs={12} sm={12} md={12}>
                                <Link to="/">
                                  <Button round color="success">
                                    Continue Browsing
                                  </Button>
                                </Link>
                              </GridItem>
                            ) : (
                              <GridItem xs={12} sm={12} md={12}>
                                <Button
                                  round
                                  color="rose"
                                  onClick={() => this.handleSubmit()}
                                >
                                  Submit
                                </Button>
                              </GridItem>
                            )}
                          </GridContainer>
                        </GridItem>
                      </GridContainer>
                    </CardBody>
                  </Card>
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ booking, login, location }) => {
  const { loading, error, message, success } = booking;
  const { isAuthenticated, user } = login;
  const { locationObject } = location;
  return {
    loading,
    error,
    message,
    isAuthenticated,
    user,
    locationObject,
    success,
  };
};

export default connect(
  mapStateToProps,
  {
    logOut,
    setAuthenticated,
    displayBookingError,
    submitBooking,
  }
)(withStyles(blogPostPageStyle)(Booking));
