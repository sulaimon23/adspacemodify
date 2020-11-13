import React, { Component } from "react";
import { connect } from "react-redux";
import NumericInput from "react-numeric-input";
import image from "../../assets/img/dg1.jpg";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import {
  logOut,
  setAuthenticated,
  editProfile,
  profileNameChange,
  profileSubscribeChange,
  getUser,
  displayProfileMessage,
  saveProfile,
  getUserOrders,
  getAgeGenderInterests,
  saveBrandsProfile,
  changeSelectedBrand,
  removeBrand,
  deleteAccount,
  getAllLocations,
  querySearch,
  addReduceQuantity,
  displayMDMessage,
  showMDbooking,
  periodChange,
  changeNotApplicable,
  submitAdspaces,
  paginateLocations,
  sortMDLocations,
  submitAdspacesPaid,
  updateLocationWithStartEndDate,
  updateOpenRow,
  fileInputChange,
  loadSavedPlan,
  savePlanToUserObject,
  savedPlanSelected,
  saveBrands,
  addReduceQuantityByInput,
} from "../../actions";
// import shoppingCartStyle from "../../assets/jss/material-kit-pro-react/views/shoppingCartStyle.js";
import {
  CircularProgress,
  DialogContent,
  LinearProgress,
  withStyles,
} from "@material-ui/core";
import Dashboard from "../../components/dashboard/dashboard.jsx";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import { getAuth } from "../../firebase";
import CustomInput from "../../components/CustomInput/CustomInput";
import Checkbox from "@material-ui/core/Checkbox";
import {
  Cached,
  Check,
  FavoriteBorder,
  Add,
  Place,
  Info,
  FiberManualRecord,
  Remove,
  Close,
  FormatColorReset,
  FormatColorResetOutlined,
  RefreshOutlined,
  BorderColor,
  KeyboardArrowRight,
} from "@material-ui/icons";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "../../components/CustomButtons/Button";
import { grayColor } from "../../assets/jss/material-kit-pro-react";
import Badge from "../../components/Badge/Badge";
import { Redirect } from "react-router-dom";
import ReactTable from "react-table";
import moment from "moment";
import CardHeader from "../../components/Card/CardHeader";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import SideNav from "../../components/Sidenav/Sidenav";
import "./Profile.scss";
import Upload from "./Upload";
import { numberWithCommas, substringText, formatCurrency } from "../../utils";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Carousel from "react-slick";
import Typography from "@material-ui/core/Typography";
import Instruction from "../../components/Instruction/Instruction";
import Tooltip from "@material-ui/core/Tooltip";
import Datetime from "react-datetime";
import classNames from "classnames";

import BookingDetails from "../MediaPlanning/BookingDetail.jsx";
import "../MediaPlanning/mediaplanning.scss";
import Clearfix from "../../components/Clearfix/Clearfix";
import Accordion from "../../components/Accordion/Accordion";

import Pagination from "../../components/Pagination/Pagination";
import styles from "../../assets/jss/material-kit-pro-react/views/ecommerceSections/productsStyle.js";
import _ from "underscore";

import { mdPageSize } from "../../config";
import ReactSelect from "react-select";
import MediaPlanning from "views/MediaPlanning/MediaPlanning";
import NewNavbar from "components/NewNavbar";
import Monitor from "views/Monitor/Monitor";
import Modals from "views/ModalChart/Modal";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
Transition.displayName = "Transition";

let yesterday = Datetime.moment().subtract(1, "day");
let valid = function(current) {
  return current.isAfter(yesterday);
};
const settings = {
  dots: true,
  infinite: true,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  adaptiveHeight: true,
};

