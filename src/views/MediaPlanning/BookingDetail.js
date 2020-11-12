import React from "react";
import Button from "../../components/CustomButtons/Button";
import GridContainer from "../../components/Grid/GridContainer";
import NumericInput from "react-numeric-input";
import { connect } from "react-redux";
import "./book.css";
import { DialogContent, LinearProgress, withStyles } from "@material-ui/core";
import GridItem from "../../components/Grid/GridItem";
import ReactTable from "react-table";
import moment from "moment";
import CardBody from "../../components/Card/CardBody";
import Card from "../../components/Card/Card";
import { numberWithCommas, formatCurrency } from "../../utils";
import { Add, Remove, Place, Check, AttachFile } from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { CircularProgress } from "@material-ui/core";
import CustomInput from "../../components/CustomInput/CustomInput";
import { useSelector } from "react-redux";
import CheckoutStripe from "views/Stripe/stripe";
import CheckoutPaystack from "views/Paystack";
import Datetime from "react-datetime";
import { func } from "prop-types";
import CustomFileInput from "../../components/CustomFileInput/CustomFileInput";
import { download } from "../../exportJSON2CSV";
import { getAuth, getDb } from "../../firebase";
import { Link, Redirect } from "react-router-dom";
import MediaAlertDialog from "views/Modal/MediaPlanningNote";
// import { addReduceQuantityByInput } from "actions";
import { addReduceQuantityByInput } from "../../actions";
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

let yesterday = Datetime.moment().subtract(1, "day");
let valid = function(current) {
  return current.isAfter(yesterday);
};

