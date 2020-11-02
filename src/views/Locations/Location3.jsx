import React, { Component } from "react";
import "./location.scss";
// nodejs library that concatenates classes
import classNames from "classnames";
import { connect } from "react-redux";
import _ from "underscore";
import {
  setLocationObject,
  getLocation,
  setAuthenticated,
  logOut,
  locationShowBookingDetails,
  displayBookingError,
  submitBooking,
  resetBookingProps,
  getSimilarLocations,
} from "../../actions";
import productStyle from "../../assets/jss/material-kit-pro-react/views/productStyle.js";
import {
  CircularProgress,
  withStyles,
  TextField,
  OutlinedInput,
} from "@material-ui/core";
import Header from "../../components/Header/Header";
import HeaderLinks from "../../components/Header/HeaderLinks";
import Parallax from "../../components/Parallax/Parallax";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Button from "../../components/CustomButtons/Button";
import { Check, Close, Favorite, Place } from "@material-ui/icons";
import ImageGallery from "react-image-gallery";
import Accordion from "../../components/Accordion/Accordion";
import FormControl from "@material-ui/core/FormControl";
import { Redirect } from "react-router-dom";
import { getAuth } from "../../firebase";
import { Link, Route } from "react-router-dom";
import Badge from "../../components/Badge/Badge";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import CardFooter from "../../components/Card/CardFooter";
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";

