import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../components/Header/Header";
import "./mediaplanning.scss";
import HeaderLinks from "../../components/Header/HeaderLinks";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Slide,
  withStyles,
} from "@material-ui/core";
import {
  logOut,
  getAllLocations,
  querySearch,
  addReduceQuantity,
  displayMDMessage,
  showMDbooking,
  periodChange,
  changeNotApplicable,
  submitAdspaces,
  displayMDMessageBookingDetails,
  setAuthenticated,
  paginateLocations,
  sortMDLocations,
  submitAdspacesPaid,
  updateLocationWithStartEndDate,
  updateOpenRow,
  fileInputChange,
  loadSavedPlan,
  savePlanToUserObject,
  savedPlanSelected
} from "../../actions";
import styles from "../../assets/jss/material-kit-pro-react/views/ecommerceSections/productsStyle.js";
import GridContainer from "../../components/Grid/GridContainer";
import Pagination from "../../components/Pagination/Pagination";
import classNames from "classnames";
import GridItem from "../../components/Grid/GridItem";
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import Clearfix from "../../components/Clearfix/Clearfix";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "../../components/CustomButtons/Button";
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
    RefreshOutlined, BorderColor
} from "@material-ui/icons";
import Accordion from "../../components/Accordion/Accordion";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Footer from "../../components/Footer/Footer";
import CardHeader from "../../components/Card/CardHeader";
import _ from "underscore";
import CardFooter from "../../components/Card/CardFooter";
import Popover from "@material-ui/core/Popover";
import Badge from "../../components/Badge/Badge";
import Radio from "@material-ui/core/Radio";
import CustomInput from "../../components/CustomInput/CustomInput";
import { numberWithCommas, substringText, formatCurrency } from "../../utils";
import BookingDetails from "./BookingDetail.jsx";
import { element } from "prop-types";
import Instruction from "../../components/Instruction/Instruction";
import moment from "moment";
import { Link, Redirect } from "react-router-dom";
import Datetime from "react-datetime";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import Carousel from "react-slick";
import { mdPageSize } from "../../config";
import ReactSelect from "react-select";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

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
  { value: 1, label: "Price - Low To High" },
  { value: 2, label: "Price - High To Low" },
  { value: 3, label: "Alphabetical Order [A - Z]" },
  { value: 4, label: "Alphabetical Order [Z - A]" },
];