const sortOptions = [
  { value: 0, label: "defalt" },
  { value: 1, label: "Price - Low To High" },
  { value: 2, label: "Price - High To Low" },
  { value: 3, label: "Alphabetical Order [A - Z]" },
  { value: 4, label: "Alphabetical Order [Z - A]" },
];

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSidebar: false,
      maxim: 0,
      chartData: false,
      selectedEnabled: 0,
      branding: "",
      brands: [
        {
          ages: [],
          gender: "",
          interests: [],
          brandName: "",
        },
      ],
      show: false,
      showMediaLinks: false,
      stage: 0,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      changePasswordCard: false,
      changePasswordMessage: "",
      changePasswordSuccess: false,
      deleteAccountModal: false,
      deleteEmail: "",
      deletePassword: "",

      checkedTags: [],
      checkedCategories: [],
      checkedSubCategories: [],
      checkedStates: [],
      checkedCities: [],
      priceRange: [101, 790],
      anchorElTop: null,
      priceRangeV2: [
        { label: "None", startValue: -1, endValue: -1 },
        { label: "< 1000", startValue: 0, endValue: 1000 },
        { label: "1000 - 2000", startValue: 1000, endValue: 2000 },
        { label: "2000 - 5000", startValue: 2000, endValue: 3000 },
        { label: "> 5000", startValue: 5000, endValue: 1000000 },
      ],
      modal: false,
      campaignTitle: "",
      startDate: moment(),
      subCategoriesSelectedCategory: [],
      citiesSelectedState: [],
      location: {},
      noticeModal: false,
      modalIsOpen: false,
      pageNumber: 0,
      status: 0,
      reset: false,
      hello: [],
      lengthOfItems: 0,
    };
  }

  componentDidMount() {

    getAuth().onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified === true)
          this.props.setAuthenticated(true, user);
        else this.props.setAuthenticated(false, user);
        this.props.getUser(user.email);
        this.props.getUserOrders(user.email);
      } else {
        this.props.setAuthenticated(false, user);
      }
    });

    // let userRef = await getDb().collection("users").doc(email).get();

    document.title =
      "Adspace.ng – Media Planning | Advert Space | Billboards | Television |Newspaper | Radio | Influencer | Magazine";
    this.props.getAllLocations();
  }

  toggleSidebar = () => {
    console.log('clickedddd')
    this.setState({showSidebar: !this.state.showSidebar})
}

  sholl = () => {
    this.getChartData();
    console.log(this.getChartData,'chartdata')
  }

  
   getChartData = () => {

  const chartData = {
    labels:this.state.hello,
    datasets: [
      {
        label: "Population",
        data: [617594, 181045, 153060, 106519, 105162, 95072],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
      },
    ],
    
  }
     return chartData
  
  }
  

  handleToggleTags(value) {
    const {
      checkedTags,
      checkedCategories,
      priceRangeV2,
      selectedEnabled,
      checkedSubCategories,
      subCategoriesSelectedCategory,
      checkedStates,
      checkedCities,
      citiesSelectedState,
    } = this.state;
    const {
      tagsArray,
      categoriesArray,
      querySearch,
      originalLocationsArray,
      statesArray,
      locationsArray,
    } = this.props;
    const currentIndex = checkedTags.indexOf(value);
    const newCheckedTags = [...checkedTags];
    if (currentIndex === -1) newCheckedTags.push(value);
    else newCheckedTags.splice(currentIndex, 1);

    querySearch(
      newCheckedTags,
      checkedCategories,
      tagsArray,
      categoriesArray,
      originalLocationsArray,
      priceRangeV2[selectedEnabled],
      checkedSubCategories,
      subCategoriesSelectedCategory,
      checkedStates,
      checkedCities,
      citiesSelectedState,
      statesArray,
      locationsArray
    );

    this.setState({ checkedTags: newCheckedTags, pageNumber: 0 });
  }

  handleToggleCats(value) {
    const {
      checkedTags,
      checkedCategories,
      priceRangeV2,
      selectedEnabled,
      checkedSubCategories,
      subCategoriesSelectedCategory,
      checkedStates,
      checkedCities,
      citiesSelectedState,
    } = this.state;
    const {
      tagsArray,
      categoriesArray,
      subCategoriesArray,
      querySearch,
      originalLocationsArray,
      statesArray,
      locationsArray,
    } = this.props;
    const currentIndex = checkedCategories.indexOf(value);
    const newChecked = [...checkedCategories];
    let filteredSubCats = subCategoriesArray.filter(
      (cat) => cat.cat_id === categoriesArray[value].id
    );
    if (currentIndex === -1) {
      newChecked.push(value);
      if (subCategoriesSelectedCategory.length === 0) {
        filteredSubCats.map((cat) => {
          subCategoriesSelectedCategory.push(cat);
        });
      } else {
        filteredSubCats.map((flCat) => {
          if (!_.contains(subCategoriesSelectedCategory, flCat))
            subCategoriesSelectedCategory.push(flCat);
        });
      }
      querySearch(
        checkedTags,
        newChecked,
        tagsArray,
        categoriesArray,
        originalLocationsArray,
        priceRangeV2[selectedEnabled],
        checkedSubCategories,
        subCategoriesSelectedCategory,
        checkedStates,
        checkedCities,
        citiesSelectedState,
        statesArray,
        locationsArray
      );

      this.setState({
        checkedCategories: newChecked,
        subCategoriesSelectedCategory: subCategoriesSelectedCategory,
        pageNumber: 0,
        reset: false,
      });
    } else {
      newChecked.splice(currentIndex, 1);
      filteredSubCats.map((flCat) => {
        let ind = subCategoriesSelectedCategory.indexOf(flCat);
        if (ind !== -1) subCategoriesSelectedCategory.splice(ind, 1);
      });
      querySearch(
        checkedTags,
        newChecked,
        tagsArray,
        categoriesArray,
        originalLocationsArray,
        priceRangeV2[selectedEnabled],
        [],
        subCategoriesSelectedCategory,
        checkedStates,
        checkedCities,
        citiesSelectedState,
        statesArray,
        locationsArray
      );

      this.setState({
        checkedCategories: newChecked,
        subCategoriesSelectedCategory: subCategoriesSelectedCategory,
        pageNumber: 0,
        reset: false,
      });
    }
  }

  handleToggleState(value) {
    const {
      checkedTags,
      checkedCategories,
      priceRangeV2,
      selectedEnabled,
      checkedSubCategories,
      subCategoriesSelectedCategory,
      checkedStates,
      checkedCities,
      citiesSelectedState,
    } = this.state;
    const {
      tagsArray,
      categoriesArray,
      subCategoriesArray,
      querySearch,
      originalLocationsArray,
      statesArray,
      citiesArray,
      locationsArray,
    } = this.props;
    const currentIndex = checkedStates.indexOf(value);
    const newChecked = [...checkedStates];
    let filteredCities = citiesArray.filter(
      (city) => city.state_id === statesArray[value].id
    );

    if (currentIndex === -1) {
      newChecked.push(value);
      if (citiesSelectedState.length === 0) {
        filteredCities.map((city) => {
          citiesSelectedState.push(city);
        });
      } else {
        filteredCities.map((flCity) => {
          if (!_.contains(citiesSelectedState, flCity))
            citiesSelectedState.push(flCity);
        });
      }

      querySearch(
        checkedTags,
        checkedCategories,
        tagsArray,
        categoriesArray,
        originalLocationsArray,
        priceRangeV2[selectedEnabled],
        checkedSubCategories,
        subCategoriesSelectedCategory,
        newChecked,
        checkedCities,
        citiesSelectedState,
        statesArray,
        locationsArray
      );

      this.setState({
        checkedStates: newChecked,
        citiesSelectedState: citiesSelectedState,
        pageNumber: 0,
        reset: false,
      });
    } else {
      newChecked.splice(currentIndex, 1);
      filteredCities.map((flCity) => {
        let ind = citiesSelectedState.indexOf(flCity);
        if (ind !== -1) citiesSelectedState.splice(ind, 1);
      });

      querySearch(
        checkedTags,
        checkedCategories,
        tagsArray,
        categoriesArray,
        originalLocationsArray,
        priceRangeV2[selectedEnabled],
        checkedSubCategories,
        subCategoriesSelectedCategory,
        newChecked,
        checkedCities,
        citiesSelectedState,
        statesArray,
        locationsArray
      );

      this.setState({
        checkedStates: newChecked,
        citiesSelectedState: citiesSelectedState,
        pageNumber: 0,
        reset: false,
      });
    }
  }

  handleToggleSubCats(value) {
    const {
      checkedTags,
      checkedCategories,
      priceRangeV2,
      selectedEnabled,
      checkedSubCategories,
      subCategoriesSelectedCategory,
      checkedStates,
      checkedCities,
      citiesSelectedState,
    } = this.state;
    const {
      tagsArray,
      categoriesArray,
      subCategoriesArray,
      querySearch,
      originalLocationsArray,
      statesArray,
      citiesArray,
      locationsArray,
    } = this.props;
    const currentIndex = checkedSubCategories.indexOf(value);
    const newChecked = [...checkedSubCategories];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    querySearch(
      checkedTags,
      checkedCategories,
      tagsArray,
      categoriesArray,
      originalLocationsArray,
      priceRangeV2[selectedEnabled],
      newChecked,
      subCategoriesSelectedCategory,
      checkedStates,
      checkedCities,
      citiesSelectedState,
      statesArray,
      locationsArray
    );

    this.setState({
      checkedSubCategories: newChecked,
      pageNumber: 0,
      reset: false,
    });
  }

  handleToggleCity(value) {
    const {
      checkedTags,
      checkedCategories,
      priceRangeV2,
      selectedEnabled,
      checkedSubCategories,
      subCategoriesSelectedCategory,
      checkedStates,
      checkedCities,
      citiesSelectedState,
    } = this.state;
    const {
      tagsArray,
      categoriesArray,
      subCategoriesArray,
      querySearch,
      originalLocationsArray,
      statesArray,
      citiesArray,
      locationsArray,
    } = this.props;
    const currentIndex = checkedCities.indexOf(value);
    const newChecked = [...checkedCities];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    querySearch(
      checkedTags,
      checkedCategories,
      tagsArray,
      categoriesArray,
      originalLocationsArray,
      priceRangeV2[selectedEnabled],
      checkedSubCategories,
      subCategoriesSelectedCategory,
      checkedStates,
      newChecked,
      citiesSelectedState,
      statesArray,
      locationsArray
    );

    this.setState({ checkedCities: newChecked, pageNumber: 0, reset: false });
  }

  renderTagsAdspace(location) {
    if (location && location.tags && location.tags.length > 0) {
      return location.tags.map((tag, index) => {
        return (
          <Badge color="rose" key={index}>
            {tag || ""}
          </Badge>
        );
      });
    }
  }

  renderDiscount(classes, location) {
    if (location.discountedPrice && location.discountedPrice.checked) {
      return (
        <>
          <span className={classNames(classes.price, classes.priceOld)}>
            {numberWithCommas(
              formatCurrency(
                location.price || "",
                this.props.exchange,
                this.props.currency
              )
            )}
            : {location.pricingOption.name}
          </span>
          <span className={classNames(classes.price, classes.priceNew)}>
            {numberWithCommas(
              formatCurrency(
                location.discountedPrice.value || 0,
                this.props.exchange,
                this.props.currency
              )
            )}{" "}
            {location.pricingOption.name}
          </span>
        </>
      );
    } else {
      return (
        <>
          <span className={classNames(classes.price, classes.priceNew)}>
            {numberWithCommas(
              formatCurrency(
                location.price || "",
                this.props.exchange,
                this.props.currency
              )
            )}{" "}
            {location.pricingOption.name}
          </span>
        </>
      );
    }
  }

  renderMDAdSpaces() {
    const {
      locationsArray,
      classes,
      addReduceQuantity,
      displayMDMessage,
      addReduceQuantityByInput,
      originalLocationsArray
    } = this.props;
    const { noticeModal, location, pageNumber, hello ,maxim} = this.state;
    let paginatedArray = [];

    
    const  addUpdate = (locationData) =>{

      const allThings = originalLocationsArray.filter(
        (element) => element.userAddedQuantity > 0
      );
      addReduceQuantity(locationData.id, "add")
      let over = []
      over.push(allThings.length)
      this.setState({hello: [...hello,locationData.userAddedQuantity]})
      this.setState({maxim: over})
      console.log(locationData.category, 'weray')
      console.log(maxim, 'maxim')
      console.log(allThings.length , 'allthings')
    }
  


    if (locationsArray && locationsArray.length > 0) {
      paginatedArray = locationsArray.slice(
        pageNumber * mdPageSize,
        (pageNumber + 1) * mdPageSize
      );
      return paginatedArray.map((location, index) => {
        return (
          <div className="col-xl-4 col-sm-4 col-4 prof">
            <Card className="card-media" product>
              <div style={{ position: "relative" }}>
                <a
                  href={`/mediaplanning-details/${location.id}`}
                  target="_blank"
                >
                  <img
                    width="100%"
                    src={
                      location.resizedImages
                        ? location.resizedImages[0] || ""
                        : location.images
                        ? location.images[0]
                        : ""
                    }
                    alt={
                      location.name
                        ? substringText(location.name, 53).toLowerCase()
                        : ""
                    }
                    height="200"
                  />
                </a>
                <div className="view-more">Click to see details</div>
              </div>
              <CardBody style={{ textAlign: "left", height: "180px" }} plain>
                <a
                  href={`/mediaplanning-details/${location.id}`}
                  target="_blank"
                >
                  <h4
                    className={classes.cardTitle}
                    style={{
                      textTransform: "capitalize",
                      fontSize: 14,
                      // lineHeight: "30px",
                      fontWeight: "900",
                      marginTop: 0,
                      color: "#0b28ba",
                      textAlign: "left",
                      marginBottom: 50,
                    }}
                  >
                    {location.name ? substringText(location.name, 60) : ""}
                  </h4>
                </a>
                <div className="text-muted  card_med">
                  {/* </a> */}
                  <p className="my-3">
                    {`${location.category ? location.category.name : ""}`}
                  </p>

                  <p className="text-muted my-2">
                    Available Qty: {location.quantity || ""}
                  </p>

                  <p className="text-muted">
                    {location
                      ? !location.traffic
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        ? `Traffic: ${0}`
                        : `Traffic: ${location.traffic}`
                      : 0}{" "}
                    {location && location.trafficOption
                      ? location.trafficOption.name
                      : ""}{" "}
                  </p>
                  <p className="text-muted">
                    {location.size
                      ? "Size: " + location.size || ""
                      : "Duration (sec): " + location.duration ||
                        "" + " , Quantity: " + location.quantity ||
                        ""}{" "}
                    {location && location.sizingOption
                      ? location.sizingOption.name
                      : ""}
                  </p>
                </div>
              </CardBody>
              <div
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    marginTop: 10,
                    fontSize: 15,
                    color: "#0a24a7",
                    marginBottom: 10,
                  }}
                >
                  <span style={{ color: "#0a24a7" }}>Admatch: </span>
                  {`${location.count ? (location.count / 5) * 100 : "0"}%`}
                </div>

                <span
                  key={index}
                  style={{
                    color: "#000",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {` `}
                  <div className="matcher  ">
                    <Button
                      //   color="info"
                      size="sm"
                      round
                      className={classes.firstButton}
                      onClick={() =>
                        location.userAddedQuantity > 0
                          ? addReduceQuantity(location.id, "reduce")
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
                      //   color="info"
                      size="sm"
                      round
                      className={classes.lastButton}
                      onClick={() =>
                        location.userAddedQuantity >= location.quantity
                          ? displayMDMessage(
                              "Note: Quantity increment will stop when it reaches the maximum quantity for the selected location"
                            )
                            : addUpdate(location)
                          // : addReduceQuantity(location.id, "add")
                      }
                      style={{ height: 20, width: 20, background: "#2962ff" }}
                    >
                      <Add />
                    </Button>
                  </div>
                </span>
              </div>
              <hr class="solid"></hr>
              <div className="billFooter">
                <h5 style={{ fontSize: "12px", paddingTop: "10px" }}>
                  {this.renderDiscount(location.discountedPrice, location)}
                </h5>

                <h5
                  style={{
                    fontSize: "12px",
                    paddingTop: "10px",
                    display: "flex",
                  }}
                >
                  <LocationOnIcon />

                  {location.state && location.state.name === "Nation Wide" ? (
                    <span>{location.city.name}</span>
                  ) : (
                    // {`${location.city ? location.city.name || "" : ""}, ${
                    //     location.state ? location.state.name || "" : ""
                    // }`}
                    <div>
                      <span>{location.city.name}</span> {" , "}
                      <span>{location.state.name}</span>
                    </div>
                  )}
                </h5>
              </div>
            </Card>
            {/* </GridItem> */}
          </div>
        );
      });
    } else {
      return (
        <GridItem md={4} sm={4}>
          <h5>No Adspaces matching your search</h5>
        </GridItem>
      );
    }
  }

  renderTagsMD() {
    const { classes, tagsArray } = this.props;
    const { checkedTags } = this.state;
    if (tagsArray && tagsArray.length > 0) {
      return tagsArray.map((tag, index) => {
        return (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                tabIndex={-1}
                onClick={() => this.handleToggleTags(index)}
                checked={checkedTags.indexOf(index) !== -1}
                checkedIcon={<Check className={classes.checkedIcon} />}
                icon={<Check className={classes.uncheckedIcon} />}
                classes={{
                  checked: classes.checked,
                  root: classes.checkRoot,
                }}
              />
            }
            classes={{ label: classes.label }}
            label={
              <Typography style={{ fontSize: 12 }}>{tag.name || ""}</Typography>
            }
          />
        );
      });
    }
    return null;
  }

  renderCategoriesMD() {
    const { classes, categoriesArray } = this.props;
    const { checkedCategories, reset } = this.state;
    if (categoriesArray && categoriesArray.length > 0) {
      return categoriesArray.map((cat, index) => {
        return (
          <div>
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  tabIndex={-1}
                  onClick={() => this.handleToggleCats(index)}
                  checked={checkedCategories.indexOf(index) !== -1}
                  checkedIcon={<Check className={classes.checkedIcon} />}
                  icon={<Check className={classes.uncheckedIcon} />}
                  classes={{
                    checked: classes.checked,
                    root: classes.checkRoot,
                  }}
                />
              }
              classes={{ label: classes.label }}
              label={
                <Typography style={{ fontSize: 13 }}>
                  {cat.name || ""}
                </Typography>
              }
            />
            {!reset && (
              <div style={{ marginLeft: 10 }}>
                {this.renderUnderSubCategoriesMD(cat)}
              </div>
            )}
          </div>
        );
      });
    }

    return null;
  }

  renderUnderSubCategoriesMD(category) {
    const { classes, subCategoriesArray } = this.props;
    const { checkedSubCategories, subCategoriesSelectedCategory } = this.state;
    if (
      subCategoriesSelectedCategory &&
      subCategoriesSelectedCategory.length > 0
    ) {
      return subCategoriesSelectedCategory.map((subCat, index) => {
        if (category.id === subCat.cat_id) {
          return (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  tabIndex={-1}
                  onClick={() => this.handleToggleSubCats(index)}
                  checked={checkedSubCategories.indexOf(index) !== -1}
                  checkedIcon={<Check className={classes.checkedIcon} />}
                  icon={<Check className={classes.uncheckedIcon} />}
                  classes={{
                    checked: classes.checked,
                    root: classes.checkRoot,
                  }}
                />
              }
              classes={{ label: classes.label }}
              label={
                <Typography
                  style={{
                    fontSize: 15,
                    wordWrap: "break-word",
                    paddingLeft: 10,
                  }}
                >
                  {subCat.name || ""}
                </Typography>
              }
            />
          );
        } else return null;
      });
    }

    return null;
  }

  renderStatesMD() {
    const { classes, statesArray } = this.props;
    const { checkedStates, reset } = this.state;
    if (statesArray && statesArray.length > 0) {
      return statesArray.map((state, index) => {
        return (
          <div>
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  tabIndex={-1}
                  onClick={() => this.handleToggleState(index)}
                  checked={checkedStates.indexOf(index) !== -1}
                  checkedIcon={<Check className={classes.checkedIcon} />}
                  icon={<Check className={classes.uncheckedIcon} />}
                  classes={{
                    checked: classes.checked,
                    root: classes.checkRoot,
                  }}
                />
              }
              classes={{ label: classes.label }}
              label={
                <Typography style={{ fontSize: 14 }}>
                  {state.name || ""}
                </Typography>
              }
            />
            {!reset && (
              <div style={{ marginLeft: 10 }}>
                {this.renderCitiesUnderStatesMD(state)}
              </div>
            )}
          </div>
        );
      });
    }
  }

  renderCitiesUnderStatesMD(state) {
    const { classes } = this.props;
    const { checkedCities, citiesSelectedState } = this.state;
    if (citiesSelectedState && citiesSelectedState.length > 0) {
      return citiesSelectedState.map((city, index) => {
        if (city.state_id === state.id) {
          return (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  tabIndex={-1}
                  onClick={() => this.handleToggleCity(index)}
                  checked={checkedCities.indexOf(index) !== -1}
                  checkedIcon={<Check className={classes.checkedIcon} />}
                  icon={<Check className={classes.uncheckedIcon} />}
                  classes={{
                    checked: classes.checked,
                    root: classes.checkRoot,
                  }}
                />
              }
              classes={{ label: classes.label }}
              label={
                <Typography
                  style={{
                    fontSize: 12,
                    wordWrap: "break-word",
                    paddingLeft: 10,
                  }}
                >
                  {city.name || ""}
                </Typography>
              }
            />
          );
        } else return null;
      });
    }
  }

  renderPriceMD(classes) {
    const { selectedEnabled, priceRangeV2 } = this.state;

    return priceRangeV2.map((price, index) => {
      return (
        <div
          key={index}
          className={
            classes.checkboxAndRadio + " " + classes.checkboxAndRadioHorizontal
          }
        >
          <FormControlLabel
            control={
              <Radio
                checked={selectedEnabled === index}
                onChange={() => this.setState({ selectedEnabled: index })}
                value={selectedEnabled}
                name="radio button enabled"
                aria-label="A"
                icon={<FiberManualRecord className={classes.radioUnchecked} />}
                checkedIcon={
                  <FiberManualRecord className={classes.radioChecked} />
                }
                classes={{
                  checked: classes.radio,
                  root: classes.radioRoot,
                }}
              />
            }
            classes={{
              label: classes.label,
              root: classes.labelRoot,
            }}
            label={price.label || ""}
          />
        </div>
      );
    });
  }

  handleBookClick = () => {
    const { totalPrice, displayMDMessage, showMDbooking } = this.props;
    if (totalPrice === 0)
      toast.error(
        "YOU DO NOT HAVE ANY ADSPACES, ADD QUANTITY TO ANY ADSPACE UNDER MEDIA PLANNING",
        {
          className: "not_bar",
        }
      );
    else this.addSeven();
  };

  cal(images, image) {
    if (images && images.length > 0) {
      return images.map((image_) => {
        return { original: image_, thumbnail: image_ };
      });
    } else {
      return [1, 2, 3, 4].map((a) => {
        return { original: image, thumbnail: image };
      });
    }
  }

  imageCarousel(location) {
    let images = [];
    if (location.resizedImages && location.resizedImages.length > 0)
      images = location.resizedImages;
    else if (location.images && location.images.length > 0)
      images = location.images;
    else images = [];

    if (images) {
      return images.map((image, index) => {
        return (
          <div
            key={index}
            style={{ maxWidth: 250, maxHeight: 250, overflow: "hidden" }}
          >
            <img
              src={image}
              style={{ width: "100%", height: "auto", maxHeight: 250 }}
              alt="First slide"
              className="slick-image"
            />
          </div>
        );
      });
    }
  }

  renderLocationDescription(classes) {
    const { noticeModal, location, modalIsOpen } = this.state;

    return (
      <GridContainer>
        `
        <GridItem xs={12} sm={6} md={6} lg={4}>
          {/* NOTICE MODAL START */}
          <Dialog
            classes={{
              root: classes.modalRoot,
              paper: classes.modal,
            }}
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
              <h4 className={classes.modalTitle}>Details</h4>
            </DialogTitle>
            <DialogContent
              id="notice-modal-slide-description"
              className={classes.modalBody}
              style={{ paddingTop: 15, paddingBottom: 2 }}
            >
              <GridContainer justify="center">
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  className={classes.marginAuto}
                >
                  <Card>
                    <Carousel {...settings}>
                      {this.imageCarousel(location)}
                    </Carousel>
                  </Card>
                </GridItem>
              </GridContainer>
              <Instruction
                title="Adspace Details"
                text={
                  <>
                    <span>
                      Name: {"  "} {location.name || ""} <br />
                    </span>
                    <span>
                      Category: {"  "}{" "}
                      {location.category ? location.category.name : ""}, &nbsp;
                      &nbsp;Sub Category: {"  "}{" "}
                      {location.subCategory ? location.subCategory.name : ""}
                      <br />
                    </span>
                    <span>
                      State: {"  "} {location.state ? location.state.name : ""},
                      &nbsp; &nbsp;City: {"  "}{" "}
                      {location.city ? location.city.name : ""}, &nbsp; &nbsp;
                      Price:
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
                className={classes.instructionNoticeModal}
                imageClassName={classes.imageNoticeModal}
              />
            </DialogContent>
            <DialogActions
              className={classes.modalFooter + " " + classes.modalFooterCenter}
              style={{ paddingTop: 5 }}
            >
              <Tooltip
                id="tooltip-top"
                title="Click to See location"
                placement="top"
                classes={{ tooltip: classes.tooltip }}
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${
                    location.geolocation ? location.geolocation.latitude : ""
                  },${
                    location.geolocation ? location.geolocation.longitude : ""
                  }`}
                  target="_blank"
                >
                  <Place fontSize="large" />
                </a>
              </Tooltip>
              <Button
                onClick={() => this.setState({ noticeModal: !noticeModal })}
                color="danger"
                round
              >
                CLOSE
              </Button>
            </DialogActions>
          </Dialog>
          {/* NOTICE MODAL END */}
        </GridItem>
      </GridContainer>
    );
  }

  paginationArray(locations) {
    const { pageNumber } = this.state;
    if (locations && locations.length > 0) {
      let pages = Math.ceil(locations.length / mdPageSize) || 1,
        pagination = [];
      for (let i = 0; i < pages; i++) {
        pagination.push({
          text: i + 1,
          active: i === pageNumber,
          onClick: () => this.handlePaginationClick(i + 1),
        });
      }
      return pagination;
    }
  }

  handlePaginationClick(value) {
    this.setState({ pageNumber: value - 1 });
  }

  renderLoadedPlans() {
    const { classes, savedPlans } = this.props;
    if (savedPlans && savedPlans.length > 0) {
      return savedPlans.map((plan, index) => {
        return (
          <MenuItem
            key={index}
            classes={{
              root: classes.selectMenuItem,
              selected: classes.selectMenuItemSelected,
            }}
            value={plan.brandName || ""}
            onClick={this.addSeven}
          >
            {plan.brandName || ""}
          </MenuItem>
        );
      });
    }
  }

  // openNav() {
  //   document.getElementById("mySidenav").style.width = "250px";
  //   document.getElementById("main").style.marginLeft = "250px";
  // }

  // closeNav() {
  //   document.getElementById("mySidenav").style.width = "0";
  //   document.getElementById("main").style.marginLeft = "0";
  // }

  handleSave() {
    const {
      displayName,
      subscribe,
      displayProfileMessage,
      saveProfile,
      user,
      userInfo,
    } = this.props;
    if (displayName === "") displayProfileMessage("USER NAME CANNOT BE EMPTY");
    else saveProfile(user, displayName, subscribe, userInfo);
  }

  renderOrders() {
    const { classes, ordersArray } = this.props;
    if (ordersArray && ordersArray.length > 0) {
      return ordersArray.map((order, index) => {
        return [
          order.id || "",
          "22/11/2019",
          order ? (order.location ? order.location.name : "") : "",
          this.componentRender("image", order, index, classes),
          this.componentRender("price", order, index, classes),
          order ? order.quantity || "" : "",
          this.componentRender("status", order, index, classes),
          this.componentRender("upload", order, index, classes),
        ];
      });
    }
    return [];
  }

  componentRender(render, order, index, classes) {
    if (render === "image") {
      return (
        <div className={classes.imgContainer} key={index}>
          <img
            src={
              order
                ? order.location
                  ? order.location.imageUrl ||
                    "https://picsum.photos/id/400/500/500"
                  : "https://picsum.photos/id/400/500/500"
                : "https://picsum.photos/id/400/500/500"
            }
            alt="..."
            className={classes.img}
            style={{ height: 60, width: 60 }}
          />
        </div>
      );
    } else if (render === "price") {
      return (
        <span key={index}>
          {" "}
          {order
            ? order.totalPrice
              ? formatCurrency(order.totalPrice, order.exchange, order.currency)
              : ""
            : ""}
        </span>
      );
    } else if (render === "status") {
      let status_ = "PENDING",
        color = "warning";
      if (order.status === 0) {
        status_ = "PENDING";
        color = "warning";
      } else if (order.status === 1) {
        status_ = "CONFIRMED";
        color = "info";
      } else if (order.status === 2) {
        status_ = "PAID";
        color = "success";
      } else if (order.status === 3) {
        status_ = "COMPLETED";
        color = "success";
      } else if (order.status === 4) {
        status_ = "CANCELED";
        color = "danger";
      } else {
        status_ = "PENDING";
        color = "warning";
      }
      return (
        <div className="actions-center">
          <Badge color={color}>{status_}</Badge>
        </div>
      );
    } else if (render === "upload") {
      return (
        <div style={{ fontSize: "15px" }}>
          {order.status !== 1 && !order.isUploaded ? (
            <Upload order={order} />
          ) : order.isUploaded ? (
            <Badge color={"success"}>UPLOADED</Badge>
          ) : (
            ""
          )}
        </div>
      );
    }
  }

  findItem(array = [], item) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === item) {
        delete array[i].created_by; //delete this key from object so that we dont have to store so much on the user document in firrebasse
        return array[i];
      }
    }
    return undefined;
  }

  renderTable() {
    const { classes, ordersLoader, ordersArray } = this.props;

    let data = [];
    if (ordersArray && ordersArray.length > 0) {
      data = ordersArray.map((order, index) => {
        return {
          key: order.id,
          orderno: order.id || "",
          location_name: order.location
            ? order.location
              ? order.location.name
              : ""
            : "",
          price: this.componentRender("price", order, index, classes),
          // orderdt: order.created_at ? moment(order.created_at.toDate()).format('YYYY-MM-DD hh:mm:ss') : '',
          quantity: order.quantity,
          image: this.componentRender("image", order, index, classes),
          status: this.componentRender("status", order, index, classes),
          upload: this.componentRender("upload", order, index, classes),
        };
      });
    }

    function _filterCaseInsensitive(filter, row) {
      const id = filter.pivotId || filter.id;
      return row[id] !== undefined
        ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
        : true;
    }

    return (
      <ReactTable
        data={data}
        filterable
        loading={ordersLoader}
        columns={[
          {
            Header: "Order No",
            accessor: "orderno",
            headerStyle: { textAlign: "center" },
          },
          {
            Header: "Order Date",
            accessor: "orderdt",
            headerStyle: { textAlign: "center" },
            style: { textAlign: "center" },
          },
          {
            Header: "Adspace Name",
            accessor: "location_name",
            headerStyle: { textAlign: "center" },
            style: { textAlign: "center" },
          },
          {
            Header: "Adspace",
            accessor: "image",
            headerStyle: { textAlign: "center" },
            style: { textAlign: "center" },
          },
          {
            Header: "Price",
            accessor: "price",
            headerStyle: { textAlign: "center" },
            style: { textAlign: "center" },
          },
          {
            Header: "Qty",
            accessor: "quantity",
            headerStyle: { textAlign: "center" },
            style: { textAlign: "center" },
          },
          {
            Header: "Status",
            accessor: "status",
            headerStyle: { textAlign: "center" },
            style: { textAlign: "center" },
            sortable: false,
            filterable: false,
          },
          {
            Header: "Document Upload",
            accessor: "upload",
            headerStyle: { textAlign: "center" },
            style: { textAlign: "center" },
            sortable: false,
            filterable: false,
          },
        ]}
        defaultPageSize={5}
        showPaginationTop={false}
        showPaginationBottom
        className="-striped -highlight"
        defaultFilterMethod={_filterCaseInsensitive}
      />
    );
  }
  handleSaveBrands(brands, branding) {
    const { interestsArray, agesArray, gendersArray, saveBrands } = this.props;
    const { selectedEnabled } = this.state;
    const newArray = brands.map((brand) => {
      return {
        ...brand,
        ages: brand.ages.map((age) => {
          return this.findItem(agesArray, age);
        }),
        interests: brand.interests.map((interest) => {
          return this.findItem(interestsArray, interest);
        }),
        gender: this.findItem(gendersArray, brand.gender),
      };
    });
    console.log(newArray, "array");
    console.log(branding, "branding");
    console.log(selectedEnabled, "selectedEnabled");
    saveBrands(newArray, branding, selectedEnabled);
  }
  renderBrands() {
    const { userInfo, classes, selectedBrand } = this.props;
    const { branding, brands } = this.state;
    //if (!userInfo.hasOwnProperty("brands")) return null;
    let brands_ = userInfo.brands || [];

    if (Array.isArray(brands_) && brands_.length >= 0) {
      return (
        <GridItem sm={12} md={12} sl={12}>
          <div>
            <h4
              className={classes.title}
              style={{ textAlign: "center", color: grayColor[1] }}
            >
              {" "}
            </h4>
          </div>
          <Card>
            <CardBody>
              {/* <h4 className={classes.title} style={{ textAlign: 'center', color: grayColor[1]}}>My Branding </h4> */}
              {this.renderDefaultNoBranding(0)}
              {brands_.map((brand, index) => {
                return (
                  <GridContainer key={index}>
                    {this.renderBrandsDetails(brand, index + 1)}
                  </GridContainer>
                );
              })}
              {userInfo && (
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <GridContainer>
                      <GridItem xs={12} dm={12} md={12}>
                        <FormControl
                          fullWidth
                          className={classes.selectFormControl}
                        >
                          {this.renderBrandingComponent()}
                        </FormControl>
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} dm={12} md={12}>
                        <div
                          className={classes.textCenter}
                          style={{
                            marginTop: 20,
                            marginBottom: 20,
                            textAlign: "center",
                          }}
                        >
                          <Button
                            color="success"
                            round
                            onClick={() =>
                              this.handleSaveBrands(brands, branding)
                            }
                          >
                            Save
                          </Button>
                        </div>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                </GridContainer>
              )}
            </CardBody>
          </Card>
        </GridItem>
      );
    } else return null;
  }
  handleInputChange = (value, ind, brands, input) => {
    console.log(this.state.interestsArray, "interestsArray", brands, "brands");
    const arr = brands.map((brand, index) => {
      if (ind === index) {
        if (input === "brandname") return { ...brand, brandName: value };
        else if (input === "ages" && value.length <= 2)
          return { ...brand, ages: value };
        else if (input === "interests" && value.length <= 2)
          return { ...brand, interests: value };
        else if (input === "gender") return { ...brand, gender: value };
      }
      return brand;
    });
    this.setState({ brands: arr });
  };
  handleBrandSelectionChange(value) {
    if (value === "single")
      this.setState({
        branding: value,
        brands: [{ ages: [], gender: "", interests: [], brandName: "" }],
      });
    else {
      this.setState({ branding: value });
    }
  }
  renderBrandingComponent(){
    const { classes, interestsArray, agesArray, gendersArray } = this.props;
    const {  brands } = this.state;
    if (brands){
        return brands.map((brand, index) => {
            const { ages, gender, interests, brandName } = brand;
            return(
                <GridContainer key={index}>
                    <GridItem xs={12} md={12} sm={12}>
                        <GridContainer>
                            <GridItem sm={2} md={2} lg={2} />
                            <GridItem xs={12} sm={12} md={6}>
                                <CustomInput
                                    formControlProps={{
                                        fullWidth: true,
                                        className: classes.customFormControlClasses
                                    }}
                                    value={brandName}
                                    inputProps={{
                                        type: "text",
                                        onChange: (e) => {
                                            this.handleInputChange(e.target.value, index, brands, 'brandname')
                                        },
                                        placeholder: "Brand Name..."
                                    }}
                                />
                            </GridItem>
                            <GridItem xs={12} md={4}>
                                <FormControl style={{ marginTop: 10}} fullWidth className={classes.selectFormControl}>
                                    <InputLabel
                                        htmlFor="simple-select"
                                        className={classes.selectLabel}
                                    >
                                        Age (choose 2)
                                    </InputLabel>
                                    <Select
                                        multiple
                                        value={ages}
                                        onChange={(e) => this.handleInputChange(e.target.value, index, brands, 'ages')}
                                        MenuProps={{
                                            className: classes.selectMenu,
                                            classes: { paper: classes.selectPaper }
                                        }}
                                        classes={{ select: classes.select }}
                                        inputProps={{
                                            name: "multipleSelect",
                                            id: "multiple-select"
                                        }}
                                    >
                                        {agesArray && (
                                            agesArray.map((item, index) => {
                                                return(
                                                    <MenuItem
                                                        key={index}
                                                        classes={{
                                                            root: classes.selectMenuItem,
                                                            selected: classes.selectMenuItemSelectedMultiple
                                                        }}
                                                        value={item.id}
                                                    >
                                                        {`${item.min || ''} - ${item.max || ''}`}
                                                    </MenuItem>
                                                )
                                            })
                                        )}
                                    </Select>
                                </FormControl>
                            </GridItem>
                        </GridContainer>
                        <GridContainer>
                            <GridItem sm={2} md={2} lg={2} />
                            <GridItem xs={12} md={6}>
                                <FormControl fullWidth className={classes.selectFormControl}>
                                    <InputLabel
                                        htmlFor="simple-select"
                                        className={classes.selectLabel}
                                    >
                                        Select Interests (choose 2)
                                    </InputLabel>
                                    <Select
                                        multiple
                                        value={interests}
                                        onChange={(e) => this.handleInputChange(e.target.value, index, brands, 'interests')}
                                        MenuProps={{
                                            className: classes.selectMenu,
                                            classes: { paper: classes.selectPaper }
                                        }}
                                        classes={{ select: classes.select }}
                                        inputProps={{
                                            name: "multipleSelect",
                                            id: "multiple-select"
                                        }}
                                    >
                                        {interestsArray && (
                                            interestsArray.map((item, index) => {
                                                return(
                                                    <MenuItem
                                                        key={index}
                                                        classes={{
                                                            root: classes.selectMenuItem,
                                                            selected: classes.selectMenuItemSelectedMultiple
                                                        }}
                                                        value={item.id}
                                                    >
                                                        {item.description || ''}
                                                    </MenuItem>
                                                )
                                            })
                                        )}
                                    </Select>
                                </FormControl>
                            </GridItem>
                            <GridItem xs={12} md={4}>
                                <FormControl fullWidth className={classes.selectFormControl}>
                                    <InputLabel
                                        htmlFor="simple-select"
                                        className={classes.selectLabel}
                                    >
                                        Gender
                                    </InputLabel>
                                    <Select
                                        MenuProps={{
                                            className: classes.selectMenu
                                        }}
                                        classes={{
                                            select: classes.select
                                        }}
                                        value={gender}
                                        onChange={(e) => this.handleInputChange(e.target.value, index, brands, 'gender')}
                                        inputProps={{
                                            name: "simpleSelect",
                                            id: "simple-select"
                                        }}
                                    >
                                        {gendersArray && (
                                            gendersArray.map((item, index) => {
                                                return(
                                                    <MenuItem
                                                        key={index}
                                                        classes={{
                                                            root: classes.selectMenuItem,
                                                            selected: classes.selectMenuItemSelected
                                                        }}
                                                        value={item.id}
                                                    >
                                                        {item.description || ''}
                                                    </MenuItem>
                                                )
                                            })
                                        )}
                                    </Select>
                                </FormControl>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                </GridContainer>
            )
        })
    }
}

  renderBrandsDetails(brand, index) {
    const {
      selectedBrand,
      classes,
      changeSelectedBrand,
      removeBrand,
      userInfo,
    } = this.props;

    return (
      <GridItem sm={12} md={12}>
        <GridContainer>
          <GridItem sm={12} md={12}>
            <GridContainer>
              <GridItem sm={12} md={9} className="heyyo">
                {brand.hasOwnProperty("brandName") && (
                  <GridItem sm={12} md={12}>
                    <GridContainer>
                      <GridItem sm={12} md={3}>
                        <h6>Brand Name</h6>
                      </GridItem>
                      <GridItem sm={12} md={3}>
                        <h6>{brand.brandName || ""}</h6>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                )}
                {brand.hasOwnProperty("ages") && (
                  <GridItem sm={12} md={12}>
                    <GridContainer>
                      <GridItem sm={12} md={3}>
                        <h6>Ages</h6>
                      </GridItem>
                      <GridItem sm={12} md={9}>
                        {brand.ages.map((age, index) => {
                          return (
                            <Badge key={index} color="primary">{`${age.min ||
                              ""} - ${age.max || ""}`}</Badge>
                          );
                        })}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                )}
                {brand.hasOwnProperty("gender") && (
                  <GridItem sm={12} md={12}>
                    <GridContainer>
                      <GridItem sm={12} md={3}>
                        <h6>Gender</h6>
                      </GridItem>
                      <GridItem sm={12} md={9}>
                        <Badge color="info">{`${
                          brand.gender ? brand.gender.description : ""
                        }`}</Badge>
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                )}
                {brand.hasOwnProperty("interests") && (
                  <GridItem sm={12} md={12}>
                    <GridContainer>
                      <GridItem sm={12} md={3}>
                        <h6>Interests</h6>
                      </GridItem>
                      <GridItem sm={12} md={9}>
                        {brand.interests.map((interest, index) => {
                          return (
                            <Badge
                              key={index}
                              color="success"
                            >{`${interest.description || ""}`}</Badge>
                          );
                        })}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                )}
              </GridItem>
              <GridItem sm={12} md={3}>
                <GridContainer>
                  <GridItem sm={12} md={6}>
                    <div
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 30,
                      }}
                      className={
                        classes.checkboxAndRadio +
                        " " +
                        classes.checkboxAndRadioHorizontal
                      }
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            checked={selectedBrand === index}
                            onChange={() => changeSelectedBrand(index)}
                            value="a"
                            name="radio button enabled"
                            aria-label="A"
                            icon={
                              <FiberManualRecord
                                className={classes.radioUnchecked}
                              />
                            }
                            checkedIcon={
                              <FiberManualRecord
                                className={classes.radioChecked}
                              />
                            }
                            classes={{
                              checked: classes.radio,
                              root: classes.radioRoot,
                            }}
                          />
                        }
                        classes={{
                          label: classes.label,
                          root: classes.labelRoot,
                        }}
                      />
                    </div>
                  </GridItem>
                  <GridItem sm={12} md={6}>
                    <Button
                      style={{ marginTop: 40 }}
                      color="danger"
                      size="sm"
                      justIcon
                      round
                      onClick={() =>
                        removeBrand(index, selectedBrand, userInfo)
                      }
                    >
                      <Close />
                    </Button>
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem sm={12} md={12}>
            <Divider variant="fullWidth" />
          </GridItem>
        </GridContainer>
      </GridItem>
    );
  }
  renderDefaultNoBranding(index) {
    const { selectedBrand, classes, changeSelectedBrand } = this.props;
    return (
      <GridItem sm={12} md={12}>
        <GridContainer>
          <GridItem sm={12} md={12}>
            <GridContainer>
              <GridItem sm={12} md={9}>
                <GridItem sm={12} md={12}>
                  <GridContainer>
                    <GridItem sm={12} md={3}>
                      <h6 style={{ textAlign: "center", color: grayColor[0] }}>
                        Brand Name
                      </h6>
                    </GridItem>
                    <GridItem sm={12} md={3}>
                      <h6 style={{ textAlign: "center", color: grayColor[1] }}>
                        No Branding (Default)
                      </h6>
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridItem>
              <GridItem sm={12} md={3}>
                <GridContainer>
                  <GridItem sm={12} md={6}>
                    <div
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 30,
                      }}
                      className={
                        classes.checkboxAndRadio +
                        " " +
                        classes.checkboxAndRadioHorizontal
                      }
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            checked={selectedBrand === index}
                            onChange={() => changeSelectedBrand(index)}
                            value="a"
                            name="radio button enabled"
                            aria-label="A"
                            icon={
                              <FiberManualRecord
                                className={classes.radioUnchecked}
                              />
                            }
                            checkedIcon={
                              <FiberManualRecord
                                className={classes.radioChecked}
                              />
                            }
                            classes={{
                              checked: classes.radio,
                              root: classes.radioRoot,
                            }}
                          />
                        }
                        classes={{
                          label: classes.label,
                          root: classes.labelRoot,
                        }}
                      />
                    </div>
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem sm={12} md={12}>
            <Divider variant="fullWidth" />
          </GridItem>
        </GridContainer>
      </GridItem>
    );
  }

  renderViews() {
    const {
      classes,
      isAuthenticated,
      user,
      logOut,
      loading,
      editProfile,
      isEdit,
      displayName,
      profileNameChange,
      profileSubscribeChange,
      subscribe,
      error,
      message,
      userInfo,
    } = this.props;
    const {
      oldPassword,
      newPassword,
      confirmPassword,
      changePasswordCard,
      changePasswordMessage,
      changePasswordSuccess,
    } = this.state;
    console.log(userInfo);

    if (this.state.stage === 4) {
      return (
        <GridContainer>
          <GridItem md={12} xs={12} sm={12} className="margin-body">
            <GridContainer justify="center" style={{ marginTop: 70 }}>
              <div>
                <h4
                  className={classes.title}
                  style={{ textAlign: "center", color: grayColor[1] }}
                >
                  Recent Orders
                </h4>
              </div>
            </GridContainer>
            <Card>
              <CardBody>{this.renderTable()}</CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      );
    } else if (this.state.stage === 1) {
      return (
        <GridContainer justify="center" style={{ marginTop: 70 }}>
          {this.renderBrands()}
        </GridContainer>
      );
    } else if (this.state.stage === 2) {
      return (
        <div>
          <GridContainer justify="center" style={{ marginTop: 70 }}>
            <GridItem md={6}>
              <h4
                className={classes.title}
                style={{ textAlign: "center", color: grayColor[1] }}
              >
                <i className="fe fe-user"></i>
              </h4>
            </GridItem>
          </GridContainer>
          <GridContainer justify="center">
            <GridItem md={6}>
              <Card>
                <CardBody>
                  <GridContainer>
                    <GridItem sm={12} xs={12} md={4}>
                      <h6 style={{ paddingTop: 25 }}>User Name</h6>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={8}>
                      <CustomInput
                        id="name"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          disabled: !isEdit,
                          autoFocus: !isEdit,
                          type: "text",
                          value: isEdit
                            ? displayName
                            : user
                            ? user.displayName || ""
                            : "",
                          onChange: (e) => {
                            profileNameChange(e.target.value);
                          },
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem sm={12} xs={12} md={4}>
                      <h6 style={{ paddingTop: 25 }}>Email</h6>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={8}>
                      <CustomInput
                        id="campaign"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          disabled: true,
                          type: "text",
                          value: user ? user.email || "" : "",
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem sm={12} xs={12} md={4}>
                      <h6 style={{ paddingTop: 25 }}>AD WALLET </h6>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={8}>
                      <CustomInput
                        id="campaign"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          disabled: true,
                          type: "text",
                          value: userInfo
                            ? userInfo.adWallet
                              ? userInfo.adWallet.balance
                                ? formatCurrency(
                                    userInfo.adWallet.balance,
                                    1,
                                    "NGN"
                                  )
                                : 0
                              : 0
                            : 0,
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem sm={12} xs={12} md={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => profileSubscribeChange(!subscribe)}
                            checkedIcon={
                              <Check className={classes.checkedIcon} />
                            }
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked,
                              root: classes.checkRoot,
                            }}
                            checked={subscribe}
                            disabled={!isEdit}
                          />
                        }
                        classes={{
                          label: classes.label,
                          root: classes.labelRoot,
                        }}
                        label="Subscribe to receive updates and new blog posts in email?"
                      />
                    </GridItem>
                  </GridContainer>
                  {error && (
                    <GridContainer justify="center">
                      <GridItem xs={12} sm={12} md={6}>
                        <p style={{ color: "#ef5350", fontWeight: "bold" }}>
                          {message || ""}
                        </p>
                      </GridItem>
                    </GridContainer>
                  )}
                  <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={4}>
                      <Button
                        color={isEdit ? "success" : "info"}
                        onClick={() =>
                          !isEdit ? editProfile(true) : this.handleSave()
                        }
                      >
                        {isEdit ? "SAVE PROFILE" : "EDIT PROFILE"}
                      </Button>
                    </GridItem>
                    {isEdit && (
                      <GridItem xs={12} sm={12} md={4}>
                        <Button
                          color="danger"
                          onClick={() => editProfile(false)}
                        >
                          CANCEL
                        </Button>
                      </GridItem>
                    )}
                  </GridContainer>
                  <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={4}>
                      <Button
                        color="warning"
                        size="sm"
                        simple={true}
                        onClick={() =>
                          this.setState({ changePasswordCard: true })
                        }
                      >
                        <p style={{ fontSize: 13 }}>Change Password</p>
                      </Button>
                    </GridItem>
                  </GridContainer>
                  <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={4}>
                      <Button
                        color="danger"
                        size="sm"
                        simple={true}
                        onClick={() =>
                          this.setState({ deleteAccountModal: true })
                        }
                      >
                        <p
                          style={{ fontSize: 13, textAlign: "center" }}
                        >{`Delete Account`}</p>
                      </Button>
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          {changePasswordCard && (
            <GridContainer justify="center">
              <GridItem md={6}>
                <Card>
                  <CardBody>
                    {changePasswordSuccess ? (
                      <>
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={12}>
                            <p className={classes.successMessage}>
                              Your Password has Been changed Successfully!
                            </p>
                          </GridItem>
                        </GridContainer>
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={4}>
                            <Button
                              color="success"
                              onClick={() =>
                                this.setState({
                                  oldPassword: "",
                                  newPassword: "",
                                  confirmPassword: "",
                                  changePasswordCard: false,
                                  changePasswordMessage: "",
                                  changePasswordSuccess: false,
                                })
                              }
                            >
                              OK
                            </Button>
                          </GridItem>
                        </GridContainer>
                      </>
                    ) : (
                      <>
                        <GridContainer>
                          <GridItem sm={12} xs={12} md={4}>
                            <h6 style={{ paddingTop: 25 }}>Old Password</h6>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={8}>
                            <CustomInput
                              id="name"
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                type: "password",
                                value: oldPassword || "",
                                onChange: (e) => {
                                  this.setState({
                                    oldPassword: e.target.value,
                                  });
                                },
                              }}
                            />
                          </GridItem>
                        </GridContainer>
                        <GridContainer>
                          <GridItem sm={12} xs={12} md={4}>
                            <h6 style={{ paddingTop: 25 }}>New Password</h6>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={8}>
                            <CustomInput
                              id="campaign"
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                type: "password",
                                value: newPassword || "",
                                onChange: (e) => {
                                  this.setState({
                                    newPassword: e.target.value,
                                  });
                                },
                              }}
                            />
                          </GridItem>
                        </GridContainer>
                        <GridContainer>
                          <GridItem sm={12} xs={12} md={4}>
                            <h6 style={{ paddingTop: 25 }}>Confirm Password</h6>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={8}>
                            <CustomInput
                              id="campaign"
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                type: "password",
                                value: confirmPassword || "",
                                onChange: (e) => {
                                  this.setState({
                                    confirmPassword: e.target.value,
                                  });
                                },
                              }}
                            />
                          </GridItem>
                        </GridContainer>
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={12}>
                            <p style={{ color: "#ef5350", fontWeight: "bold" }}>
                              {changePasswordMessage || ""}
                            </p>
                          </GridItem>
                        </GridContainer>
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={4}>
                            <Button
                              color="success"
                              onClick={() => this.handleChangePassword()}
                            >
                              CHANGE
                            </Button>
                          </GridItem>
                          <GridItem xs={12} sm={12} md={4}>
                            <Button
                              color="danger"
                              onClick={() =>
                                this.setState({ changePasswordCard: false })
                              }
                            >
                              CANCEL
                            </Button>
                          </GridItem>
                        </GridContainer>
                      </>
                    )}
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          )}
        </div>
      );
    } else if (this.state.stage === 3) {
      // return <MediaPlanning />
    }
    return null;
  }

  async handleChangePassword() {
    const { oldPassword, newPassword, confirmPassword } = this.state;
    const { user } = this.props;
    if (oldPassword === "")
      this.setState({ changePasswordMessage: "Old Password cannot be empty" });
    else if (newPassword === "")
      this.setState({ changePasswordMessage: "New Password cannot be empty" });
    else if (confirmPassword === "")
      this.setState({
        changePasswordMessage: "Confirm Password cannot be empty",
      });
    else if (newPassword !== confirmPassword)
      this.setState({ changePasswordMessage: "The two Passwords dont match" });
    else {
      try {
        let loggedUser = await getAuth().signInWithEmailAndPassword(
          user.email,
          oldPassword
        );
        await loggedUser.user.updatePassword(newPassword);
        this.setState({ changePasswordSuccess: true });
      } catch (e) {
        //console.log(e)
        if (e.code === "auth/wrong-password")
          this.setState({
            changePasswordMessage: "Failed: Wrong old password!",
          });
        else
          this.setState({
            changePasswordMessage:
              e.message || "Error occurred during change password",
          });
      }
    }
  }

  renderDeleteAccountModal(classes) {
    const { deleteAccountModal, deleteEmail, deletePassword } = this.state;
    const { deleteAccount, message, loading } = this.props;
    if (deleteAccountModal) {
      return (
        <Dialog
          classes={{
            root: classes.modalRoot,
            paper: classes.modal + " " + classes.modalLogin,
          }}
          open={deleteAccountModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.setState({ deleteAccountModal: false })}
          aria-labelledby="login-modal-slide-title"
          aria-describedby="login-modal-slide-description"
        >
          <Card plain className={classes.modalLoginCard}>
            <DialogTitle
              id="login-modal-slide-title"
              disableTypography
              className={classes.modalHeader}
            >
              <CardHeader
                plain
                color="primary"
                className={`${classes.textCenter} ${classes.cardLoginHeader}`}
              >
                <Button
                  simple
                  className={classes.modalCloseButton}
                  key="close"
                  aria-label="Close"
                  onClick={() => this.setState({ deleteAccountModal: false })}
                >
                  {" "}
                  <Close className={classes.modalClose} />
                </Button>
                <h5 className={classes.cardTitleWhite}>
                  Login First to Delete Your account
                </h5>
              </CardHeader>
            </DialogTitle>
            <DialogContent
              id="login-modal-slide-description"
              className={classes.modalBody}
            >
              <form>
                <CardBody className={classes.cardLoginBody}>
                  <CustomInput
                    id="login-modal-email"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      value: deleteEmail,
                      type: "email",
                      placeholder: "Email...",
                      onChange: (e) => {
                        this.setState({ deleteEmail: e.target.value });
                      },
                    }}
                  />
                  <CustomInput
                    id="login-modal-pass"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      value: deletePassword,
                      type: "password",
                      placeholder: "Password...",
                      onChange: (e) => {
                        this.setState({ deletePassword: e.target.value });
                      },
                    }}
                  />
                  {loading && (
                    <div className={classes.textCenter}>
                      <CircularProgress />
                    </div>
                  )}
                  <h6
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                    className={classes.errorMessage}
                  >
                    {message || ""}
                  </h6>
                </CardBody>
              </form>
            </DialogContent>
            <DialogActions
              className={`${classes.modalFooter} ${classes.justifyContentCenter}`}
            >
              <Button
                color="primary"
                size="lg"
                onClick={() => this.setState({ deleteAccountModal: false })}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                simple
                size="lg"
                onClick={() => deleteAccount(deleteEmail, deletePassword)}
              >
                Delete Account
              </Button>
            </DialogActions>
          </Card>
        </Dialog>
      );
    }
  }
  addZero = () => {
    const { stage, showMediaLinks } = this.state;
    return this.setState({ stage: 0 }, () =>
      this.setState({ showMediaLinks: false })
    );
  };
  addSeven = () => {
    const { stage, showMDDetails } = this.state;
    return this.setState({ stage: 7 }, () =>
      this.setState({ showMDDetails: false })
    );
  };
  addSix = () => {
    const { stage, showMediaLinks } = this.state;
    return this.setState({ stage: 6 }, () =>
      this.setState({ showMediaLinks: false })
    );
  };
  addOne = () => {
    const { stage, showMediaLinks } = this.state;
    return this.setState({ stage: 1 }, () =>
      this.setState({ showMediaLinks: false })
    );
  };
  addTwo = () => {
    const { stage, showMediaLinks } = this.state;
    return this.setState({ stage: 2 }, () =>
      this.setState({ showMediaLinks: false })
    );
  };

  addFour = () => {
    const { stage, showMediaLinks } = this.state;
    return this.setState({ stage: 4 }, () =>
      this.setState({ showMediaLinks: false })
    );
  };
  addMedia = () => {
    const { stage, showMediaLinks } = this.state;
    return this.setState({ stage: 3 }, () =>
      this.setState({ showMediaLinks: true })
    );
  };
  addMedia2 = () => {
    const { stage, showMDDetails } = this.state;
    return this.setState({ stage: 5 }, () =>
      this.setState({ showMDDetails: false })
    );
  };

  closeTime = (value) => {
    this.setState({ startDate: "" });
  };

  render() {
    const {
      classes,
      isAuthenticated,
      user,
      logOut,
      loading,
      handleBookClick,
    } = this.props;

    const { branding, brands } = this.state;
    const {
      checkedTags,
      checkedCategories,
      priceRangeV2,
      selectedEnabled,
      startDate,
      campaignTitle,
      checkedSubCategories,
      subCategoriesSelectedCategory,
      checkedStates,
      checkedCities,
      citiesSelectedState,
      location,
    } = this.state;
    const {
      // classes,
      // user,
      // loading,
      // error,
      // message,
      // isAuthenticated,
      // logOut,
      getAllLocations,
      tagsArray,
      addReduceQuantity,
      categoriesArray,
      querySearch,
      locationsArray,
      originalLocationsArray,
      showMDDetails,
      showMDbooking,
      periodChange,
      periodReset,
      changeNotApplicable,
      saveLoader,
      saveMessage,
      saveError,
      submitAdspaces,
      submitAdspacesPaid,
      success,
      orders,
      orderNos,
      displayMDMessageBookingDetails,
      subCategoriesArray,
      statesArray,
      sortMDLocations,
      updateLocationWithStartEndDate,
      openRow,
      updateOpenRow,
      fileInputChange,
      loadSavedPlan,
      savePlanToUserObject,
      savedPlan,
      savedPlanSelected,
      savedPlans,
      saveBrands,
      totalPrice,
      exchange,
      locations,
      currency,
    } = this.props;

    const {
      editProfile,
      isEdit,
      displayName,
      profileNameChange,
      profileSubscribeChange,
      subscribe,
      error,
      message,
      userInfo,
    } = this.props;
    const {
      oldPassword,
      newPassword,
      confirmPassword,
      changePasswordCard,
      changePasswordMessage,
      changePasswordSuccess,
    } = this.state;

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    let vat = (7.5 / 100) * totalPrice;
    // if (success) {
    //   return (
    //     <Redirect
    //       to={{
    //         pathname: "/orderSummary",
    //         state: {
    //           orderObject: undefined,
    //           orders,
    //           orderNos: orderNos,
    //           totalPrice: totalPrice,
    //         },
    //       }}
    //     />
    //   );
    // }

    // if (showMDDetails) {
    //   return (
    //     <div>

    //       {loading && <LinearProgress />}
    //       <div className={classes.main}>
    //         <div className={classes.section}>
    //           <div className={classes.container}>

    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // }

    const { stage, showMediaLinks } = this.state;
    const allThings = originalLocationsArray.filter(
      (element) => element.userAddedQuantity > 0
    );
      // const datas = this.getChartData()()
    return (
      <div>
        {this.renderDeleteAccountModal(classes)}
        {/* <Header
                    brand="ADSPACE"
                    links={<HeaderLinksTwo dropdownHoverColor="rose" isAuthenticated={isAuthenticated} user={user} logOutUser={() => logOut()} />}
                /> */}
        <NewNavbar
          isAuthenticated={isAuthenticated}
          authUser={user}
          logOutUser={() => logOut()}
          displayMDMessage={displayMDMessage}
          totalPrice={totalPrice}
          showMDbooking={showMDbooking}
          handleBookClick={() => this.handleBookClick()}
          toggleSidebar={() =>this.toggleSidebar()}
        />

        {loading && <LinearProgress />}

        <div>
          <div className="rowl">
            <div className={`${ !this.state.showSidebar? "left" : "left2"}`}>
              <div className="sidebar" 
                
              >
                <span className="menu-title">main</span>
                <ToastContainer />

                <div className="sidebar-li" onClick={this.addZero}>
                  <div>
                    <i
                      style={{ color: stage === 0 ? "blue" : null }}
                      class="fe fe-home"
                    ></i>
                  </div>
                  <span style={{ color: stage === 0 ? "blue" : null }}>
                    Dashboard
                  </span>
                </div>

                {/* <span className="menu-title">orders</span> */}

                <div>
                  <p>
                    <a
                      onClick={this.addMedia}
                      data-toggle="collapse"
                      href="#collapseExample"
                      role="button"
                      aria-expanded="false"
                      aria-controls="collapseExample"
                    >
                      <div className="sidebar-li" onClick={this.addTwo}>
                        <div>
                          <i
                            style={{ color: stage === 3 ? "blue" : null }}
                            class="fa fa-pencil-square-o"
                          ></i>
                        </div>
                        <span style={{ color: stage === 3 ? "blue" : null }}>
                          Media Planning
                        </span>
                      </div>
                    </a>
                  </p>
                  {this.state.showSidebar ? '' :
                  <div class="collapse" id="collapseExample">
                    <div style={{ marginTop: "-30px" }}>
                      <div
                        className={classes.cardTitle + " " + classes.textLeft}
                        style={{
                          marginTop: 30,
                          overflow: "hidden",
                          paddingLeft: 32,
                          paddingRight: 32,
                        }}
                      >
                        <Tooltip
                          id="tooltip-top"
                          title="Refresh Results"
                          placement="top"
                          classes={{ tooltip: classes.tooltip }}
                        >
                          <Button
                            link
                            justIcon
                            size="sm"
                            className={
                              classes.pullLeft + " " + classes.refineButton
                            }
                            onClick={() => this.props.getAllLocations()}
                          >
                            <RefreshOutlined />
                            Refresh
                          </Button>
                        </Tooltip>
                        <Tooltip
                          id="tooltip-top"
                          title="Reset Filter"
                          placement="top"
                          classes={{ tooltip: classes.tooltip }}
                        >
                          <Button
                            link
                            justIcon
                            size="sm"
                            className={
                              classes.pullRight + " " + classes.refineButton
                            }
                            onClick={() =>
                              this.setState({
                                checkedStates: [],
                                checkedCategories: [],
                                checkedTags: [],
                                checkedCities: [],
                                checkedSubCategories: [],
                                reset: true,
                              })
                            }
                          >
                            <FormatColorResetOutlined />
                            reset
                          </Button>
                        </Tooltip>
                        <Clearfix />
                      </div>
                      <div
                        style={{
                          marginTop: "20px",
                          paddingLeft: 10,
                          paddingRight: 10,
                        }}
                      >
                        <FormControl
                          variant="outlined"
                          fullWidth
                          style={{
                            background: "black",
                            paddingTop: 0,
                            paddingBottom: 5,
                            paddingLeft: 5,
                            paddingRight: 30,
                            borderRadius: "7px",
                          }}
                        >
                          <Datetime
                            style={{ borderWidth: 0, width: "80%" }}
                            timeFormat={false}
                            isValidDate={valid}
                            value={startDate}
                            inputProps={{
                              placeholder: "Start Date",
                            }}
                            onChange={(e) => this.setState({ startDate: e })}
                            // onBlur={this.closeTime}
                          />
                          <i
                            className="fe fe-close icen"
                            onClick={this.closeTime}
                          ></i>
                        </FormControl>
                      </div>
                      {showMediaLinks && (
                        <div style={{ background: "#fff", marginTop: "0" }}>
                          <div className={classes.cardBodyRefine}>
                            <Accordion
                              active={[0, 1, 2, 3, 4]}
                              activeColor="rose"
                              collapses={[
                                {
                                  title: "Adtype",
                                  content: (
                                    <div className={classes.customExpandPanel}>
                                      <div
                                        className={
                                          classes.checkboxAndRadio +
                                          " " +
                                          classes.checkboxAndRadioHorizontal
                                        }
                                        style={{ height: "120px" }}
                                      >
                                        {this.renderCategoriesMD()}
                                      </div>
                                    </div>
                                  ),
                                },
                                {
                                  title: "States",
                                  content: (
                                    <div className={classes.customExpandPanel}>
                                      <div
                                        className={
                                          classes.checkboxAndRadio +
                                          " " +
                                          classes.checkboxAndRadioHorizontal
                                        }
                                        style={{ height: "120px" }}
                                      >
                                        {this.renderStatesMD()}
                                      </div>
                                    </div>
                                  ),
                                },
                              ]}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
  }
                </div>

                <div>
                  <p>
                    <a
                      onClick={this.addMedia2}
                      data-toggle="collapse"
                      href="#collapseExample2"
                      role="button"
                      aria-expanded="false"
                      aria-controls="collapseExample"
                    >
                      <div className="sidebar-li">
                        <div>
                          <i
                            style={{ color: stage === 5 ? "blue" : null }}
                            class="fa fa-floppy-o"
                          ></i>
                        </div>
                        <span style={{ color: stage === 5 ? "blue" : null }}>
                          Saved Media Plan
                        </span>
                      </div>
                    </a>
                  </p>
                  { this.state.showSidebar ? '' : 

                  <div class="collapse" id="collapseExample2">
                    <FormControl fullWidth style={{ marginTop: -30 }}>
                      <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                      >
                        Load Saved Media Plans
                      </InputLabel>
                      <Select
                        // MenuProps={{
                        //   className: classes.selectMenu
                        // }}
                        // classes={{
                        //   select: classes.select
                        // }}
                        value={savedPlan}
                        onChange={(e) =>
                          savedPlanSelected(e.target.value, savedPlans)
                        }
                        inputProps={{
                          name: "simpleSelect",
                          id: "simple-select",
                        }}
                      >
                        {this.renderLoadedPlans()}
                      </Select>
                    </FormControl>
                  </div>
  }
                </div>

                <div className="sidebar-li" onClick={this.addOne}>
                  <div>
                    <i
                      style={{ color: stage === 1 ? "blue" : null }}
                      class="fa fa-bullseye"
                    ></i>
                  </div>
                  <span style={{ color: stage === 1 ? "blue" : null }}>
                    Branding
                  </span>
                </div>

                <div className="sidebar-li" onClick={this.addSix}>
                  <div>
                    <i
                      style={{ color: stage === 6 ? "blue" : null }}
                      class="fe fe-eye"
                    ></i>
                  </div>
                  <span style={{ color: stage === 6 ? "blue" : null }}>
                    Ad Monitoring
                  </span>
                </div>
                <div className="sidebar-li" onClick={this.addFour}>
                  <div>
                    <i
                      style={{ color: stage === 4 ? "blue" : null }}
                      class="fe fe-tiled"
                    ></i>
                  </div>
                  <span style={{ color: stage === 4 ? "blue" : null }}>
                    Orders
                  </span>
                </div>
                <div className="sidebar-li" onClick={this.addTwo}>
                  <div>
                    <i
                      style={{ color: stage === 2 ? "blue" : null }}
                      class="fe fe-user-plus"
                    ></i>
                  </div>
                  <span style={{ color: stage === 2 ? "blue" : null }}>
                    Account
                  </span>
                </div>
              </div>
            </div>
            
            <div className={`${ !this.state.showSidebar? "main" : "main2"}`} style={{ height: "110vh", overflow: "auto" }}>
              <div>
                {this.state.stage === 0 && (
                  <GridContainer justify="center" style={{ marginTop: 70 }}>
                    <Dashboard />
                  </GridContainer>
                )}
                {/* {this.renderViews()} */}
                {this.state.stage === 4 && (
                  <GridContainer>
                    <GridItem md={12} xs={12} sm={12}>
                      <div style={{ marginTop: 70 }}>
                        <div>
                          <h4
                            className={classes.title}
                            style={{ textAlign: "center", color: grayColor[1] }}
                          >
                            Recent Orders
                          </h4>
                        </div>
                      </div>
                      <Card>
                        <CardBody>{this.renderTable()}</CardBody>
                      </Card>
                    </GridItem>
                  </GridContainer>
                )}
                {this.state.stage === 5 && (
                  // <BookingDetails />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100vh",
                    }}
                  >
                    <h1>Please Select a Saved Plan</h1>
                  </div>
                )}
                {this.state.stage === 7 && (
                  <div className="booker">
                    <BookingDetails
                      classes={classes}
                      campaignTitle={this.state.campaignTitle}
                      totalPrice={totalPrice}
                      qtyAddReduce={(id, action) =>
                        addReduceQuantity(id, action)
                      }
                      resetPeriod={(id) => periodReset(id)}
                      locations={originalLocationsArray.filter(
                        (element) => element.userAddedQuantity > 0
                      )}
                      changePeriod={(id, period) => periodChange(id, period)}
                      toggle={() => showMDbooking(false)}
                      notApplicableChange={(id) => changeNotApplicable(id)}
                      submitUnpaid={() =>
                        submitAdspacesPaid(
                          originalLocationsArray.filter(
                            (element) => element.userAddedQuantity > 0
                          ),
                          startDate,
                          totalPrice,
                          campaignTitle,
                          0,
                          this.props.currency,
                          this.props.exchange
                        )
                      }
                      submit={() =>
                        submitAdspacesPaid(
                          originalLocationsArray.filter(
                            (element) => element.userAddedQuantity > 0
                          ),
                          startDate,
                          totalPrice + vat,
                          campaignTitle,
                          1,
                          this.props.currency,
                          this.props.exchange
                        )
                      }
                      saveLoader={saveLoader}
                      saveMessage={saveMessage}
                      saveError={saveError}
                      campaignTitle={campaignTitle}
                      campaignTitleChange={(value) =>
                        this.setState({ campaignTitle: value })
                      }
                      showError={() =>
                        toast.success(
                          "Note: Quantity increment will stop when it reaches the maximum quantity for the selected location",
                          {
                            className: "but_alert",
                          }
                        )
                      }
                      startDateChange={(date, location, row) =>
                        updateLocationWithStartEndDate(
                          "start",
                          date,
                          location,
                          row
                        )
                      }
                      endDateChange={(date, location, row) =>
                        updateLocationWithStartEndDate(
                          "end",
                          date,
                          location,
                          row
                        )
                      }
                      openRow={openRow}
                      openRowChange={(row) => updateOpenRow(row)}
                      onFileInputChange={(file, name, location) =>
                        fileInputChange(file, name, location)
                      }
                      savePlan={() =>
                        savePlanToUserObject(
                          originalLocationsArray.filter(
                            (element) => element.userAddedQuantity > 0
                          ),
                          campaignTitle,
                          totalPrice
                        )
                      }
                      startDate={startDate}
                    />
                  </div>
                )}

                {this.state.stage === 1 && (
                  <GridContainer justify="center" style={{ marginTop: 70 }}>
                    {this.renderBrands()}
                  </GridContainer>
                )}
                {this.state.stage === 6 && <Monitor />}
                {this.state.stage === 2 && (
                  <div>
                    <GridContainer justify="center" style={{ marginTop: 70 }}>
                      <GridItem md={6}></GridItem>
                    </GridContainer>
                    <GridContainer justify="center">
                      <GridItem md={10}>
                        <Card>
                          <h4
                            className={classes.title}
                            style={{ textAlign: "center", color: grayColor[1] }}
                          >
                            <i className="fe fe-user  acct_i"></i>
                          </h4>
                          <CardBody>
                            <GridContainer>
                              <GridItem sm={12} xs={12} md={4}>
                                <h6
                                  className="alert alert-info"
                                  style={{ paddingTop: 25, fontWeight: 600 }}
                                >
                                  User Name
                                </h6>
                              </GridItem>
                              <GridItem xs={12} sm={12} md={8}>
                                <CustomInput
                                  id="name"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    disabled: !isEdit,
                                    autoFocus: !isEdit,
                                    type: "text",
                                    value: isEdit
                                      ? displayName
                                      : user
                                      ? user.displayName || ""
                                      : "",
                                    onChange: (e) => {
                                      profileNameChange(e.target.value);
                                    },
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem sm={12} xs={12} md={4}>
                                <h6
                                  className="alert alert-info"
                                  style={{ paddingTop: 25, fontWeight: 600 }}
                                >
                                  Email
                                </h6>
                              </GridItem>
                              <GridItem xs={12} sm={12} md={8}>
                                <CustomInput
                                  id="campaign"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    disabled: true,
                                    type: "text",
                                    value: user ? user.email || "" : "",
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem sm={12} xs={12} md={4}>
                                <h6
                                  className="alert alert-info"
                                  style={{ paddingTop: 25, fontWeight: 600 }}
                                >
                                  AD WALLET
                                </h6>
                              </GridItem>
                              <GridItem xs={12} sm={12} md={8}>
                                <CustomInput
                                  id="campaign"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  inputProps={{
                                    disabled: true,
                                    type: "text",
                                    value: userInfo
                                      ? userInfo.adWallet
                                        ? userInfo.adWallet.balance
                                          ? formatCurrency(
                                              userInfo.adWallet.balance,
                                              1,
                                              "NGN"
                                            )
                                          : 0
                                        : 0
                                      : 0,
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                            <GridContainer>
                              <GridItem sm={12} xs={12} md={12}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      tabIndex={-1}
                                      onClick={() =>
                                        profileSubscribeChange(!subscribe)
                                      }
                                      checkedIcon={
                                        <Check
                                          className={classes.checkedIcon}
                                        />
                                      }
                                      icon={
                                        <Check
                                          className={classes.uncheckedIcon}
                                        />
                                      }
                                      classes={{
                                        checked: classes.checked,
                                        root: classes.checkRoot,
                                      }}
                                      checked={subscribe}
                                      disabled={!isEdit}
                                    />
                                  }
                                  classes={{
                                    label: classes.label,
                                    root: classes.labelRoot,
                                  }}
                                  label="Subscribe to receive updates and new blog posts in email?"
                                />
                              </GridItem>
                            </GridContainer>
                            <div className="acct_btn">
                              {error && (
                                <GridContainer>
                                  <GridItem xs={12} sm={12} md={6}>
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
                              <GridContainer>
                                <button
                                  className="btn btn-primary"
                                  color={isEdit ? "success" : "info"}
                                  onClick={() =>
                                    !isEdit
                                      ? editProfile(true)
                                      : this.handleSave()
                                  }
                                >
                                  {isEdit ? "SAVE PROFILE" : "EDIT PROFILE"}
                                </button>
                                {isEdit && (
                                  <GridItem xs={12} sm={12} md={4}>
                                    <Button
                                      color="danger"
                                      onClick={() => editProfile(false)}
                                    >
                                      CANCEL
                                    </Button>
                                  </GridItem>
                                )}
                              </GridContainer>
                              <GridContainer>
                                <button
                                  className="btn btn-success"
                                  simple={true}
                                  onClick={() =>
                                    this.setState({ changePasswordCard: true })
                                  }
                                >
                                  Change Password
                                </button>
                              </GridContainer>
                              <GridContainer>
                                <button
                                  className="btn btn-danger"
                                  simple={true}
                                  onClick={() =>
                                    this.setState({ deleteAccountModal: true })
                                  }
                                >
                                  {`Delete Account`}
                                </button>
                              </GridContainer>
                            </div>
                          </CardBody>
                        </Card>
                      </GridItem>
                    </GridContainer>
                    {changePasswordCard && (
                      <GridContainer justify="center">
                        <GridItem md={6}>
                          <Card>
                            <CardBody>
                              {changePasswordSuccess ? (
                                <>
                                  <GridContainer justify="center">
                                    <GridItem xs={12} sm={12} md={12}>
                                      <p className={classes.successMessage}>
                                        Your Password has Been changed
                                        Successfully!
                                      </p>
                                    </GridItem>
                                  </GridContainer>
                                  <GridContainer justify="center">
                                    <GridItem xs={12} sm={12} md={4}>
                                      <Button
                                        color="success"
                                        onClick={() =>
                                          this.setState({
                                            oldPassword: "",
                                            newPassword: "",
                                            confirmPassword: "",
                                            changePasswordCard: false,
                                            changePasswordMessage: "",
                                            changePasswordSuccess: false,
                                          })
                                        }
                                      >
                                        OK
                                      </Button>
                                    </GridItem>
                                  </GridContainer>
                                </>
                              ) : (
                                <>
                                  <GridContainer>
                                    <GridItem sm={12} xs={12} md={4}>
                                      <h6 style={{ paddingTop: 25 }}>
                                        Old Password
                                      </h6>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={8}>
                                      <CustomInput
                                        id="name"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          type: "password",
                                          value: oldPassword || "",
                                          onChange: (e) => {
                                            this.setState({
                                              oldPassword: e.target.value,
                                            });
                                          },
                                        }}
                                      />
                                    </GridItem>
                                  </GridContainer>
                                  <GridContainer>
                                    <GridItem sm={12} xs={12} md={4}>
                                      <h6 style={{ paddingTop: 25 }}>
                                        New Password
                                      </h6>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={8}>
                                      <CustomInput
                                        id="campaign"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          type: "password",
                                          value: newPassword || "",
                                          onChange: (e) => {
                                            this.setState({
                                              newPassword: e.target.value,
                                            });
                                          },
                                        }}
                                      />
                                    </GridItem>
                                  </GridContainer>
                                  <GridContainer>
                                    <GridItem sm={12} xs={12} md={4}>
                                      <h6 style={{ paddingTop: 25 }}>
                                        Confirm Password
                                      </h6>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={8}>
                                      <CustomInput
                                        id="campaign"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          type: "password",
                                          value: confirmPassword || "",
                                          onChange: (e) => {
                                            this.setState({
                                              confirmPassword: e.target.value,
                                            });
                                          },
                                        }}
                                      />
                                    </GridItem>
                                  </GridContainer>
                                  <GridContainer justify="center">
                                    <GridItem xs={12} sm={12} md={12}>
                                      <p
                                        style={{
                                          color: "#ef5350",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {changePasswordMessage || ""}
                                      </p>
                                    </GridItem>
                                  </GridContainer>
                                  <GridContainer justify="center">
                                    <GridItem xs={12} sm={12} md={4}>
                                      <Button
                                        color="success"
                                        onClick={() =>
                                          this.handleChangePassword()
                                        }
                                      >
                                        CHANGE
                                      </Button>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={4}>
                                      <Button
                                        color="danger"
                                        onClick={() =>
                                          this.setState({
                                            changePasswordCard: false,
                                          })
                                        }
                                      >
                                        CANCEL
                                      </Button>
                                    </GridItem>
                                  </GridContainer>
                                </>
                              )}
                            </CardBody>
                          </Card>
                        </GridItem>
                      </GridContainer>
                    )}
                  </div>
                )}

                {this.state.stage === 3 && (
                  <div
                    className={classes.main}
                    className="margin-body"
                    style={{ marginTop: 20 }}
                  >
                    <div className={classes.section}>
                      <div style={{ position: "relative" }}>
                        <div style={{ marginTop: 50, marginBottom: 50 }}></div>

                        {error && (
                          <GridContainer justify="center">
                            <GridItem xs={12} md={12} sm={12}>
                              <p
                                style={{ color: "#ef5350", fontWeight: "bold" }}
                              >
                                {message || ""}
                              </p>
                            </GridItem>
                          </GridContainer>
                        )}

                        {checkedTags.length === 0 &&
                        checkedCategories.length === 0 &&
                        checkedSubCategories.length === 0 &&
                        checkedStates.length === 0 &&
                        checkedCities.length === 0 ? (
                          <GridContainer style={{ marginTop: 150 }}>
                            <GridItem md={12} sm={12}>
                              <h4
                                style={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                              >
                                Please Choose Your filters on the left
                              </h4>
                            </GridItem>
                          </GridContainer>
                        ) : (
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
                                  <div>
                                    <h4
                                      style={{
                                        // textAlign: "center",
                                        fontWeight: "bold",
                                      }}
                                    >{`${
                                      locationsArray ? locationsArray.length : 0
                                    } Available Ad spaces.`}</h4>
                                  </div>
                                  <div>
                                    <div className="col-md-4">
                                      {/* <strong style={{marginRight: '8px', fontWeight: '900'}}>Sort By {' '}: {' '}</strong> */}
                                      <ReactSelect
                                        options={sortOptions}
                                        onChange={(e) =>
                                          sortMDLocations(e.value)
                                        }
                                        placeholder="Sort By"
                                        outlined={false}
                                        // styles={selectStyles}
                                        className="select-style"
                                      />
                                    </div>
                                  </div>

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

                                  <h4
                                    className={`${
                                      totalPrice === 0 ? "nav_con" : "nav_con"
                                    }`}
                                    onClick={this.sholl}
                                  >
                                     {/* <span>
                                     {formatCurrency(
                                      totalPrice || 0,
                                      this.props.exchange,
                                      this.props.currency
                                    )}
                                     </span> */}
                                     <Modals
        formatCurrency={formatCurrency}
        exchange={this.props.exchange}
        currency={this.props.currency}
        totalPrice={this.props.totalPrice}
        originalLocationsArray={
          this.props.originalLocationsArray
        }
        userAddedQuantity={
          this.state.userAddedQuantity
        }
        chartData={this.getChartData}
        location="Chart"
        legendPosition="bottom"
      />
                                    
                                  </h4>
                                  <button
                                    className="btn btn-primary btn-md"
                                    onClick={() => this.handleBookClick()}
                                    style={{
                                      marginRight: 20,
                                      color: "black",
                                      background: "yellow",
                                      border: 'none',
                                      fontWeight: 900
                                    }}
                                  >
                                    Next
                                  </button>
                                </div>
                              </div>
                            </GridItem>
                            <GridItem md={12} sm={9} xs={9}>
                              <GridContainer>
                                {this.renderMDAdSpaces()}
                              </GridContainer>
                            </GridItem>
                            {locationsArray && locationsArray.length > 0 && (
                              <GridItem md={12} sm={12} xs={12}>
                                <div
                                  j
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Pagination
                                    className={
                                      classes.textCenter +
                                      " " +
                                      classes.justifyContentCenter
                                    }
                                    pages={this.paginationArray(locationsArray)}
                                    color="primary"
                                  />
                                </div>
                              </GridItem>
                            )}
                          </GridContainer>
                        )}
                        {this.renderLocationDescription(classes)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

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

    success,
  } = profile;
  const { isAuthenticated, user } = login;
  const { agesArray, gendersArray, interestsArray, saveBrands } = branding;
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
    // success,
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
    saveBrands,
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
    logOut,
    setAuthenticated,
    editProfile,
    profileNameChange,
    profileSubscribeChange,
    getUser,
    displayProfileMessage,
    saveProfile,
    getUserOrders,
    getAgeGenderInterests,
    saveBrandsProfile,
    changeSelectedBrand,
    removeBrand,
    deleteAccount,

    getAllLocations,
    querySearch,
    addReduceQuantity,
    displayMDMessage,
    showMDbooking,
    periodChange,
    changeNotApplicable,
    submitAdspaces,
    submitAdspacesPaid,
    paginateLocations,
    sortMDLocations,
    updateLocationWithStartEndDate,
    updateOpenRow,
    fileInputChange,
    loadSavedPlan,
    savePlanToUserObject,
    savedPlanSelected,
    addReduceQuantityByInput,
    saveBrands,
    // locations
  }
)(withStyles(styles)(Profile));