import cardProduct1 from "assets/img/examples/card-product1.jpg";
import cardProduct3 from "assets/img/examples/card-product3.jpg";
import cardProduct4 from "assets/img/examples/card-product4.jpg";
import cardProduct2 from "assets/img/examples/card-product2.jpg";
import InfoArea from "../../components/InfoArea/InfoArea";
import Footer from "../../components/Footer/Footer";
import CustomSkinMap from "./CustomSkinMap";
import CustomInput from "../../components/CustomInput/CustomInput";
import Datetime from "react-datetime";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
} from "@material-ui/core";
import Instruction from "../../components/Instruction/Instruction";
import moment from "moment";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {
  dangerColor,
  infoColor,
  successColor,
} from "../../assets/jss/material-kit-pro-react";
import OrderSummary from "./OrderSummary";
import Info from "../../components/Typography/Info";
import CardCustom from "./../../components/Card/CardCustom";
import { numberWithCommas, substringText, formatCurrency } from "../../utils";
import CheckoutStripe from "../Stripe/stripe";
import CheckoutPaystack from "views/Paystack";
import NewNavbar from "components/NewNavbar";
let yesterday = Datetime.moment().subtract(1, "day");
let valid = function(current) {
  return current.isAfter(yesterday);
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
Transition.displayName = "Transition";

const PERIODS = [
  { id: 1, name: "1 month" },
  { id: 2, name: "2 months" },
  { id: 3, name: "3 months" },
  { id: 4, name: "4 months" },
  { id: 5, name: "5 months" },
  { id: 6, name: "6 months" },
  { id: 7, name: "7 months" },
  { id: 8, name: "8 months" },
  { id: 9, name: "9 months" },
  { id: 10, name: "10 months" },
  { id: 11, name: "11 months" },
  { id: 12, name: "12 months" },
];

class Location2 extends Component {
  constructor(props) {
    super(props);
    this.geolocation = JSON.parse(localStorage.getItem("geolocation"));
    this.state = {
      campaignTitle: "",
      quantity: 1,
      notes: "",
      startDate: "",
      endDate: "",
      noticeModal: false,
      period: 1,
      notApplicable: false,
      totalPrice: 0,
      periodValue: "",
      voucher: "",
      vouch: {},
      modalIsOpen: false,
      amountToPay: 0,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const {
      location,
      match,
      setLocationObject,
      getLocation,
      locationsArray,
      locationObject,
    } = this.props;

    if (location && !_.isEmpty(location.location)) {
      setLocationObject(location.location || {});
    } else {
      let id = match.params.id;
      getLocation(id);
    }

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

  getFrame = (locationObject) => {
    if (locationObject && locationObject.embeddedLink) {
      try {
        return (document.getElementById("iframeMap").innerHTML =
          locationObject.embeddedLink);
      } catch (e) {
        return null;
      }
    } else return null;
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { location, getLocation } = this.props;
    const { location: prevLocation } = prevProps;
    let idArray = [];
    if (location.pathname !== prevLocation.pathname) {
      idArray = location.pathname.split("/") || [];
      window.scrollTo(0, 0);
      getLocation(idArray[2] || "");
    }
  }
  cal(images, image) {
    if (images && images.length > 0) {
      return images.map((image_) => {
        return {
          original: image_,
          thumbnail: image_,
          fullscreen:
            "https://firebasestorage.googleapis.com/v0/b/adspaceprod-11ddc.appspot.com/o/locations%2Fimages%2Fphoto.jpg?alt=media&token=9bd416a3-7662-44ae-826c-1dc73a17bded",
        };
      });
    } else {
      return [1, 2, 3, 4].map((a) => {
        return { original: image, thumbnail: image };
      });
    }
  }

  renderLocTags() {
    const { locationObject } = this.props;
    if (
      locationObject &&
      locationObject.tags &&
      locationObject.tags.length > 0
    ) {
      return locationObject.tags.map((tag, index) => {
        return (
          <Badge color="rose" key={index}>
            {tag || ""}
          </Badge>
        );
      });
    }
  }

  renderInterest(locationObject) {
    // const { locationObject } = this.props;
    if (
      locationObject &&
      locationObject.interests &&
      locationObject.interests.length > 0
    ) {
      return locationObject.interests.map((tag, index) => {
        return (
          <Badge color="info" key={index}>
            {tag || ""}
          </Badge>
        );
      });
    }
  }

  renderAges(locationObject) {
    // const { locationObject } = this.props;
    if (
      locationObject &&
      locationObject.ages &&
      locationObject.ages.length > 0
    ) {
      return locationObject.ages.map((age, index) => {
        return age.min && age.max ? (
          <Badge key={index} color="danger">
            {/* {tag.min + tag.max|| ""} */}
            {`${age.min || ""} - ${age.max || ""}`}
          </Badge>
        ) : null;
      });
    }
  }

  renderGender(locationObject) {
    // const { locationObject } = this.props;
    if (
      locationObject &&
      locationObject.genders &&
      locationObject.genders.length > 0
    ) {
      return locationObject.genders.map((tag, index) => {
        return (
          <Badge color="success" key={index}>
            {tag || ""}
          </Badge>
        );
      });
    }
  }

  checkLandmark(locationObject) {
    if (
      locationObject &&
      locationObject.category &&
      locationObject.category.length > 0
    ) {
      return locationObject.landmarks.map((landmark, index) => {
        return (
          <div key={index}>
            <span style={{ color: "#000", fontSize: 18, fontWeight: "bold" }}>
              Landmark
            </span>
            <span>{`${landmark}` || ""}</span>
          </div>
        );
      });
    }
  }

  handleSubmit() {
    const {
      campaignTitle,
      quantity,
      amount,
      photo,
      apcon,
      notes,
      startDate,
      endDate,
      periodValue,
      voucher,
    } = this.state;
    const {
      locationObject,
      displayBookingError,
      submitBooking,
      resetBookingProps,
      vouchers,
    } = this.props;

    if (quantity > locationObject.quantity) {
      displayBookingError(
        `The maximum quantity for this location is ${locationObject.quantity ||
          0}`
      );
    } else if (campaignTitle === "") {
      displayBookingError("PLEASE PROVIDE A CAMPAIGN TITLE");
    } else if (apcon && photo === "")
      displayBookingError(
        "SINCE YOU CHOSE APCON APPROVAL, YOU NEED TO PROVIDE A PHOTO"
      );
    else if (startDate === "")
      displayBookingError("PLEASE CHOOSE A START DATE FOR YOUR CAMPAIGN");
    else if (
      this.isStartDateValid(startDate.unix(), locationObject.unavailableDates)
        .length > 0
    )
      displayBookingError(
        "THIS ADSPACE IS NOT AVAILABLE DURING THIS TIME , PLEASE CHOOSE ANOTHER START DATE"
      );
    else {
      if (voucher !== "") {
        let vouch = this.findItem(
          vouchers,
          voucher ? voucher.toLowerCase().trim() : ""
        );
        if (vouch === undefined)
          displayBookingError("THIS VOUCHER CODE DOES NOT EXIST");
        else if (vouch && !vouch.active)
          displayBookingError("THIS VOUCHER CODE IS NO LONGER AVAILABLE");
        else {
          resetBookingProps();
          this.setState({ noticeModal: true, vouch });
        }
      } else {
        resetBookingProps();
        this.setState({ noticeModal: true, vouch: {} });
      }
    }
  }

  findItem(array, item) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === item) return array[i];
    }
    return undefined;
  }

  validEnd = (current) => {
    return current.isAfter(this.state.startDate);
  };

  isStartDateValid(startDate, dates = []) {
    let res = [];
    if (dates && dates.length > 0) {
      dates.map((date) => {
        if (startDate >= date.start.seconds && startDate <= date.end.seconds) {
          res.push(1);
        }
      });
    }
    return res || [];
  }

  handlePayment({
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
    location,
    voucher,
    vouch,
  }) {
    // submitBooking(
    //   campaignTitle,
    //   quantity,
    //   amount,
    //   photo,
    //   apcon,
    //   notes,
    //   locationObject,
    //   startDate,
    //   endDate,
    //   period,
    //   notApplicable,
    //   location.pricingOption,
    //   voucher,
    //   vouch
    // );
  }

  renderBookingDetails() {
    const {
      campaignTitle,
      quantity,
      notes,
      period,
      notApplicable,
      periodValue,
      voucher,
      vouch,
    } = this.state;
    const {
      classes,
      error,
      loading,
      success,
      message,
      locationObject,
      startDate,
      endDate,
      pricingOptions,
    } = this.props;
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

    return (
      <>
        <GridContainer justify="flex-end">
          <GridItem xs={12} sm={12} md={12}>
            <FormControl
              fullWidth
              className={classes.margin}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-amount">
                CAMPAIGN / PRODUCT TITLE
              </InputLabel>
              <OutlinedInput
                labelWidth={210}
                variant="outlined"
                size="small"
                labelText="CAMPAIGN / PRODUCT TITLE"
                id="campaign"
                //   formControlProps={{
                //     fullWidth: true,
                //     variant: "outlined",
                //   }}
                inputProps={{
                  type: "text",
                  autoFocus: true,
                  value: campaignTitle,
                  onChange: (e) => {
                    this.setState({ campaignTitle: e.target.value });
                  },
                }}
              />
            </FormControl>
          </GridItem>
        </GridContainer>
        <GridContainer justify="flex-end">
          <GridItem xs={12} sm={12} md={6} style={{ paddingTop: "1.5rem" }}>
            <FormControl
              fullWidth
              className={classes.margin}
              variant="outlined"
              size="small"
            >
              <InputLabel htmlFor="outlined-adornment-amount">
                {`Quantity (Available quantity ${locationObject.quantity ||
                  ""})`}
              </InputLabel>
              <OutlinedInput
                labelWidth={210}
                variant="outlined"
                labelText={`Quantity (Available quantity ${locationObject.quantity ||
                  ""})`}
                id="quantity"
                formControlProps={{
                  fullWidth: true,
                }}
                min={1}
                inputProps={{
                  type: "number",
                  value: quantity,
                  onChange: (e) => {
                    this.setState({ quantity: e.target.value });
                  },
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <br />
            <FormControl variant="outlined" fullWidth>
              <Datetime
                style={{ borderWidth: 0 }}
                timeFormat={false}
                isValidDate={valid}
                value={startDate}
                inputProps={{
                  placeholder: "Start Date",
                }}
                onChange={(e) => this.setState({ startDate: e })}
              />
            </FormControl>
          </GridItem>
        </GridContainer>

        <GridContainer justify="flex-end">
          <GridItem xs={12} sm={12} md={3} style={{ paddingTop: "1.5rem" }}>
            <FormControl
              fullWidth
              className={classes.margin}
              variant="outlined"
              size="small"
            >
              <InputLabel htmlFor="outlined-adornment-amount">Value</InputLabel>
              <OutlinedInput
                min={1}
                labelWidth={40}
                variant="outlined"
                labelText="Value"
                formControlProps={{
                  fullWidth: true,
                }}
                min={1}
                inputProps={{
                  type: "number",
                  value: period,
                  onChange: (e) => {
                    this.setState({ period: e.target.value });
                  },
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem xs={12} sm={12} md={3}>
            <br />

            {/* <InputLabel>
                {locationObject.pricingOption
                  ? locationObject.pricingOption.name + " (s)"
                  : ""}
              </InputLabel> */}
            <TextField
              label="Period Option"
              size="small"
              variant="outlined"
              formControlProps={{
                fullWidth: false,
              }}
              min={1}
              inputProps={{
                type: "text",
                disabled: true,
                value: locationObject.pricingOption
                  ? locationObject.pricingOption.name + " (s)"
                  : "",
              }}
            />
          </GridItem>

          <GridItem xs={12} sm={12} md={6}>
            <FormControlLabel
              style={{ marginTop: 20, fontSize: "1rem" }}
              control={
                <Checkbox
                  tabIndex={-1}
                  onClick={() =>
                    this.setState({ notApplicable: !notApplicable })
                  }
                  checkedIcon={<Check className={classes.checkedIcon} />}
                  icon={<Check className={classes.uncheckedIcon} />}
                  classes={{
                    checked: classes.checked,
                    root: classes.checkRoot,
                  }}
                />
              }
              classes={{ label: classes.label, root: classes.labelRoot }}
              label="Not Applicable ?"
            />
          </GridItem>
        </GridContainer>

        <GridContainer justify="flex-end">
          <GridItem xs={12} sm={12} md={6}>
            {/* <CustomInput
              labelText="Value"
              id="value"
              formControlProps={{
                fullWidth: true,
              }}
              min={1}
              inputProps={{
                type: "number",
                value: period,
                onChange: (e) => {
                  this.setState({ period: e.target.value });
                },
              }}
            /> */}

            {/*<FormControl variant="outlined" fullWidth className={classes.selectFormControl}>
                            <InputLabel
                                htmlFor="simple-select"
                                className={classes.selectLabel}
                            >
                                Period Option
                            </InputLabel>
                            <Select
                                MenuProps={{
                                    className: classes.selectMenu,
                                    classes: { paper: classes.selectPaper }
                                }}
                                classes={{
                                    select: classes.select
                                }}
                                disabled={notApplicable}
                                value={locationObject.pricingOption || ''}
                                onChange={value => {
                                    this.setState({periodValue: value.target.value})
                                }}
                                inputProps={{
                                    name: "simpleSelect",
                                    id: "simple-select"
                                }}
                            >
                                <MenuItem
                                    disabled
                                    classes={{
                                        root: classes.selectMenuItem
                                    }}
                                >
                                    Choose a period
                                </MenuItem>
                                {pricingOptions.map((period, index) => {
                                    return(
                                        <MenuItem key={index}
                                                  classes={{
                                                      root: classes.selectMenuItem,
                                                  }}
                                                  value={period.id}
                                        >
                                            {period.name}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>*/}
          </GridItem>
          {/* <GridItem xs={12} sm={12} md={6}>
            <FormControlLabel
              style={{ marginTop: 20 }}
              control={
                <Checkbox
                  tabIndex={-1}
                  onClick={() =>
                    this.setState({ notApplicable: !notApplicable })
                  }
                  checkedIcon={<Check className={classes.checkedIcon} />}
                  icon={<Check className={classes.uncheckedIcon} />}
                  classes={{
                    checked: classes.checked,
                    root: classes.checkRoot,
                  }}
                />
              }
              classes={{ label: classes.label, root: classes.labelRoot }}
              label="Not Applicable ?"
            />
          </GridItem> */}
        </GridContainer>
        {/*<GridContainer justify="flex-end">
                    <GridItem xs={12} sm={12} md={3}>
                        <br />
                        <FormControl fullWidth>
                            <Datetime
                                timeFormat={false}
                                isValidDate={ valid }
                                value={startDate}
                                inputProps={{
                                    placeholder: "Start Date",
                                }}
                                onChange={(e) => this.setState({startDate: e})}
                            />
                        </FormControl>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={3}>
                        <br />
                        <FormControl fullWidth>
                            <Datetime
                                timeFormat={false}
                                isValidDate={ this.validEnd }
                                value={endDate}
                                inputProps={{
                                    placeholder: "End Date",
                                }}
                                onChange={(e) => this.setState({endDate: e})}
                            />
                        </FormControl>
                    </GridItem>
                </GridContainer>*/}
        <GridContainer justify="flex-end" style={{ paddingTop: "1rem" }}>
          <GridItem xs={12} sm={12} md={12}>
            <FormControl
              fullWidth
              className={classes.margin}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-amount">
                Additional Notes (optional)
              </InputLabel>
              <OutlinedInput
                labelWidth={210}
                variant="outlined"
                // style={{ witdth: "100%" }}

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
                  placeholder: "Additional Notes",
                }}
              />
            </FormControl>
          </GridItem>
        </GridContainer>
        <GridContainer justify="flex-start">
          <GridItem xs={12} sm={12} md={6}>
            <FormControl
              style={{ marginTop: "1.2rem" }}
              fullWidth
              className={classes.margin}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-amount">
                Voucher Code? (optional)
              </InputLabel>
              <OutlinedInput
                size="small"
                labelWidth={180}
                variant="outlined"
                id="voucher"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: "text",
                  value: voucher,
                  onChange: (e) => {
                    this.setState({ voucher: e.target.value });
                  },
                }}
              />
            </FormControl>
          </GridItem>
        </GridContainer>
        <br />
        <br />
        <br />
        {error && !this.state.noticeModal && (
          <GridContainer justify="flex-end">
            <GridItem xs={12} sm={12} md={12}>
              <p style={{ color: "#ef5350", fontWeight: "bold" }}>
                {message || ""}
              </p>
            </GridItem>
          </GridContainer>
        )}
        <GridContainer justify="flex-end">
          <GridItem xs={12} sm={12} md={12}>
            <Button
              default
              style={{ width: "50%", backgroundColor: "#0b28ba" }}
              onClick={() => this.handleSubmit()}
            >
              {`TOTAL TO PAY ${numberWithCommas(
                formatCurrency(total, this.props.exchange, this.props.currency)
              )}`}
            </Button>
          </GridItem>
        </GridContainer>
      </>
    );
  }

  renderConfirmation(classes, location) {
    const {
      noticeModal,
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
      periodValue,
      voucher,
      vouch,
    } = this.state;
    const {
      locationObject,
      loading,
      submitBooking,
      error,
      message,
      success,
      pricingOptions,
    } = this.props;
    //let pricing = _.findWhere(pricingOptions, { id: periodValue});
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

    const callback = () => {
      submitBooking(
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
        vouch
      );
    };
    return (
      <GridContainer>
        <GridItem xs={12} sm={6} md={6} lg={4}>
          {/* NOTICE MODAL START */}
          <Dialog
            classes={{
              root: classes.modalRoot,
              // paper: classes.modal,
            }}
            // fullWidth={true}
            maxWidth={"md"}
            open={noticeModal}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => this.setState({ noticeModal: false })}
            aria-labelledby="notice-modal-slide-title"
            aria-describedby="notice-modal-slide-description"
          >
            <DialogTitle
              id="notice-modal-slide-title"
              disableTypography
              className={classes.modalHeader}
            >
              <Button
                simple
                className={classes.modalCloseButton}
                key="close"
                aria-label="Close"
                onClick={() => this.setState({ noticeModal: false })}
              >
                {" "}
                <Close className={classes.modalClose} />
              </Button>
              <h4 className={classes.modalTitle}>Confirmation</h4>
            </DialogTitle>
            <DialogContent
              id="notice-modal-slide-description"
              className={classes.modalBody}
            >
              <Instruction
                title="Adspace Details"
                text={
                  <>
                    <span>
                      Name: {"  "} {location.name || ""} <br />
                    </span>
                    <span>
                      Category: {"  "}{" "}
                      {location.category ? location.category.name : ""} <br />
                    </span>
                    <span>
                      Sub Category: {"  "}{" "}
                      {location.subCategory ? location.subCategory.name : ""}
                      <br />
                    </span>
                    <span>
                      Price: {"  "} N
                      {numberWithCommas(
                        location.discountedPrice
                          ? location.discountedPrice.checked
                            ? location.discountedPrice.value
                            : location.price || ""
                          : location.price || ""
                      )}{" "}
                      <br />
                    </span>
                  </>
                }
                image={
                  location.resizedImages
                    ? location.resizedImages[0] || ""
                    : location.images
                    ? location.images[0] || ""
                    : ""
                }
                className={classes.instructionNoticeModal}
                imageClassName={classes.imageNoticeModal}
              />
              <Instruction
                title="Order Details"
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
                        <h6 style={{ textAlign: "left" }}>Campaign Title:</h6>
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
                        <h6>{campaignTitle || ""}</h6>
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
                          <h6>Quantity:</h6>
                        </div>
                        <div style={{ flex: 1, justifyContent: "flex-start" }}>
                          <h6>{quantity || ""}</h6>
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
                          <h6>Start Date:</h6>
                        </div>
                        <div style={{ flex: 1, justifyContent: "flex-start" }}>
                          <h6>
                            {startDate
                              ? moment(startDate.toDate()).format("DD/MM/YYYY")
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
                          <h6>Period:</h6>
                        </div>
                        <div style={{ flex: 1, justifyContent: "flex-start" }}>
                          <h6>
                            {notApplicable
                              ? "Not applicable"
                              : period +
                                ` ${
                                  location.pricingOption
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
                        <h6 style={{ textAlign: "left" }}>Voucher Code:</h6>
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
                        <h6>{vouch ? vouch.name : ""}</h6>
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
                        <h6 style={{ textAlign: "left" }}>Sub Total:</h6>
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
                        <h6
                          style={{
                            textAlign: "center",
                            color: "#000",
                            textDecoration: "line-through",
                            textDecorationStyle: "double",
                          }}
                        >
                          N
                        </h6>
                        <h6 style={{ textAlign: "center", color: "#000" }}>
                          {numberWithCommas(total)}
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
                        <h6 style={{ textAlign: "left" }}>Voucher:</h6>
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
                        <h6
                          style={{
                            textAlign: "center",
                            color: "#000",
                            textDecoration: "line-through",
                            textDecorationStyle: "double",
                          }}
                        >
                          N
                        </h6>
                        <h6 style={{ textAlign: "center", color: "#000" }}>
                          {`${
                            voucher === ""
                              ? "0.00"
                              : numberWithCommas(total * (vouch.value / 100))
                          }`}
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
                        <h6 style={{ textAlign: "left" }}>Total:</h6>
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
                        <h6
                          style={{
                            textAlign: "center",
                            color: "#000",
                            textDecoration: "line-through",
                            textDecorationStyle: "double",
                          }}
                        >
                          N
                        </h6>
                        <h6 style={{ textAlign: "center", color: "#000" }}>
                          {numberWithCommas(
                            total -
                              (voucher === "" ? 0 : total * (vouch.value / 100))
                          )}
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
            </DialogContent>
            <DialogActions
              className={classes.modalFooter + " " + classes.modalFooterCenter}
            >
              <Link to="/mediaplanning">
                <Button round color="success">
                  Continue Browsing
                </Button>
              </Link>
            </DialogActions>
          </Dialog>
          {/* NOTICE MODAL END */}
        </GridItem>
      </GridContainer>
    );
  }

  renderPrice = (discountedPrice = {}, location) => {
    if (!discountedPrice.checked) {
      return (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <h4 style={{ color: "#000", fontSize: 15 }}>{` ${numberWithCommas(
            formatCurrency(
              location.price || 0,
              this.props.exchange,
              this.props.currency
            )
          )}`}</h4>
          {location.pricingOption && location.pricingOption.name && (
            <h4 style={{ color: "#000", fontSize: 13 }}>{`${
              location.pricingOption
                ? " (per " + location.pricingOption.name
                : ""
            })`}</h4>
          )}
        </div>
      );
    } else {
      return (
        <>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {/* <h4
              style={{
                fontSize: 13,
                textDecorationStyle: "double",
                marginRight: 2,
                color: '#000'
              }}
            >
              Starting from
            </h4> */}
            <h4 style={{ fontSize: 13 }}>
              {`${numberWithCommas(formatCurrency(location.price || 0))}`}{" "}
              {location.pricingOption ? location.pricingOption.name : ""}
            </h4>
          </div>

          <h4
            style={{
              textDecoration: "line-through",
              fontWeight: "normal",
              color: dangerColor[1],
              fontSize: 12,
              //color: '#000'
            }}
          >
            {formatCurrency(location.price || 0)}
          </h4>
        </>
      );
    }
  };

  renderUnavailableDates(unavailableDates = []) {
    return unavailableDates.map((date, index) => {
      return (
        <>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <h6>Unavailable Date Range</h6>
            </GridItem>
          </GridContainer>
          <GridContainer key={index}>
            <GridItem xs={12} sm={12} md={6}>
              <FormControl variant="outlined" fullWidth>
                <Datetime
                  style={{ borderWidth: 0 }}
                  timeFormat={false}
                  value={moment.unix(date.start.seconds).format("DD/MM/YYYY")}
                  inputProps={{
                    placeholder: "Start Date",
                    disabled: true,
                  }}
                />
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <FormControl variant="outlined" fullWidth>
                <Datetime
                  style={{ borderWidth: 0 }}
                  timeFormat={false}
                  value={moment.unix(date.end.seconds).format("DD/MM/YYYY")}
                  inputProps={{
                    placeholder: "Start Date",
                    disabled: true,
                  }}
                />
              </FormControl>
            </GridItem>
          </GridContainer>
        </>
      );
    });
  }

  renderSimilarAds(classes) {
    const { locationsArray } = this.props;

    if (locationsArray && locationsArray.length > 0) {
      return locationsArray.slice(0, 3).map((location, index) => {
        return (
          <GridItem
            xs={4}
            sm={10}
            md={4}
            lg={4}
            style={{ textAlign: "center" }}
            key={index}
          >
            <Link
              style={{
                display: "inline-block",
                width: "100%",
                height: "600px",
              }}
              to={{ pathname: `/location/${location.id}` }}
            >
              <Card
                product
                className="card"
                style={{ height: "100%", textAlign: "center" }}
              >
                <img
                  src={
                    location.resizedImages
                      ? location.resizedImages[0] || ""
                      : location.images
                      ? location.images[0] || ""
                      : ""
                  }
                  alt={
                    location.name
                      ? substringText(location.name, 53).toLowerCase()
                      : ""
                  }
                  height="250px"
                />

                <CardBody>
                  <h1
                    style={{
                      textTransform: "capitalize",
                      fontSize: 20,
                      lineHeight: "25px",
                      fontWeight: "Bold",
                      color: "#0b28ba",
                    }}
                  >
                    {location.name
                      ? substringText(location.name, 53).toLowerCase()
                      : ""}
                  </h1>
                  <Info>
                    <h5 style={{ color: "#000", fontSize: 18 }}>
                      {location.category ? location.category.name || "" : ""}
                    </h5>
                  </Info>

                  <p style={{ color: "#000", fontSize: 18, marginTop: 15 }}>
                    {location
                      ? !location.traffic
                        ? `Traffic: ${0}`
                        : `Traffic: ${location.traffic
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                      : 0}{" "}
                    {location && location.trafficOption
                      ? location.trafficOption.name
                      : ""}
                  </p>

                  <p style={{ color: "#000", fontSize: 18, marginTop: 15 }}>
                    {location.size
                      ? "Size: " + location.size || ""
                      : "Duration (seconds): " + location.duration ||
                        "" + " , Quantity: " + location.quantity ||
                        ""}{" "}
                    {location && location.sizingOption
                      ? location.sizingOption.name
                      : ""}
                  </p>

                  <div className={classes.price}>
                    <p
                      style={{
                        fontWeight: "bold",
                        marginTop: 15,
                        fontSize: 18,
                        color: "#0a24a7",
                      }}
                    >
                      {" "}
                      <span style={{ color: "#0a24a7" }}>Admatch: </span>
                      {` ${location.count ? (location.count / 5) * 100 : "0"}%`}
                    </p>
                  </div>
                </CardBody>

                <div className="card-footer">
                  <div
                    className={classes.price}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: "40px",
                    }}
                  >
                    <div>
                      {this.renderPrice(location.discountedPrice, location)}

                      {location.discountedPrice &&
                      location.discountedPrice.value !== 0 ? (
                        <p
                          style={{
                            textAlign: "left",
                            fontSize: 15,
                            color: "red",
                            textDecoration: "line-through",
                            marginTop: "-15px",
                          }}
                        >{`${numberWithCommas(
                          location.discountedPrice.value
                        )}`}</p>
                      ) : (
                        ""
                      )}
                    </div>

                    <div style={{ color: "#000", fontSize: "13px" }}>
                      <Place style={{ fontSize: "20px" }} />

                      {`${location.city ? location.city.name || "" : ""}, ${
                        location.state ? location.state.name || "" : ""
                      }`}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </GridItem>
        );
      });
    }
  }

  renderSimilarPrice(discountedPrice = null, location) {
    if (!discountedPrice.checked) {
      return (
        <div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <h4
              style={{
                fontSize: 15,
                textDecoration: "line-through",
                textDecorationStyle: "double",
              }}
            >
              N
            </h4>
            <h4 style={{ fontSize: 15 }}>{` ${numberWithCommas(
              location.price || 0
            )}`}</h4>
          </div>
          <div>
            <h4 style={{ fontSize: 9, color: infoColor[1] }}>{`${
              location.pricingOption ? "per " + location.pricingOption.name : ""
            }`}</h4>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <h4
              style={{
                fontSize: 15,
                textDecoration: "line-through",
                textDecorationStyle: "double",
              }}
            >
              N
            </h4>
            <h4 style={{ fontSize: 15 }}>{`${numberWithCommas(
              location.discountedPrice.value || 0
            )}`}</h4>
          </div>
          <div>
            <h4
              style={{
                textDecoration: "line-through",
                fontWeight: "normal",
                color: dangerColor[1],
                fontSize: 12,
              }}
            >
              {`N ${numberWithCommas(location.price || 0)}`}
            </h4>
            <h4 style={{ fontSize: 9, color: infoColor[1] }}>{`${
              location.pricingOption ? "per " + location.pricingOption.name : ""
            }`}</h4>
          </div>
        </div>
      );
    }
  }

  render() {
    const {
      classes,
      locationObject,
      loading,
      error,
      message,
      isAuthenticated,
      user,
      logOut,
      locationShowBookingDetails,
      showBookingDetails,
      success,
      order,
    } = this.props;

    const routeTo = this.props.location
      ? this.props.location.pathname || ""
      : "/";
    if (!isAuthenticated && showBookingDetails) {
      return <Redirect to="/login" />;
    }

    document.title = `Adspace.ng ${
      locationObject ? locationObject.name || "" : ""
    }  ${
      locationObject
        ? locationObject.category
          ? locationObject.category.name || ""
          : ""
        : ""
    } ${
      locationObject
        ? locationObject.subCategory
          ? locationObject.subCategory.name || ""
          : ""
        : ""
    } |${
      locationObject
        ? locationObject.city
          ? locationObject.city.name || ""
          : ""
        : ""
    } | ${
      locationObject
        ? locationObject.state
          ? locationObject.state.name || ""
          : ""
        : ""
    }`;

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
        className={classes.productPage}
        style={{ height: "100vh", overflow: "auto" }}
      >
        <NewNavbar
          isAuthenticated={isAuthenticated}
          authUser={user}
          logOutUser={() => logOut()}
        />
        <Parallax
          image={
            locationObject.resizedImages
              ? locationObject.resizedImages || []
              : locationObject.images || []
          }
          //filter="rose"
          className={classes.pageHeader}
        ></Parallax>
        <div className={classNames(classes.section, classes.sectionGray)}>
          <div className={classes.container}>
            <div className={classNames(classes.main, classes.mainRaised)}>
              <GridContainer>
                <GridItem md={6} sm={12}>
                  <GridContainer>
                    <GridItem md={12} sm={12}>
                      <ImageGallery
                        showFullscreenButton={false}
                        showPlayButton={false}
                        startIndex={0}
                        items={this.cal(
                          locationObject.resizedImages
                            ? locationObject.resizedImages || []
                            : locationObject.images
                            ? locationObject.images
                            : [],
                          locationObject.resizedImages
                            ? locationObject.resizedImages[0] || ""
                            : locationObject.images
                            ? locationObject.images[0] || ""
                            : ""
                        )}
                      />
                    </GridItem>
                    <GridItem md={12} sm={12} style={{ marginTop: 20 }}>
                      {this.renderUnavailableDates(
                        locationObject.unavailableDates
                      )}
                    </GridItem>
                    <GridItem md={12} sm={12} style={{ marginTop: 20 }}>
                      {/* {this.renderLocTags()} */}
                      {this.renderInterest()}
                      {this.renderAges()}
                      {this.renderGender()}
                    </GridItem>
                  </GridContainer>
                </GridItem>
                <GridItem md={6} sm={6}>
                  <GridContainer>
                    <GridItem md={12} sm={12}>
                      <h1
                        style={{
                          textTransform: "capitalize",
                          fontSize: 33,
                          lineHeight: "35px",
                          fontWeight: "Bold",
                          color: "#0b28ba",
                        }}
                      >
                        {locationObject.name
                          ? substringText(locationObject.name, 53).toLowerCase()
                          : ""}
                      </h1>
                      {this.renderPrice(
                        locationObject.discountedPrice,
                        locationObject
                      )}
                      <p style={{ color: "#000", fontSize: 14 }}>
                        {locationObject
                          ? !locationObject.traffic
                            ? `Traffic: ${0}`
                            : `Traffic: ${locationObject.traffic
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                          : 0}{" "}
                        {locationObject && locationObject.trafficOption
                          ? locationObject.trafficOption.name
                          : ""}
                      </p>
                      <div className={classes.price}>
                        <p
                          style={{
                            fontWeight: "bold",
                            marginTop: 15,
                            fontSize: 18,
                            color: "#0a2094",
                          }}
                        >
                          {" "}
                          <span
                            style={{ color: "#0a2094", fontWeight: "bold" }}
                          >
                            Admatch:{" "}
                          </span>
                          {` ${
                            locationObject.count
                              ? (locationObject.count / 5) * 100
                              : "0"
                          }%`}
                        </p>
                      </div>
                      <Accordion
                        active={0}
                        activeColor="rose"
                        collapses={[
                          {
                            title: "Adspace Description",
                            content: (
                              <>
                                <p style={{ color: "#000", fontSize: 14 }}>
                                  {locationObject.size
                                    ? "Location Size (sqm): " +
                                        locationObject.size &&
                                      locationObject.size !== "undefined"
                                    : "Duration (seconds): " +
                                        locationObject.duration || ""}
                                </p>
                                <p style={{ color: "#000", fontSize: 14 }}>
                                  {`${
                                    locationObject.quantity
                                      ? "Quantity: " + locationObject.quantity
                                      : ""
                                  }`}
                                </p>
                                <p style={{ color: "#000", fontSize: 14 }}>
                                  {`${
                                    locationObject.size
                                      ? "Size: " + locationObject.quantity
                                      : ""
                                  }`}{" "}
                                  {locationObject && locationObject.sizingOption
                                    ? locationObject.sizingOption.name
                                    : ""}
                                </p>
                                <p style={{ color: "#000", fontSize: 14 }}>
                                  {`${
                                    locationObject.category
                                      ? "Adtype: " +
                                        locationObject.category.name
                                      : ""
                                  }`}
                                </p>
                                <p style={{ color: "#000", fontSize: 14 }}>
                                  {`${
                                    locationObject.category
                                      ? "Sub-Adtype: " +
                                        locationObject.subCategory.name
                                      : ""
                                  }`}
                                </p>
                                <p style={{ color: "#000", fontSize: 14 }}>
                                  {`${
                                    locationObject.state
                                      ? "State: " + locationObject.state.name
                                      : ""
                                  }`}
                                </p>
                                <p style={{ color: "#000", fontSize: 14 }}>
                                  {`${
                                    locationObject.city
                                      ? "City: " + locationObject.city.name
                                      : ""
                                  }`}
                                </p>
                                <h4 style={{ color: "#000", fontSize: 18 }}>
                                  Average Target Audience
                                </h4>

                                <p style={{ color: "#000", fontSize: 14 }}>
                                  {`${locationObject ? "Interest: " : ""}`}
                                  {this.renderInterest(locationObject)}
                                </p>

                                <p style={{ color: "#000", fontSize: 14 }}>
                                  {`${locationObject ? "Age Group: " : ""}`}
                                  {this.renderAges(locationObject)}
                                </p>

                                <p style={{ color: "#000", fontSize: 14 }}>
                                  {`${locationObject ? "Gender: " : ""}`}
                                  {this.renderGender(locationObject)}
                                </p>

                                <p style={{ color: "#000", fontSize: 14 }}>
                                  {/* {`${locationObject
                                      ? "Landmark: "
                                      : ""
                                    }`} */}
                                  {this.checkLandmark(locationObject)}
                                </p>
                              </>
                            ),
                          },
                          {
                            title: "Details and Care",
                            content: (
                              <>
                                <p>{`${
                                  locationObject.remarks
                                    ? locationObject.remarks
                                    : ""
                                }`}</p>
                              </>
                            ),
                          },
                        ]}
                      />
                      {!showBookingDetails && (
                        <GridContainer className={classes.pullRight}>
                          <Link to="/mediaplanning">
                            <Button
                              // round
                              // color="rose"
                              style={{
                                width: "100%",
                                backgroundColor: "#0b28ba",
                              }}
                            >
                              Continue
                            </Button>
                          </Link>
                        </GridContainer>
                      )}
                    </GridItem>
                    <GridItem md={12} sm={12}>
                      {showBookingDetails && <>{this.renderBookingDetails()}</>}
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer>
              {this.renderConfirmation(classes, locationObject)}
            </div>
          </div>
        </div>
        {/* {locationObject.geolocation &&
                <div className={classes.bigMap}>
                    <CustomSkinMap
                        latitude={locationObject.geolocation.latitude || 0 }
                        longitude={locationObject.geolocation.longitude || 0 }
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyClA3lhGpngk8O6B1fgBhXznUsnnJYSd1g"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={
                            <div
                                style={{
                                    height: `100%`,
                                    borderRadius: "6px",
                                    overflow: "hidden"
                                }}
                            />
                        }
                        mapElement={<div style={{ height: `100%` }} />}
                    />
                </div>
                } */}

        <div id="iframeMap">
          <div
            style={{
              height: `100%`,
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            {this.getFrame(locationObject)}
          </div>
        </div>

        <div className={classNames(classes.section, classes.sectionGray)}>
          <div className={classes.container}>
            <div className={classes.relatedProducts}>
              <h3 className={classNames(classes.title, classes.textCenter)}>
                You may also be interested in:
              </h3>
              <GridContainer>{this.renderSimilarAds(classes)}</GridContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ location, login, booking, paymentType }) => {
  const {
    locationObject,
    showBookingDetails,
    locationsArray,
    pricingOptions,
    vouchers,
  } = location;
  const { loading, error, message, success, order } = booking;
  const { isAuthenticated, user } = login;
  const { currency, exchange } = paymentType;
  return {
    loading,
    error,
    message,
    locationObject,
    isAuthenticated,
    user,
    showBookingDetails,
    success,
    order,
    locationsArray,
    pricingOptions,
    vouchers,
    currency,
    exchange,
  };
};

export default connect(
  mapStateToProps,
  {
    setLocationObject,
    getLocation,
    setAuthenticated,
    logOut,
    locationShowBookingDetails,
    displayBookingError,
    submitBooking,
    resetBookingProps,
    getSimilarLocations,
  }
)(withStyles(productStyle)(Location2));