const BookingDetails = ({
  classes,
  locations,
  toggle,
  success,
  totalPrice,
  qtyAddReduce,
  submitUnpaid,
  submit,
  addReduceQuantityByInput,
  campaignTitle,
  changePeriod,
  notApplicableChange,
  saveLoader,
  saveMessage,
  saveError,
  campaignTitleChange,
  showError,
  startDate,
  endDate,
  startDateChange,
  endDateChange,
  openRow,
  openRowChange,
  onFileInputChange,
  savePlan,
  originalLocationsArray,
  // totalPrice,
  // formatCurrency
}) => {
  const { exchange, currency } = useSelector((state) => state.paymentType);
  let vat = (7.5 / 100) * totalPrice;
  totalPrice = totalPrice + vat;

  if (success) {
    return (
      <Redirect
        exact
        to={{
          pathname: "/orderSummary",
        }}
      />
    );
  }

  function bookingDetails(props) {
    if (locations && locations.length > 0) {
      return locations.map((location, index) => {
        return {
          key: location.id,
          location_name: location.name || "",
          price: formatCurrency(
            location.discountedPrice
              ? location.discountedPrice.checked
                ? location.discountedPrice.value
                : location.price
              : location.price,
            exchange,
            currency
          ),
          state: location.state ? location.state.name || "" : "",
          location: location,
          quantity: (
            <span key={index}>
              {/* {location.userAddedQuantity || 0} */}
              {` `}
              <div className="capital">
                <Button
                  color="info"
                  size="sm"
                  round
                  className={classes.firstButton}
                  onClick={() =>
                    location.userAddedQuantity > 0
                      ? qtyAddReduce(location.id, "reduce")
                      : ""
                  }
                  style={{ height: 20, width: 20, background: "#2962ff" }}
                >
                  <Remove />
                </Button>
                <NumericInput
                  // className="form-control"
                  value={location.userAddedQuantity || 0}
                  min={0}
                  max={location.quantity}
                  strict={true}
                  step={1}
                  precision={0}
                  size={1}
                  style={{
                    input: {
                      paddingRight: 0,
                      height: 30,
                      padding: 0,
                    },
                  }}
                  onChange={(value) =>
                    addReduceQuantityByInput(location.id, location, value)
                  }
                />
                <Button
                  color="info"
                  size="sm"
                  round
                  className={classes.lastButton}
                  onClick={() =>
                    location.userAddedQuantity >= location.quantity
                      ? showError(
                          "Note: Quantity increment will stop when it reaches the maximum quantity for the selected location"
                        )
                      : qtyAddReduce(location.id, "add")
                  }
                  style={{ height: 20, width: 20, background: "#2962ff" }}
                >
                  <Add />
                </Button>
              </div>
            </span>
          ),
          city: location.city ? location.city.name || "" : "",
          category: location.category ? location.category.name || "" : "",
          image: (
            <div className={classes.imgContainer} key={index}>
              <img
                src={
                  location.resizedImages
                    ? location.resizedImages[0] || ""
                    : location.images
                    ? location.images[0] || ""
                    : ""
                }
                alt="..."
                className={classes.img}
              />
            </div>
          ),
          /*period: (
            <FormControl
              variant="outlined"
              fullWidth
              className={classes.selectFormControl}
            >
              <Select
                MenuProps={{
                  className: classes.selectMenu,
                  classes: { paper: classes.selectPaper },
                }}
                classes={{
                  select: classes.select,
                }}
                disabled={location.notApplicable}
                value={location.period}
                onChange={(value) => {
                  changePeriod(location.id, value.target.value);
                }}
                inputProps={{
                  name: "simpleSelect",
                  id: "simple-select",
                }}
              >
                <MenuItem
                  disabled
                  classes={{
                    root: classes.selectMenuItem,
                  }}
                >
                  Choose a period
                </MenuItem>
                {PERIODS.map((period, index) => {
                  return (
                    <MenuItem
                      key={index}
                      classes={{
                        root: classes.selectMenuItem,
                      }}
                      value={period.id}
                    >
                      {period.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          ),
          notApplicable: (
            <FormControlLabel
              control={
                <Checkbox
                  tabIndex={-1}
                  checked={location.notApplicable}
                  onClick={() => notApplicableChange(location.id)}
                  checkedIcon={<Check className={classes.checkedIcon} />}
                  icon={<Check className={classes.uncheckedIcon} />}
                  classes={{
                    checked: classes.checked,
                    root: classes.checkRoot,
                  }}
                />
              }
              classes={{ label: classes.label, root: classes.labelRoot }}
            />
          ),*/
        };
      });
    } else return [];
  }

  function moreInfo(row) {
    let locationObject = row.original.location;
    const allThings = originalLocationsArray.filter(
      (element) => element.userAddedQuantity > 0
    );
    return (
      <div>
        <GridContainer>
          <GridItem md={12} sm={7} xs={7}>
            <div
              style={{
                marginTop: 35,
                marginRight: 15,
                backgroundColor: "white",
              }}
              className="try"
            >
              <div
                style={{
                  height: 60,
                  backgroundColor: "#fff",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <button
                  className="btn  btn-sm"
                  onClick={() => handleExport()}
                >
                  EXPORT YOUR PLAN
                </button>
                <button
                  className="btn  btn-sm"
                  onClick={() => savePlan()}
                >
                  SAVE THIS PLAN
                </button>
                <div>
                  <h4 style={{ fontWeight: 600 }}>
                    Total |{" "}
                    <span
                      style={{
                        textDecoration: "underline",
                        color: "blue",
                      }}
                    >
                      {" "}
                      {allThings.length} Selected
                    </span>
                  </h4>
                </div>

                <h4 className={`${totalPrice === 0 ? "nav_con" : "nav_con2"}`}>
                  <span>
                    {formatCurrency(totalPrice || 0, exchange, currency)}
                  </span>
                </h4>
                <button
                  className="btn btn-primary btn-md"
                  onClick={() => this.handleBookClick()}
                  style={{
                    marginRight: 20,
                    color: "black",
                    background: "yellow",
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </GridItem>
          <GridItem md={12} sm={9} xs={9}>
            <GridContainer>{/*  */}</GridContainer>
          </GridItem>
        </GridContainer>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              // paddingLeft: 30,
            }}
          >
            <p style={{ color: "#000", fontSize: 14 }}>
              {`${
                locationObject.size
                  ? "Location Size (sqm): " + locationObject.size
                  : ""
              }`}
            </p>
            <p style={{ color: "#000", fontSize: 14 }}>
              {`${
                locationObject.dimension
                  ? "Location Dimensions: " +
                    (locationObject.dimension.length + " m" || "0 m") +
                    " * " +
                    (locationObject.dimension.breadth + " m" || "0 m")
                  : ""
              }`}
            </p>
            <p style={{ color: "#000", fontSize: 14 }}>
              {`${
                locationObject.quantity
                  ? "Quantity: " + locationObject.quantity
                  : ""
              }`}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 15,
              // paddingLeft: 30,
            }}
          >
            <p style={{ color: "#000", fontSize: 14 }}>
              {`${
                locationObject.category
                  ? "Adtype: " + locationObject.category.name
                  : ""
              }`}
            </p>
            <p style={{ color: "#000", fontSize: 14 }}>
              {`${
                locationObject.category
                  ? "Sub-Adtype: " + locationObject.subCategory.name
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
                locationObject.city ? "City: " + locationObject.city.name : ""
              }`}
            </p>
          </div>
          <div>
            <Button color="info">
              <Link
                // to={`https://www.google.com/maps/search/?api=1&query=${locationObject.geolocation.latitude},${locationObject.geolocation.longitude}`}
                to={`/mediaplanning-details/${locationObject.id}`}
                target="_blank"
                style={{ color: "#fff" }}
              >
                Click to see details
              </Link>
            </Button>
          </div>
          <div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingLeft: 20,
                }}
              >
                <FormControl variant="outlined" fullWidth>
                  <Datetime
                    style={{ borderWidth: 0 }}
                    timeFormat={false}
                    isValidDate={valid}
                    value={locationObject.startDate || ""}
                    inputProps={{
                      placeholder: "Start Date",
                    }}
                    onChange={(e) =>
                      startDateChange(e, locationObject, row.index)
                    }
                  />
                </FormControl>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingLeft: 20,
                }}
              >
                <FormControl variant="outlined" fullWidth>
                  <Datetime
                    style={{ borderWidth: 0 }}
                    timeFormat={false}
                    isValidDate={valid}
                    value={locationObject.endDate || ""}
                    inputProps={{
                      placeholder: "End Date",
                    }}
                    onChange={(e) =>
                      endDateChange(e, locationObject, row.index)
                    }
                  />
                </FormControl>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingTop: 30,
                  paddingLeft: 30,
                }}
                className="cust"
              >
                <CustomFileInput
                  formControlProps={{
                    fullWidth: true,
                  }}
                  value={
                    locationObject.adContent
                      ? locationObject.adContent.file || undefined
                      : undefined
                  }
                  inputProps={{
                    placeholder: `${
                      locationObject.adContent
                        ? locationObject.adContent.name ||
                          "Upload Ad Content..."
                        : "Upload Ad Content..."
                    }`,
                  }}
                  endButton={{
                    buttonProps: {
                      round: true,
                      // color: "primary",
                      justIcon: true,
                      fileButton: true,
                    },
                    icon: <AttachFile />,
                  }}
                  onChange={(inputFiles, inputFileNames) =>
                    onFileInputChange(
                      inputFiles,
                      inputFileNames,
                      locationObject
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  async function handleExport() {
    let currentUser = getAuth().currentUser;
    let userDoc = await getDb()
      .collection("users")
      .doc(currentUser.email)
      .get();
    let userData = userDoc.data();
    userData["id"] = userDoc.id;

    download(locations, exchange, currency, startDate, userData);
  }

  const object = {};
  object[openRow] = true;
  return (
    <GridContainer
      justify="center"
      style={{ marginTop: 90, marginBottm: 30, paddingBottom: 30 }}
    >
      <GridItem xs={12} md={12} sm={12}>
        <ReactTable
          data={bookingDetails()}
          filterable
          columns={[
            {
              Header: "",
              accessor: "image",
              headerStyle: { textAlign: "center", fontWeight: 900 },
              sortable: false,
              filterable: false,
            },
            {
              Header: "Adspace Name",
              accessor: "location_name",
              headerStyle: { textAlign: "center", fontWeight: 900 },
              style: { textAlign: "left" },
              sortable: false,
              filterable: false,
            },
            {
              Header: "Adtype",
              accessor: "category",
              headerStyle: { textAlign: "center", fontWeight: 900 },
              style: { textAlign: "center" },
              sortable: false,
              filterable: false,
            },
            {
              Header: "Price",
              accessor: "price",
              headerStyle: { textAlign: "center", fontWeight: 900 },
              Footer: (
                <span>
                  <strong>
                    Total:{" "}
                    {numberWithCommas(
                      formatCurrency(totalPrice, exchange, currency)
                    )}
                  </strong>
                </span>
              ),
              style: { textAlign: "center" },
              sortable: false,
              filterable: false,
            },
            {
              Header: "Qty",
              accessor: "quantity",
              headerStyle: { textAlign: "center", fontWeight: 900 },
              style: { textAlign: "center" },
              sortable: false,
              filterable: false,
            },
          ]}
          defaultExpanded={{ 0: true }}
          defaultPageSize={locations.length}
          showPaginationTop={false}
          showPaginationBottom={false}
          // className="-striped -highlight"
          SubComponent={(row) => moreInfo(row)}
          expanded={object}
          onExpandedChange={(newExpanded, index, event) => {
            openRowChange(index[0]);
          }}
          style={{
            width: "100%",
            overFlow: "hidden",
            padding: 0,
            margin: 0,
            fontWeight: 700,
          }}
        />
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={3}>
            <CustomInput
              labelText="CAMPAIGN / PRODUCT TITLE"
              id="campaign"
              formControlProps={{
                fullWidth: true,
                variant: "outlined",
              }}
              inputProps={{
                type: "text",
                autoFocus: true,
                value: campaignTitle,
                onChange: (e) => {
                  campaignTitleChange(e.target.value);
                },
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: 10,
          }}
        >
          <div style={{ marginTop: 6 }}>
            <CheckoutPaystack
              callback={submit}
              bookingData={{
                amount: totalPrice,
              }}
              disabled={campaignTitle.length < 1 ? true : false}
            />
            {/* {currency === "NGN" ? (
              <CheckoutPaystack
                callback={submit}
                bookingData={{
                  amount: totalPrice,
                }}
                disabled={campaignTitle === "" ? true : false}
              />
            ) : (
                <CheckoutStripe callback={submit} amount={totalPrice} />
              )} */}
          </div>

          <div style={{ marginTop: 6 }}>
            {/* <Button color="info" onClick={submit}>
              Pay with Cheque/Bank Transfer
            </Button> */}
            <MediaAlertDialog callback={submitUnpaid} />
          </div>
        </GridContainer>
      </GridItem>
      {saveLoader && (
        <GridItem
          xs={12}
          sm={12}
          md={12}
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </GridItem>
      )}
      {saveError && (
        <GridItem
          xs={12}
          sm={12}
          md={12}
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p style={{ color: "#ef5350" }}>{saveMessage || ""}</p>
        </GridItem>
      )}
      {/* <div style={{ marginTop: 20, margin: 0, justifyContent: 'flex-start'}}>
          <div
            style={{ display: "flex", alignItems: 'flex-start' }}
          >
            {currency === "NGN" ? (
              <CheckoutPaystack
                callback={submit}
                bookingData={{
                  amount: totalPrice,
                }}
              />
            ) : (
              <CheckoutStripe callback={submit} amount={totalPrice} />
            )}
          </div>
      </div> */}
    </GridContainer>
  );
};

const selectStyles = { menu: (styles) => ({ ...styles, zIndex: 999 }) };

const mapStateToProps = ({
  profile,
  login,
  branding,
  mediaplanning,
  paymentType,
}) => {
  const {
    loading,
    error,
    message,
    isEdit,
    displayName,
    subscribe,
    ordersArray,
    ordersLoader,
    userInfo,
    selectedBrand,
    // success,
  } = profile;
  const { isAuthenticated, user } = login;
  const { agesArray, gendersArray, interestsArray } = branding;
  const { currency, exchange } = paymentType;
  const {
    // loading,
    // error,
    // message,
    locationsArray,
    tagsArray,
    categoriesArray,
    originalLocationsArray,
    totalPrice,
    showMDDetails,
    saveLoader,
    saveMessage,
    saveError,
    success,
    orders,
    orderNos,
    subCategoriesArray,
    statesArray,
    citiesArray,
    openRow,
    savedPlans,
    savedPlan,
  } = mediaplanning;

  return {
    loading,
    error,
    message,
    isAuthenticated,
    user,
    isEdit,
    displayName,
    subscribe,
    ordersArray,
    ordersLoader,
    userInfo,
    agesArray,
    gendersArray,
    interestsArray,
    selectedBrand,
    success,
    locationsArray,

    tagsArray,
    categoriesArray,
    originalLocationsArray,
    totalPrice,
    showMDDetails,
    saveLoader,
    saveMessage,
    saveError,
    success,
    orders,
    orderNos,
    subCategoriesArray,
    statesArray,
    citiesArray,
    currency,
    exchange,
    openRow,
    savedPlans,
    savedPlan,
  };
};

export default connect(
  mapStateToProps,
  {
    addReduceQuantityByInput,
  }
)(withStyles()(BookingDetails));