class MediaPlanning extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
      selectedEnabled: 0,
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

    };
  }

  componentDidMount() {
    document.title = 'Adspace.ng – Media Planning | Advert Space | Billboards | Television |Newspaper | Radio | Influencer | Magazine';
    this.props.getAllLocations();
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

  handleToggleCats(value){
    const { checkedTags, checkedCategories, priceRangeV2 , selectedEnabled,checkedSubCategories, subCategoriesSelectedCategory
      , checkedStates, checkedCities, citiesSelectedState } = this.state;
    const { tagsArray, categoriesArray, subCategoriesArray, querySearch, originalLocationsArray, statesArray, locationsArray } = this.props;
    const currentIndex = checkedCategories.indexOf(value);
    const newChecked = [...checkedCategories];
    let filteredSubCats = subCategoriesArray.filter(cat => cat.cat_id === categoriesArray[value].id);
    if (currentIndex === -1) {
      newChecked.push(value);
      if (subCategoriesSelectedCategory.length === 0){
        filteredSubCats.map(cat => {
          subCategoriesSelectedCategory.push(cat);
        })
      }else{
        filteredSubCats.map(flCat => {
          if (!_.contains(subCategoriesSelectedCategory, flCat))
            subCategoriesSelectedCategory.push(flCat);
        })
      }
      querySearch(checkedTags, newChecked, tagsArray, categoriesArray, originalLocationsArray, priceRangeV2[selectedEnabled],
          checkedSubCategories, subCategoriesSelectedCategory, checkedStates, checkedCities, citiesSelectedState, statesArray, locationsArray);

      this.setState({checkedCategories: newChecked, subCategoriesSelectedCategory: subCategoriesSelectedCategory, pageNumber: 0, reset: false });
    } else {
      newChecked.splice(currentIndex, 1);
      filteredSubCats.map(flCat => {
        let ind = subCategoriesSelectedCategory.indexOf(flCat);
        if (ind !== -1)
          subCategoriesSelectedCategory.splice(ind, 1);
      });
      querySearch(checkedTags, newChecked, tagsArray, categoriesArray, originalLocationsArray, priceRangeV2[selectedEnabled],
          [], subCategoriesSelectedCategory, checkedStates, checkedCities, citiesSelectedState, statesArray, locationsArray);

      this.setState({checkedCategories: newChecked, subCategoriesSelectedCategory: subCategoriesSelectedCategory, pageNumber: 0,
        reset: false});
    }

  };

  handleToggleState(value){
    const { checkedTags, checkedCategories, priceRangeV2 , selectedEnabled,checkedSubCategories, subCategoriesSelectedCategory
      , checkedStates, checkedCities, citiesSelectedState } = this.state;
    const { tagsArray, categoriesArray, subCategoriesArray, querySearch, originalLocationsArray, statesArray, citiesArray, locationsArray } = this.props;
    const currentIndex = checkedStates.indexOf(value);
    const newChecked = [...checkedStates];
    let filteredCities = citiesArray.filter(city => city.state_id === statesArray[value].id);

    if (currentIndex === -1) {
      newChecked.push(value);
      if (citiesSelectedState.length === 0){
        filteredCities.map(city => {
          citiesSelectedState.push(city);
        })
      }else{
        filteredCities.map(flCity => {
          if (!_.contains(citiesSelectedState, flCity))
            citiesSelectedState.push(flCity);
        });
      }

      querySearch(checkedTags, checkedCategories, tagsArray, categoriesArray, originalLocationsArray, priceRangeV2[selectedEnabled],
          checkedSubCategories, subCategoriesSelectedCategory, newChecked, checkedCities, citiesSelectedState, statesArray, locationsArray);

      this.setState({checkedStates: newChecked, citiesSelectedState: citiesSelectedState, pageNumber: 0, reset: false });
    } else {
      newChecked.splice(currentIndex, 1);
      filteredCities.map(flCity => {
        let ind = citiesSelectedState.indexOf(flCity);
        if (ind !== -1)
          citiesSelectedState.splice(ind, 1);
      });

      querySearch(checkedTags, checkedCategories, tagsArray, categoriesArray, originalLocationsArray, priceRangeV2[selectedEnabled],
          checkedSubCategories, subCategoriesSelectedCategory, newChecked, checkedCities, citiesSelectedState, statesArray, locationsArray);

      this.setState({checkedStates: newChecked,  citiesSelectedState: citiesSelectedState, pageNumber: 0, reset: false });
    }
  }

  handleToggleSubCats(value){
    const { checkedTags, checkedCategories, priceRangeV2 , selectedEnabled,checkedSubCategories, subCategoriesSelectedCategory
      , checkedStates, checkedCities, citiesSelectedState } = this.state;
    const { tagsArray, categoriesArray, subCategoriesArray, querySearch, originalLocationsArray, statesArray, citiesArray , locationsArray} = this.props;
    const currentIndex = checkedSubCategories.indexOf(value);
    const newChecked = [...checkedSubCategories];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    querySearch(checkedTags, checkedCategories, tagsArray, categoriesArray, originalLocationsArray, priceRangeV2[selectedEnabled],
        newChecked, subCategoriesSelectedCategory, checkedStates, checkedCities, citiesSelectedState, statesArray, locationsArray);

    this.setState({checkedSubCategories: newChecked, pageNumber: 0, reset: false});
  };

  handleToggleCity(value){
    const { checkedTags, checkedCategories, priceRangeV2 , selectedEnabled,checkedSubCategories, subCategoriesSelectedCategory
      , checkedStates, checkedCities, citiesSelectedState } = this.state;
    const { tagsArray, categoriesArray, subCategoriesArray, querySearch, originalLocationsArray, statesArray, citiesArray , locationsArray} = this.props;
    const currentIndex = checkedCities.indexOf(value);
    const newChecked = [...checkedCities];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    querySearch(checkedTags, checkedCategories, tagsArray, categoriesArray, originalLocationsArray, priceRangeV2[selectedEnabled],
        checkedSubCategories, subCategoriesSelectedCategory, checkedStates, newChecked, citiesSelectedState, statesArray, locationsArray);

    this.setState({checkedCities: newChecked, pageNumber: 0, reset: false});
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
          <span className={classNames(classes.price, classes.priceOld)} style={{ color: "#000" }}>
            {numberWithCommas(
              formatCurrency(
                location.price || "",
                this.props.exchange,
                this.props.currency
              )
            )}
            : {location.pricingOption.name}
          </span>
          <span className={classNames(classes.price, classes.priceNew)} style={{ color: "#000" }}>
            {numberWithCommas(
              formatCurrency(
                location.discountedPrice.value || 0,
                this.props.exchange,
                this.props.currency
              )
            )}
             {' '}{location.pricingOption.name}
          </span>
        </>
      );
    } else {
      return (
        <>
        <span className={classNames(classes.price, classes.priceNew)} style={{ color: "#000", }}>
          {numberWithCommas(
            formatCurrency(
              location.price || "",
              this.props.exchange,
              this.props.currency
            )
          )}
            {' '}{location.pricingOption.name}
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
    } = this.props;
    const { noticeModal, location, pageNumber } = this.state;
    let paginatedArray = [];

    if (locationsArray && locationsArray.length > 0) {
      paginatedArray = locationsArray.slice(
        pageNumber * mdPageSize,
        (pageNumber + 1) * mdPageSize
      );
      return paginatedArray.map((location, index) => {
        console.log(location, 'location')
        return (
          <GridItem md={6} sm={4} key={index}>
              <Card className="card" >
                {/* <CardHeader noShadow image onClick={() => this.setState({ noticeModal: !noticeModal, location: location})}> */}
                <div style={{position: 'relative'}}>
                <a href={`/mediaplanning-details/${location.id}`} target="_blank">
                  <img
                    width="100%"
                    src={location.resizedImages ? (location.resizedImages[0] || '') : (location.images ? (location.images[0]) : '')}
                    alt={location.name ? substringText(location.name, 53).toLowerCase() : ""}
                    height="250"
                  />
                </a>

                  <div className="view-more">
                    Click to see details
                  </div>
                </div>
                {/* </CardHeader> */}
                <CardBody
                  style={{ textAlign: "center" , height: '100%'}}
                  plain
                  // onClick={() =>
                  //   this.setState({
                  //     noticeModal: !noticeModal,
                  //     location: location,
                  //   })
                  // }
                >
                  {/* <a href="#pablo"> */}
                  <a href={`/mediaplanning-details/${location.id}`} target="_blank">
                    <h4 style={{
                      textTransform: "capitalize",
                      fontSize: 20,
                      lineHeight: "30px",
                      fontWeight: "Bold",
                      color: "#0b28ba",
                    }} className={classes.cardTitle}>
                      {location.name ? location.name : ""}
                    </h4>
                  </a>
                  {/* </a> */}
                  <p className={classes.description} style={{ color: "#000", fontSize: 18, marginTop: 15 }}>
                    {`${location.category ? location.category.name : ""}`}
                  </p>
                  <p className={classes.description} style={{ color: "#000", fontSize: 18 }}>
                    Available Quantity: {location.quantity || ""}
                  </p>
                  <p style={{ color: "#000", fontSize: 18}}>{location ? !location.traffic.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ? `Traffic: ${0}` : `Traffic: ${location.traffic}` :  0} {' '}{location && location.trafficOption ? location.trafficOption.name : ''}</p>
                  <p style={{ color: "#000", fontSize: 18, marginTop: 15 }}>
                    {location.size
                      ? "Size: " + location.size || ""
                      : "Duration (seconds): " + location.duration ||
                        "" + " , Quantity: " + location.quantity ||
                        ""}
                      {' '}{location && location.sizingOption ? location.sizingOption.name : ''}
                  </p>
                  {/* {this.renderTagsAdspace(location)} */}
                </CardBody>
                  <div style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    textAlign: 'center'
                  }}>
                    <div className={classes.price} style={{ marginTop: 8 }}>
                      <p style={{ fontWeight: "bold", marginTop: 5, fontSize: 18, color: '#0a24a7'}}>
                        <span style={{color: '#0a24a7'}}>Admatch: </span>
                        {`${
                        location.count ? (location.count / 5) * 100 : "0"
                      }%`}
                      
                      </p>
                    </div>
                    <span key={index} style={{ color: "#000", fontSize: "18px", fontWeight: 'bold' }}>
                      {location.userAddedQuantity || 0}
                      {` `}
                      <div className={classes.buttonGroup}>
                        <Button
                          color="info"
                          size="sm"
                          round
                          className={classes.firstButton}
                          onClick={() =>
                            location.userAddedQuantity > 0
                              ? addReduceQuantity(location.id, "reduce")
                              : ""
                          }
                        >
                          <Remove />
                        </Button>
                        <Button
                          color="info"
                          size="sm"
                          round
                          className={classes.lastButton}
                          onClick={() =>
                            location.userAddedQuantity >= location.quantity
                              ? displayMDMessage(
                                  "Note: Quantity increment will stop when it reaches the maximum quantity for the selected location"
                                )
                              : addReduceQuantity(location.id, "add")
                          }
                        >
                          <Add />
                        </Button>
                      </div>
                    </span>
                  </div>

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
                      {this.renderDiscount(location.discountedPrice, location)}
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
          </GridItem>
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

  renderCategoriesMD(){
    const { classes, categoriesArray } = this.props;
    const { checkedCategories, reset } = this.state;
    if (categoriesArray && categoriesArray.length > 0){
      return categoriesArray.map((cat, index) => {
        return (
            <div>
              <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                        tabIndex={-1}
                        onClick={() => this.handleToggleCats(index)}
                        checked={
                          checkedCategories.indexOf(index) !== -1
                        }
                        checkedIcon={
                          <Check className={classes.checkedIcon} />
                        }
                        icon={
                          <Check className={classes.uncheckedIcon} />
                        }
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot
                        }}
                    />
                  }
                  classes={{ label: classes.label }}
                  label={<Typography style={{ fontSize: 16}}>{cat.name || ''}</Typography>}
              />
              {!reset &&
              <div style={{ marginLeft: 10}}>
                {this.renderUnderSubCategoriesMD(cat)}
              </div>
              }
            </div>
        )
      });
    }

    return null;
  }

  renderUnderSubCategoriesMD(category){
    const { classes, subCategoriesArray } = this.props;
    const { checkedSubCategories, subCategoriesSelectedCategory } = this.state;
    if (subCategoriesSelectedCategory && subCategoriesSelectedCategory.length > 0){
      return subCategoriesSelectedCategory.map((subCat, index) => {
        if (category.id === subCat.cat_id){
          return (
              <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                        tabIndex={-1}
                        onClick={() => this.handleToggleSubCats(index)}
                        checked={
                          checkedSubCategories.indexOf(index) !== -1
                        }
                        checkedIcon={
                          <Check className={classes.checkedIcon} />
                        }
                        icon={
                          <Check className={classes.uncheckedIcon} />
                        }
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot
                        }}
                    />
                  }
                  classes={{ label: classes.label }}
                  label={<Typography style={{ fontSize: 15, wordWrap: "break-word", paddingLeft: 10}}>{subCat.name || ''}</Typography>}
              />
          )
        }else return null
      });
    }

    return null;
  }

  renderStatesMD(){
    const { classes, statesArray } = this.props;
    const { checkedStates, reset } = this.state;
    if (statesArray && statesArray.length > 0){
      return statesArray.map((state, index) => {
        return(
            <div>
              <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                        tabIndex={-1}
                        onClick={() => this.handleToggleState(index)}
                        checked={
                          checkedStates.indexOf(index) !== -1
                        }
                        checkedIcon={
                          <Check className={classes.checkedIcon} />
                        }
                        icon={
                          <Check className={classes.uncheckedIcon} />
                        }
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot
                        }}
                    />
                  }
                  classes={{ label: classes.label }}
                  label={<Typography style={{ fontSize: 16}}>{state.name || ''}</Typography>}
              />
              {!reset &&
              <div style={{ marginLeft: 10}}>
                {this.renderCitiesUnderStatesMD(state)}
              </div>
              }
            </div>
        )
      })
    }
  }

  renderCitiesUnderStatesMD(state){
    const { classes } = this.props;
    const { checkedCities, citiesSelectedState } = this.state;
    if (citiesSelectedState && citiesSelectedState.length > 0){
      return citiesSelectedState.map((city, index) => {
        if (city.state_id === state.id){
          return (
              <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                        tabIndex={-1}
                        onClick={() => this.handleToggleCity(index)}
                        checked={
                          checkedCities.indexOf(index) !== -1
                        }
                        checkedIcon={
                          <Check className={classes.checkedIcon} />
                        }
                        icon={
                          <Check className={classes.uncheckedIcon} />
                        }
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot
                        }}
                    />
                  }
                  classes={{ label: classes.label }}
                  label={<Typography style={{ fontSize: 15, wordWrap: "break-word", paddingLeft: 10}}>{city.name || ''}</Typography>}
              />
          )
        }else return null
      })
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

  handleBookClick() {
    const { totalPrice, displayMDMessage, showMDbooking } = this.props;
    if (totalPrice === 0)
      displayMDMessage(
        "YOU DO NOT HAVE ANY ADSPACES, ADD QUANTITY TO ANY ADSPACE UNDER MEDIA PLANNING"
      );
    else showMDbooking(true);
  }

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

  renderLoadedPlans(){
    const { classes, savedPlans } = this.props;
    if (savedPlans && savedPlans.length > 0){
      return savedPlans.map((plan, index) => {
        return(
            <MenuItem key={index}
                classes={{
                  root: classes.selectMenuItem,
                  selected: classes.selectMenuItemSelected
                }}
                value={plan.brandName || ''}
            >
              {plan.brandName || ''}
            </MenuItem>
        )
      })
    }
  }

  render() {
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
      classes,
      user,
      loading,
      error,
      message,
      isAuthenticated,
      logOut,
      getAllLocations,
      tagsArray,
      addReduceQuantity,
      categoriesArray,
      querySearch,
      locationsArray,
      originalLocationsArray,
      totalPrice,
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
      openRow, updateOpenRow,
      fileInputChange,
      loadSavedPlan,
      savePlanToUserObject,
      savedPlan,
      savedPlanSelected,
      savedPlans,
      showSidebar
    } = this.props;

    if (!isAuthenticated) {
      return (
        <Redirect
          to={{ pathname: "/login" }}
        />
      );
    }

    let vat = (7.5 / 100) * totalPrice
    // if (success) {
    //   return (
    //     <Redirect exact
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

    if (showMDDetails) {
      return (
        <div>
          <Header
            // brand="ADSPACE"
            links={
              <HeaderLinks
                dropdownHoverColor="rose"
                isAuthenticated={isAuthenticated}
                user={user}
                logOutUser={() => logOut()}
              />
            }
          />
          {loading && <LinearProgress />}
          <div className={classes.main}>
            <div className={classes.section}>
              <div className={classes.container}>
                <BookingDetails
                  classes={classes}
                  campaignTitle={this.state.campaignTitle}
                  totalPrice={totalPrice}
                  qtyAddReduce={(id, action) => addReduceQuantity(id, action)}
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
                  showSidebar={this.props.showSidebar}
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
                  showError={(message) =>
                    displayMDMessageBookingDetails(message)
                  }
                  startDateChange={(date, location, row) => updateLocationWithStartEndDate('start',date, location, row)}
                  endDateChange={(date, location, row) => updateLocationWithStartEndDate('end', date, location, row)}
                  openRow={openRow}
                  openRowChange={(row) => updateOpenRow(row)}
                  onFileInputChange={(file, name, location) => fileInputChange(file, name, location)}
                  savePlan={() => savePlanToUserObject(originalLocationsArray.filter((element) => element.userAddedQuantity > 0), campaignTitle, totalPrice)}
                  startDate={startDate}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Header
          brand="ADSPACE"
          links={
            <HeaderLinks
              dropdownHoverColor="rose"
              isAuthenticated={isAuthenticated}
              user={user}
              logOutUser={() => logOut()}
            />
          }
          // color="dark"
          // changeColorOnScroll={{
          //     height: 300,
          //     color: "info"
          // }}
        />
        {loading && <LinearProgress />}

        <div className={classes.main}>
          <div className={classes.section}>
            <div className={classes.container} style={{position: 'relative'}}>
              <div className="try-wrapper">
                <GridItem xs={12} md={9} sm={12}>
                  <h2>Plan. Buy. Monitor.</h2>
                </GridItem>

                <GridItem xs={12} md={2} sm={12} className={`${this.props.showSidebar ? 'try': 'try2'}`}>
                  <Card style={{ backgroundColor: "rgb(230, 47, 45)" }}>
                    <CardBody
                      onClick={() => this.handleBookClick()}
                      color
                      style={{
                        flexDirection: "row",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          cursor: "pointer",
                          color: "#fff"
                        }}
                      >
                        Continue:
                        {formatCurrency(
                          totalPrice || 0,
                          this.props.exchange,
                          this.props.currency
                        )}
                      </h4>
                    </CardBody>
                  </Card>
                </GridItem>
              </div>
              {/* <div className="try-wrapper">
                <GridItem xs={12} md={3} sm={12}>
                  <FormControl fullWidth className={classes.selectFormControl}>
                    <InputLabel
                        htmlFor="simple-select"
                        className={classes.selectLabel}
                    >
                      Load Saved Media Plans
                    </InputLabel>
                    <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={savedPlan}
                        onChange={(e) => savedPlanSelected(e.target.value, savedPlans)}
                        inputProps={{
                          name: "simpleSelect",
                          id: "simple-select"
                        }}
                    >
                      {this.renderLoadedPlans()}
                    </Select>
                  </FormControl>
                </GridItem>
              </div> */}
              <div style={{marginTop: 50, marginBottom: 50}}></div>

              {error && (
                <GridContainer justify="center">
                  <GridItem xs={12} md={9} sm={12}>
                    <p style={{ color: "#ef5350", fontWeight: "bold" }}>
                      {message || ""}
                    </p>
                  </GridItem>
                </GridContainer>
              )}
              <GridContainer>
                <GridItem md={3} sm={3}>
                  <div style={{background: '#fff', height: 'auto', marginTop: 70}}>

                  <div className="try-wrapper">
                    <GridItem xs={12} md={12} sm={12}>
                      <FormControl fullWidth className={classes.selectFormControl}>
                        <InputLabel
                            htmlFor="simple-select"
                            className={classes.selectLabel}
                        >
                          Load Saved Media Plans
                        </InputLabel>
                        <Select
                            MenuProps={{
                              className: classes.selectMenu
                            }}
                            classes={{
                              select: classes.select
                            }}
                            value={savedPlan}
                            onChange={(e) => savedPlanSelected(e.target.value, savedPlans)}
                            inputProps={{
                              name: "simpleSelect",
                              id: "simple-select"
                            }}
                        >
                          {this.renderLoadedPlans()}
                        </Select>
                      </FormControl>
                    </GridItem>
                  </div>
                    <CardBody className={classes.cardBodyRefine}>

                      <div
                        className={classes.cardTitle + " " + classes.textLeft}
                        style={{ marginBottom: 50, overflow: 'hidden', paddingLeft: 22, paddingRight: 18 }}
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
                                reset: true
                              })
                            }
                          >
                            <FormatColorResetOutlined />
                            reset
                          </Button>
                        </Tooltip>
                        <Clearfix />
                      </div>
                      <div style={{marginTop: '20px'}}>
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
                      </div>
                      <Accordion
                        active={[0, 1, 2, 3, 4]}
                        activeColor="rose"
                        collapses={[
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
                                >
                                  {this.renderStatesMD()}
                                </div>
                              </div>
                            ),
                          },
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
                                >
                                  {this.renderCategoriesMD()}
                                </div>
                              </div>
                            ),
                          },
                          /*{
                            title: "Tags",
                            content: (
                              <div className={classes.customExpandPanel}>
                                <div
                                  className={
                                    classes.checkboxAndRadio +
                                    " " +
                                    classes.checkboxAndRadioHorizontal
                                  }
                                >
                                  {this.renderTagsMD()}
                                </div>
                              </div>
                            ),
                          },*/
                        ]}
                      />
                    </CardBody>
                  </div>
                </GridItem>
                <GridItem md={9} sm={9}>
                  {checkedTags.length === 0 &&
                  checkedCategories.length === 0 &&
                  checkedSubCategories.length === 0 &&
                  checkedStates.length === 0 &&
                  checkedCities.length === 0 ? (
                    <GridContainer
                      justify="center"
                      style={{ alignItems: "center", marginTop: 150 }}
                    >
                      <GridItem
                        md={12}
                        sm={12}
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <h4 style={{ textAlign: "center", fontWeight: "bold" }}>
                          Please Choose Your filters on the left
                        </h4>
                      </GridItem>
                    </GridContainer>
                  ) : (
                    <GridContainer>
                      <GridItem md={12} sm={12} xs={12}>
                        <GridContainer>
                          <GridItem md={4} />
                          <GridItem
                            md={4}
                            className={classNames(
                              classes.mlAuto,
                              classes.mrAuto
                            )}
                          >
                            <h4
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >{`${
                              locationsArray ? locationsArray.length : 0
                            } Available Ad spaces.`}</h4>
                          </GridItem>
                          <GridItem
                            md={4}
                            className={classNames(
                              classes.mlAuto,
                              classes.mrAuto
                            )}
                          >
                            <GridContainer>
                              <GridItem md={2} />
                              <GridItem xs={12} sm={12} md={10}>
                                <div>
                                  <ReactSelect
                                    options={sortOptions}
                                    onChange={(e) => sortMDLocations(e.value)}
                                    placeholder="Sort By"
                                    outlined={false}
                                    styles={selectStyles}
                                  />
                                </div>
                              </GridItem>
                            </GridContainer>
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      <GridItem
                        md={12}
                        sm={12}
                        xs={12}
                      >
                        <GridContainer style={{width:'100%'}}>{this.renderMDAdSpaces()}</GridContainer>
                      </GridItem>
                      {locationsArray && locationsArray.length > 0 && (
                        <GridItem md={12} sm={12} xs={12}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
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
                </GridItem>
              </GridContainer>
              {this.renderLocationDescription(classes)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const selectStyles = { menu: (styles) => ({ ...styles, zIndex: 999 }) };

const mapStateToProps = ({ mediaplanning, login, paymentType }) => {
  const {
    loading,
    error,
    message,
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
    showSidebar

  } = mediaplanning;

  const { isAuthenticated, user } = login;
  const { currency, exchange } = paymentType;
  return {
    loading,
    error,
    message,
    isAuthenticated,
    user,
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
    showSidebar

  };
};

export default connect(
  mapStateToProps,
  {
    logOut,
    getAllLocations,
    querySearch,
    addReduceQuantity,
    displayMDMessage,
    showMDbooking,
    periodChange,
    changeNotApplicable,
    submitAdspaces,
    submitAdspacesPaid,
    displayMDMessageBookingDetails,
    paginateLocations,
    sortMDLocations,
    updateLocationWithStartEndDate,
    updateOpenRow,
    fileInputChange,
    loadSavedPlan,
    savePlanToUserObject,
    savedPlanSelected
  }
)(withStyles(styles)(MediaPlanning));