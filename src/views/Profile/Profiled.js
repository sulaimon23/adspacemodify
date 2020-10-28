import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../components/Header/Header";
import HeaderLinksTwo from "../../components/Header/HeaderLinksTwo";
import LocationOnIcon from '@material-ui/icons/LocationOn';
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
    savedPlanSelected
} from "../../actions";
// import shoppingCartStyle from "../../assets/jss/material-kit-pro-react/views/shoppingCartStyle.js";
import { CircularProgress, DialogContent, LinearProgress, withStyles } from "@material-ui/core";
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
      RefreshOutlined, BorderColor,
      KeyboardArrowRight
  } from "@material-ui/icons";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "../../components/CustomButtons/Button";
import { grayColor } from "../../assets/jss/material-kit-pro-react";
import Badge from "../../components/Badge/Badge";
import { Redirect } from "react-router-dom";
import ReactTable from "react-table"
import moment from 'moment';
import CardHeader from "../../components/Card/CardHeader";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import SideNav from "../../components/Sidenav/Sidenav";
import './Profile.scss'
import Upload from "./Upload";
import { numberWithCommas, substringText, formatCurrency } from "../../utils";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import Carousel from "react-slick";
import Typography from "@material-ui/core/Typography";
import Instruction from "../../components/Instruction/Instruction";
import Tooltip from "@material-ui/core/Tooltip";
import Datetime from "react-datetime";
import classNames from "classnames";

import BookingDetails from "../MediaPlanning/BookingDetails"
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
            branding: '',
            brands: [{
                ages: [], gender: '', interests: [], brandName: ''
            }],
            showMediaLinks: false,
            stage: 0,
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            changePasswordCard: false,
            changePasswordMessage: '',
            changePasswordSuccess: false,
            deleteAccountModal: false,
            deleteEmail: '', deletePassword: '',

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
        }
    }

    componentDidMount() {
        getAuth().onAuthStateChanged((user) => {
            if (user) {
                if (user.emailVerified === true)
                    this.props.setAuthenticated(true, user);
                else
                    this.props.setAuthenticated(false, user);
                this.props.getUser(user.email);
                this.props.getUserOrders(user.email);
            } else {
                this.props.setAuthenticated(false, user);
            }
            this.props.getAgeGenderInterests();
        });

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
                )}
                 {' '}{location.pricingOption.name}
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
                <div className="col-xl-6 col-sm-12 col-12">
                    
                  <Card className="card-media" product>                    
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
                    <CardBody
                      style={{ textAlign: "center" , height: '100%'}}
                      plain
                    >
                      {/* <a href="#pablo"> */}
                      <a href={`/mediaplanning-details/${location.id}`} target="_blank">
                        <h4 style={{
                          textTransform: "capitalize",
                          fontSize: 14,
                          lineHeight: "30px",
                          fontWeight: "9000",
                          color: "#0b28ba",
                        }} className={classes.cardTitle}>
                          {location.name ? substringText(location.name, 60) : ""}
                        </h4>
                      </a>
                      {/* </a> */}
                      <p className={classes.description} style={{ color: "#000", fontSize: 15, marginTop: 15 }}>
                        {`${location.category ? location.category.name : ""}`}
                      </p>
                      <p className={classes.description} style={{ color: "#000", fontSize: 15 }}>
                        Available Quantity: {location.quantity || ""}
                      </p>
                      <p style={{ color: "#000", fontSize: 15}}>{location ? !location.traffic.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ? `Traffic: ${0}` : `Traffic: ${location.traffic}` :  0} {' '}{location && location.trafficOption ? location.trafficOption.name : ''}</p>
                      <p style={{ color: "#000", fontSize: 15, marginTop: 15 }}>
                        {location.size
                          ? "Size: " + location.size || ""
                          : "Duration (seconds): " + location.duration ||
                            "" + " , Quantity: " + location.quantity ||
                            ""}
                          {' '}{location && location.sizingOption ? location.sizingOption.name : ''}
                      </p>
                    </CardBody>
                      <div style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        textAlign: 'center'
                      }}>
                        <div className={classes.price} style={{ marginTop: 8 }}>
                          <p style={{ fontWeight: "bold", marginTop: 5, fontSize: 15, color: '#0a24a7'}}>
                            <span style={{color: '#0a24a7'}}>Admatch: </span>
                            {`${
                            location.count ? (location.count / 5) * 100 : "0"
                          }%`}
                          
                          </p>
                        </div>
                        <div>
                            <spa style={{ color: "#000", fontSize: "15px", fontWeight: 'bold' }}>
                                {location.userAddedQuantity || 0}
                            </spa>
                        </div>
                        <span key={index} style={{ color: "#000", fontSize: "18px", fontWeight: 'bold' }}>
                          {` `}
                          <div className={classes.buttonGroup}>
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
                              style={{background: '#2962ff'}}
                            >
                              <Remove />
                            </Button>
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
                                  : addReduceQuantity(location.id, "add")
                              }
                              style={{background: '#2962ff'}}
                            >
                              <Add />
                            </Button>
                          </div>
                        </span>
                      </div>
                      <hr class="solid"></hr>
                      <div className="billFooter">
                            <h5 style={{fontSize: '12px', paddingTop: '10px'}}>
                                {this.renderDiscount(location.discountedPrice, location)}
                            </h5>

                            <h5 style={{fontSize: '12px', paddingTop: '10px', display: 'flex'}}> 
                                <LocationOnIcon/> 
                                
                                { location.state && location.state.name === 'Nation Wide' ? (<span>{location.city.name}</span>) : (
                                    // {`${location.city ? location.city.name || "" : ""}, ${
                                    //     location.state ? location.state.name || "" : ""
                                    // }`}
                                    <div>
                                        <span>{location.city.name}</span> {' , '}
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
                      label={<Typography style={{ fontSize: 13}}>{cat.name || ''}</Typography>}
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
                      label={<Typography style={{ fontSize: 14}}>{state.name || ''}</Typography>}
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
                      label={<Typography style={{ fontSize: 12, wordWrap: "break-word", paddingLeft: 10}}>{city.name || ''}</Typography>}
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
            "YOU DO NOT HAVE ANY ADSPACES, ADD QUANTITY TO ANY ADSPACE YOU LIKE"
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





    openNav() {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
    }

    closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
    }

    handleSave() {
        const { displayName, subscribe, displayProfileMessage, saveProfile, user, userInfo } = this.props;
        if (displayName === '')
            displayProfileMessage("USER NAME CANNOT BE EMPTY");
        else
            saveProfile(user, displayName, subscribe, userInfo);
    }

    renderOrders() {
        const { classes, ordersArray } = this.props;
        if (ordersArray && ordersArray.length > 0) {
            return ordersArray.map((order, index) => {
                return [
                    order.id || '',
                    "22/11/2019",
                    order ? (order.location ? order.location.name : '') : '',
                    this.componentRender('image', order, index, classes),
                    this.componentRender('price', order, index, classes),
                    order ? (order.quantity || '') : '',
                    this.componentRender('status', order, index, classes),
                    this.componentRender('upload', order, index, classes),
                ]
            })
        }
        return [];
    }


    componentRender(render, order, index, classes) {
        if (render === 'image') {
            return (
                <div className={classes.imgContainer} key={index}>
                    <img src={order ? (order.location ? (order.location.imageUrl || 'https://picsum.photos/id/400/500/500') : 'https://picsum.photos/id/400/500/500') : 'https://picsum.photos/id/400/500/500'}
                        alt="..." className={classes.img} style={{height: 60, width: 60}} />
                </div>
            )
        } else if (render === 'price') {
            return (
                <span key={index}> {order ? (order.totalPrice ? formatCurrency(order.totalPrice, order.exchange, order.currency) : '') : ''}</span>

            )
        } else if (render === 'status') {
            let status_ = 'PENDING', color = 'warning';
            if (order.status === 0) { status_ = 'PENDING'; color = 'warning' }
            else if (order.status === 1) { status_ = 'CONFIRMED'; color = 'info' }
            else if (order.status === 2) { status_ = 'PAID'; color = 'success' }
            else if (order.status === 3) { status_ = 'COMPLETED'; color = 'success' }
            else if (order.status === 4) { status_ = 'CANCELED'; color = 'danger' }
            else { status_ = 'PENDING'; color = 'warning' }
            return (
                <div className="actions-center">
                    <Badge color={color}>{status_}</Badge>
                </div>
            )
        } else if (render === 'upload') {
            return (<div style={{fontSize: '15px'}}>
                {order.status !== 1 && !order.isUploaded ? (<Upload order={order} />) :
                    order.isUploaded ? (<Badge  color={"success"}>UPLOADED</Badge>) : ""}
            </div>)
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
                    key: order.id, orderno: order.id || '', location_name: order.location ? (order.location ? order.location.name : '') : '',
                    price: this.componentRender('price', order, index, classes),
                    // orderdt: order.created_at ? moment(order.created_at.toDate()).format('YYYY-MM-DD hh:mm:ss') : '',
                    quantity: order.quantity,
                    image: this.componentRender('image', order, index, classes),
                    status: this.componentRender('status', order, index, classes),
                    upload: this.componentRender('upload', order, index, classes),
                }
            });
        }

        function _filterCaseInsensitive(filter, row) {
            const id = filter.pivotId || filter.id;
            return (
                row[id] !== undefined ?
                    String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
                    :
                    true
            );
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
                        filterable: false
                    },
                    {
                        Header: "Document Upload",
                        accessor: "upload",
                        headerStyle: { textAlign: "center" },
                        style: { textAlign: "center" },
                        sortable: false,
                        filterable: false
                    },
                ]}
                defaultPageSize={5}
                showPaginationTop={false}
                showPaginationBottom
                className="-striped -highlight"
                defaultFilterMethod={_filterCaseInsensitive}
            />
        )
    }

    handleSaveBrands(brands, branding) {
        const { interestsArray, agesArray, gendersArray, saveBrandsProfile, userInfo, selectedBrand } = this.props;
        const newArray = brands.map((brand => {
            if (brand.gender !== undefined) {
                return {
                    ...brand,
                    ages: brand.ages.map(age => {
                        return this.findItem(agesArray, age);
                    }),
                    interests: brand.interests.map(interest => {
                        return this.findItem(interestsArray, interest);
                    }),
                    gender: this.findItem(gendersArray, brand.gender),
                }
            }
        }));

        saveBrandsProfile(newArray, userInfo, selectedBrand);
        this.setState({
            branding: '',
            brands: [{
                ages: [], gender: '', interests: [], brandName: ''
            }]
        })
    }

    renderBrands() {

        const { userInfo, classes, selectedBrand } = this.props;
        const { branding, brands } = this.state;
        //if (!userInfo.hasOwnProperty("brands")) return null;
        let brands_ = userInfo.brands || [];

        if (Array.isArray(brands_) && brands_.length >= 0) {
            return (
                <GridItem sm={11} md={8} sl={8}>
                    <div>
                        <h4 className={classes.title} style={{ textAlign: 'center', color: grayColor[1] }}>My Branding </h4>
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
                            {userInfo.isMulti &&
                                (
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={12}>
                                            <GridContainer>
                                                <GridItem xs={12} dm={12} md={12}>
                                                    <FormControl fullWidth className={classes.selectFormControl}>
                                                        {this.renderBrandingComponent()}
                                                    </FormControl>
                                                </GridItem>
                                            </GridContainer>
                                            <GridContainer>
                                                <GridItem xs={12} dm={12} md={12}>
                                                    <div className={classes.textCenter} style={{ marginTop: 20, marginBottom: 20, textAlign: 'center' }}>
                                                        <Button color="success" round onClick={() => this.handleSaveBrands(brands, branding)}>
                                                            Save
                                                    </Button>
                                                    </div>
                                                </GridItem>
                                            </GridContainer>
                                        </GridItem>
                                    </GridContainer>
                                )
                            }
                        </CardBody>
                    </Card>
                </GridItem>
            )
        } else return null;
    }

    handleInputChange(value, ind, brands, input) {
        const arr = brands.map((brand, index) => {
            if (ind === index) {
                if (input === 'brandname')
                    return { ...brand, brandName: value };
                else if (input === 'ages' && value.length <= 2)
                    return { ...brand, ages: value };
                else if (input === 'interests' && value.length <= 2)
                    return { ...brand, interests: value };
                else if (input === 'gender')
                    return { ...brand, gender: value };
            }
            return brand
        });
        this.setState({ brands: arr });
    }

    renderBrandingComponent() {
        const { classes, interestsArray, agesArray, gendersArray } = this.props;
        const { brands } = this.state;
        if (brands) {
            return brands.map((brand, index) => {
                const { ages, gender, interests, brandName } = brand;
                return (
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
                                    <FormControl style={{ marginTop: 10 }} fullWidth className={classes.selectFormControl}>
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
                                                    return (
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
                                                    return (
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
                                                    return (
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
        const { selectedBrand, classes, changeSelectedBrand, removeBrand, userInfo } = this.props;
        return (
            <GridItem sm={12} md={12}>
                <GridContainer>
                    <GridItem sm={12} md={12}>
                        <GridContainer>
                            <GridItem sm={12} md={9}>
                                {brand.hasOwnProperty("brandName") && (
                                    <GridItem sm={12} md={12}>
                                        <GridContainer>
                                            <GridItem sm={12} md={3}>
                                                <h6 style={{ textAlign: 'center', color: grayColor[0] }}>Brand Name</h6>
                                            </GridItem>
                                            <GridItem sm={12} md={3}>
                                                <h6 style={{ textAlign: 'center', color: grayColor[1] }}>{brand.brandName || ''}</h6>
                                            </GridItem>
                                        </GridContainer>
                                    </GridItem>
                                )}
                                {brand.hasOwnProperty("ages") && (
                                    <GridItem sm={12} md={12}>
                                        <GridContainer>
                                            <GridItem sm={12} md={3}>
                                                <h6 style={{ textAlign: 'center', color: grayColor[0] }}>Ages</h6>
                                            </GridItem>
                                            <GridItem sm={12} md={9}>
                                                {brand.ages.map((age, index) => {
                                                    return (
                                                        <Badge key={index} color="primary">{`${age.min || ''} - ${age.max || ''}`}</Badge>
                                                    )
                                                })}
                                            </GridItem>
                                        </GridContainer>
                                    </GridItem>
                                )}
                                {brand.hasOwnProperty("gender") && (
                                    <GridItem sm={12} md={12}>
                                        <GridContainer>
                                            <GridItem sm={12} md={3}>
                                                <h6 style={{ textAlign: 'center', color: grayColor[0] }}>Gender</h6>
                                            </GridItem>
                                            <GridItem sm={12} md={9}>
                                                <Badge color="info">{`${brand.gender ? brand.gender.description : ''}`}</Badge>
                                            </GridItem>
                                        </GridContainer>
                                    </GridItem>
                                )}
                                {brand.hasOwnProperty("interests") && (
                                    <GridItem sm={12} md={12}>
                                        <GridContainer>
                                            <GridItem sm={12} md={3}>
                                                <h6 style={{ textAlign: 'center', color: grayColor[0] }}>Interests</h6>
                                            </GridItem>
                                            <GridItem sm={12} md={9}>
                                                {brand.interests.map((interest, index) => {
                                                    return (
                                                        <Badge key={index} color="success">{`${interest.description || ''}`}</Badge>
                                                    )
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
                                            style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}
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
                                                            <FiberManualRecord className={classes.radioUnchecked} />
                                                        }
                                                        checkedIcon={
                                                            <FiberManualRecord className={classes.radioChecked} />
                                                        }
                                                        classes={{
                                                            checked: classes.radio,
                                                            root: classes.radioRoot
                                                        }}
                                                    />
                                                }
                                                classes={{
                                                    label: classes.label,
                                                    root: classes.labelRoot
                                                }}
                                            />
                                        </div>
                                    </GridItem>
                                    <GridItem sm={12} md={6}>
                                        <Button style={{ marginTop: 40 }} color="danger" size="sm" justIcon round onClick={() => removeBrand(index, selectedBrand, userInfo)}>
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

    renderDefaultNoBranding(index){
        const { selectedBrand, classes, changeSelectedBrand } = this.props;
        return(
            <GridItem sm={12} md={12}>
                <GridContainer>
                    <GridItem sm={12} md={12}>
                        <GridContainer>
                            <GridItem sm={12} md={9}>
                                <GridItem sm={12} md={12}>
                                    <GridContainer>
                                        <GridItem sm={12} md={3}>
                                            <h6 style={{ textAlign: 'center', color: grayColor[0] }}>Brand Name</h6>
                                        </GridItem>
                                        <GridItem sm={12} md={3}>
                                            <h6 style={{ textAlign: 'center', color: grayColor[1] }}>No Branding (Default)</h6>
                                        </GridItem>
                                    </GridContainer>
                                </GridItem>
                            </GridItem>
                            <GridItem sm={12} md={3}>
                                <GridContainer>
                                    <GridItem sm={12} md={6}>
                                        <div
                                            style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}
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
                                                            <FiberManualRecord className={classes.radioUnchecked} />
                                                        }
                                                        checkedIcon={
                                                            <FiberManualRecord className={classes.radioChecked} />
                                                        }
                                                        classes={{
                                                            checked: classes.radio,
                                                            root: classes.radioRoot
                                                        }}
                                                    />
                                                }
                                                classes={{
                                                    label: classes.label,
                                                    root: classes.labelRoot
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
        )
    }

    renderViews() {
        const { classes, isAuthenticated, user, logOut, loading, editProfile, isEdit, displayName, profileNameChange, profileSubscribeChange,
            subscribe, error, message, userInfo } = this.props;
        const { oldPassword, newPassword, confirmPassword, changePasswordCard, changePasswordMessage,
            changePasswordSuccess} = this.state;
        console.log(userInfo)

        if (this.state.stage === 0) {
            return <GridContainer >
                <GridItem md={12} xs={12} sm={12} className="margin-body">

                    <GridContainer justify="center" style={{ marginTop: 70 }}>
                        <div>
                            <h4 className={classes.title} style={{ textAlign: 'center', color: grayColor[1] }}>Recent Orders</h4>
                        </div>
                    </GridContainer>
                    <Card>
                        <CardBody>
                            {this.renderTable()}
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        } else if (this.state.stage === 1) {
            return (
                <GridContainer justify="center" style={{ marginTop: 70 }}>
                    {this.renderBrands()}
                </GridContainer>
            )
        
        } else if (this.state.stage === 2) {

            return (
                <div>
                    <GridContainer justify="center" style={{ marginTop: 70 }}>
                        <GridItem md={6}>
                            <h4 className={classes.title} style={{ textAlign: 'center', color: grayColor[1] }}>Manage my Account </h4>
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
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    disabled: !isEdit,
                                                    autoFocus: !isEdit,
                                                    type: "text",
                                                    value: isEdit ? displayName : (user ? (user.displayName || '') : ''),
                                                    onChange: (e) => {
                                                        profileNameChange(e.target.value)
                                                    }
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
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    disabled: true,
                                                    type: "text",
                                                    value: user ? (user.email || '') : '',
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer>
                                        <GridItem sm={12} xs={12} md={4}>
                                            <h6 style={{ paddingTop: 25 }}>ADWALLET BALANCE</h6>
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={8}>
                                            <CustomInput
                                                id="campaign"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    disabled: true,
                                                    type: "text",
                                                    value: userInfo ? (userInfo.adWallet ? (userInfo.adWallet.balance ? formatCurrency(userInfo.adWallet.balance,1,'NGN') : 0) : 0 ) : 0,
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
                                                        checkedIcon={<Check className={classes.checkedIcon} />}
                                                        icon={<Check className={classes.uncheckedIcon} />}
                                                        classes={{
                                                            checked: classes.checked,
                                                            root: classes.checkRoot
                                                        }}
                                                        checked={subscribe}
                                                        disabled={!isEdit}
                                                    />
                                                }
                                                classes={{ label: classes.label, root: classes.labelRoot }}
                                                label="Subscribe to receive updates and new blog posts in email?"
                                            />
                                        </GridItem>
                                    </GridContainer>
                                    {error &&
                                        <GridContainer justify="center">
                                            <GridItem xs={12} sm={12} md={6}>
                                                <p style={{ color: "#ef5350", fontWeight: "bold" }}>{message || ''}</p>
                                            </GridItem>
                                        </GridContainer>
                                    }
                                    <GridContainer justify="center">
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Button color={isEdit ? "success" : "info"} onClick={() => !isEdit ? editProfile(true) : this.handleSave()}>
                                                {isEdit ? 'SAVE PROFILE' : 'EDIT PROFILE'}
                                            </Button>
                                        </GridItem>
                                        {isEdit &&
                                            <GridItem xs={12} sm={12} md={4}>
                                                <Button color="danger" onClick={() => editProfile(false)}>
                                                    CANCEL
                                            </Button>
                                            </GridItem>
                                        }
                                    </GridContainer>
                                    <GridContainer justify="center">
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Button color="warning" size="sm" simple={true} onClick={() => this.setState({changePasswordCard: true})}>
                                                <p style={{ fontSize: 13,}}>Change Password</p>
                                            </Button>
                                        </GridItem>
                                    </GridContainer>
                                    <GridContainer justify="center">
                                        <GridItem xs={12} sm={12} md={4}>
                                            <Button color="danger" size="sm" simple={true} onClick={() => this.setState({deleteAccountModal: true})}>
                                                <p style={{ fontSize: 13, textAlign: 'center'}}>{`Delete Account`}</p>
                                            </Button>
                                        </GridItem>
                                    </GridContainer>
                                </CardBody>
                            </Card>
                        </GridItem>
                    </GridContainer>
                    {changePasswordCard &&
                    <GridContainer justify="center">
                        <GridItem md={6}>
                            <Card>
                                <CardBody>
                                    {changePasswordSuccess ? (
                                        <>
                                            <GridContainer justify="center">
                                                <GridItem xs={12} sm={12} md={12}>
                                                    <p className={classes.successMessage}>Your Password has Been changed Successfully!</p>
                                                </GridItem>
                                            </GridContainer>
                                            <GridContainer justify="center">
                                                <GridItem xs={12} sm={12} md={4}>
                                                    <Button color="success" onClick={() => this.setState({
                                                        oldPassword: '', newPassword: '', confirmPassword: '', changePasswordCard:false,
                                                        changePasswordMessage: '', changePasswordSuccess: false
                                                    })}>
                                                        OK
                                                    </Button>
                                                </GridItem>
                                            </GridContainer>
                                        </>
                                    ) :
                                    (
                                        <>
                                            <GridContainer>
                                                <GridItem sm={12} xs={12} md={4}>
                                                    <h6 style={{ paddingTop: 25 }}>Old Password</h6>
                                                </GridItem>
                                                <GridItem xs={12} sm={12} md={8}>
                                                    <CustomInput
                                                        id="name"
                                                        formControlProps={{
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            type: "password",
                                                            value: oldPassword || '',
                                                            onChange: (e) => {
                                                                this.setState({oldPassword: e.target.value})
                                                            }
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
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            type: "password",
                                                            value: newPassword || '',
                                                            onChange: (e) => {
                                                                this.setState({newPassword: e.target.value})
                                                            }
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
                                                            fullWidth: true
                                                        }}
                                                        inputProps={{
                                                            type: "password",
                                                            value: confirmPassword || '',
                                                            onChange: (e) => {
                                                                this.setState({confirmPassword: e.target.value})
                                                            }
                                                        }}
                                                    />
                                                </GridItem>
                                            </GridContainer>
                                            <GridContainer justify="center">
                                                <GridItem xs={12} sm={12} md={12}>
                                                    <p style={{ color: "#ef5350", fontWeight: "bold" }}>{changePasswordMessage || ''}</p>
                                                </GridItem>
                                            </GridContainer>
                                            <GridContainer justify="center">
                                                <GridItem xs={12} sm={12} md={4}>
                                                    <Button color="success" onClick={() => this.handleChangePassword()}>
                                                        CHANGE
                                                    </Button>
                                                </GridItem>
                                                <GridItem xs={12} sm={12} md={4}>
                                                    <Button color="danger" onClick={() => this.setState({changePasswordCard: false})}>
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
                    }
                </div>
            )
        } else if (this.state.stage === 3) {
            // return <MediaPlanning />
        }
        return null
    }

    async handleChangePassword(){
        const { oldPassword, newPassword, confirmPassword } = this.state;
        const { user } = this.props;
        if (oldPassword === '') this.setState({ changePasswordMessage: 'Old Password cannot be empty'});
        else if (newPassword === '') this.setState({ changePasswordMessage: 'New Password cannot be empty'});
        else if (confirmPassword === '') this.setState({ changePasswordMessage: 'Confirm Password cannot be empty'});
        else if (newPassword !== confirmPassword) this.setState({ changePasswordMessage: 'The two Passwords dont match'});
        else {
            try{
                let loggedUser = await getAuth().signInWithEmailAndPassword(user.email, oldPassword);
                await loggedUser.user.updatePassword(newPassword);
                this.setState({changePasswordSuccess: true});
            }
            catch (e) {
                //console.log(e)
                if (e.code === 'auth/wrong-password') this.setState({ changePasswordMessage: 'Failed: Wrong old password!'});
                else this.setState({ changePasswordMessage: e.message || 'Error occurred during change password'})
            }
        }
    }

    renderDeleteAccountModal(classes){
        const { deleteAccountModal, deleteEmail, deletePassword } = this.state;
        const { deleteAccount, message, loading } = this.props;
        console.log(deleteEmail, deletePassword)
        if (deleteAccountModal){
            return(
                <Dialog
                    classes={{
                        root: classes.modalRoot,
                        paper: classes.modal + " " + classes.modalLogin
                    }}
                    open={deleteAccountModal}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => this.setState({deleteAccountModal: false})}
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
                                    onClick={() => this.setState({deleteAccountModal: false})}
                                >
                                    {" "}
                                    <Close className={classes.modalClose} />
                                </Button>
                                <h5 className={classes.cardTitleWhite}>Login First to Delete Your account</h5>
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
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            value: deleteEmail,
                                            type: "email",
                                            placeholder: "Email...",
                                            onChange: (e) => {
                                                this.setState({ deleteEmail: e.target.value})
                                            }
                                        }}
                                    />
                                    <CustomInput
                                        id="login-modal-pass"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            value: deletePassword,
                                            type: "password",
                                            placeholder: "Password...",
                                            onChange: (e) => {
                                                this.setState({ deletePassword: e.target.value})
                                            }
                                        }}
                                    />
                                    {loading && (
                                        <div className={classes.textCenter}>
                                            <CircularProgress />
                                        </div>
                                    )}
                                    <h6 style={{ color: 'red', fontWeight: 'bold', textAlign: 'center'}} className={classes.errorMessage}>
                                        {message || ""}
                                    </h6>
                                </CardBody>
                            </form>
                        </DialogContent>
                        <DialogActions
                            className={`${classes.modalFooter} ${classes.justifyContentCenter}`}
                        >
                            <Button color="primary" size="lg" onClick={() => this.setState({deleteAccountModal: false})}>
                                Cancel
                            </Button>
                            <Button color="primary" simple size="lg" onClick={() => deleteAccount(deleteEmail, deletePassword)}>
                                Delete Account
                            </Button>
                        </DialogActions>
                    </Card>
                </Dialog>
            )
        }
    }

    addOne = () => {
        const {stage, showMediaLinks} = this.state
        return this.setState({ stage: 1 }, () => this.setState({ showMediaLinks : false}))
    }
    addTwo = () => {
        const {stage, showMediaLinks} = this.state
        return this.setState({ stage: 2 }, () => this.setState({ showMediaLinks : false}))
    }
    addZero = () => {
        const {stage, showMediaLinks} = this.state
        return this.setState({ stage: 0 }, () => this.setState({ showMediaLinks : false}))
    }
    addMedia = () => {
        const {stage, showMediaLinks} = this.state
        return this.setState({ stage: 3 }, () => this.setState({ showMediaLinks : true}))
    }

    render() {
        const { classes, isAuthenticated, user, logOut, loading } = this.props;

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
            savedPlans
          } = this.props;

          const { editProfile, isEdit, displayName, profileNameChange, profileSubscribeChange,
            subscribe, error, message, userInfo } = this.props;
        const { oldPassword, newPassword, confirmPassword, changePasswordCard, changePasswordMessage,
            changePasswordSuccess} = this.state;

        if (!isAuthenticated) {
            return (
                <Redirect to={{ pathname: '/login' }} />
            )
        }

        let vat = (7.5 / 100) * totalPrice
        if (success) {
            return (
                <Redirect
                to={{
                    pathname: "/orderSummary",
                    state: {
                    orderObject: undefined,
                    orders,
                    orderNos: orderNos,
                    totalPrice: totalPrice,
                    },
                }}
                />
            );
        }


        if (showMDDetails) {
            return (
              <div>
                {/* <Header */}
                  // brand="ADSPACE"
                  links={
                    // <HeaderLinksTwo
                    //   dropdownHoverColor="rose"
                    //   isAuthenticated={isAuthenticated}
                    //   user={user}
                    //   logOutUser={() => logOut()}
                    // />
                  }
                {/* /> */}
                <NewNavbar isAuthenticated={isAuthenticated} authUser={user} logOutUser={() => logOut()} />
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

          const {stage, showMediaLinks} = this.state

        return (
            <div>
                {this.renderDeleteAccountModal(classes)}
                {/* <Header
                    brand="ADSPACE"
                    links={<HeaderLinksTwo dropdownHoverColor="rose" isAuthenticated={isAuthenticated} user={user} logOutUser={() => logOut()} />}
                /> */}
                <NewNavbar isAuthenticated={isAuthenticated} authUser={user} logOutUser={() => logOut()} />
                {loading &&
                    <LinearProgress />
                }

                <div>
                    <div className="row">
                        <div className="col-md-2">
                            {/* <SideNav 
                                basicState={this.state.stage} 
                                addOne={() => this.setState({ stage: 1 })} 
                                addTwo={() => this.setState({ stage: 2 })} 
                                addZero={() => this.setState({ stage: 0 })}
                                addMedia={() => this.setState({ stage: 3 })}
                            /> */}
                            <div className="sidebar">
                                {/* <div className="side-nav" style={{backgroundColor: stage === 0 ?  'blue' : null, color: stage === 0 ? '#fff' : null,}} onClick={this.addZero}>
                                    <li><h3>ORDERS</h3></li>
                                </div>
                                <div style={{backgroundColor: stage === 1 ?  'blue' : null, color: stage === 1 ? '#fff' : null,}}  className="side-nav" onClick={this.addOne}>
                                    <li><h3>BRANDING</h3></li>
                                </div>
                                <div style={{backgroundColor: stage === 2 ?  'blue' : null, color: stage === 2 ? '#fff' : null,}} className="side-nav" onClick={this.addTwo}>
                                    <li><h3>ACCOUNT</h3></li>
                                </div> */}
                                    <span className="menu-title">main</span>

                                <div className="sidebar-li">
                                    <div>
                                        <i class="fe fe-home"></i>
                                    </div>
                                    <span>Dashboard</span>
                                </div>

                                {/* <div 
                                    className="sidebar-li" 
                                    onClick={this.addZero}                                    
                                >
                                    <div>
                                        <i style={{color: stage === 0 ? 'blue' : null}} class="fas fa-shuttle-van"></i>
                                    </div>
                                </div> */}
                                    <span className="menu-title">orders</span>

                                <div className="sidebar-li" onClick={this.addTwo}>
                                    <div>
                                        <i style={{color: stage === 2 ? 'blue' : null}} class="fe fe-user-plus"></i>
                                    </div>
                                    <span style={{color: stage === 2 ? 'blue' : null}}>Account</span>
                                </div>

                                <div className="sidebar-li" onClick={this.addOne}>
                                    <div>
                                        <i style={{color: stage === 1 ? 'blue' : null}} class="fe fe-tiled"></i>
                                    </div>
                                    <span style={{color: stage === 1 ? 'blue' : null}}>Branding</span>
                                </div>
                                {/* <div style={{backgroundColor: stage === 3 ?  'blue' : null, color: stage === 3 ? '#fff' : null,}} className="side-nav" onClick={this.addMedia}>
                                    <li><h3>Media Planning</h3></li>
                                </div> */}
                                <div>
                                <p>
                                    <a onClick={this.addMedia} data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                                    <div className="sidebar-li" onClick={this.addTwo}>
                                        <div>
                                            <i style={{color: stage === 3 ? 'blue' : null}} class="fe fe-cart"></i>
                                        </div>
                                        <span style={{color: stage === 3 ? 'blue' : null}}>Media Planning</span>
                                    </div>
                                    </a>
                                    </p>
                                    
                                   
                                    <div class="collapse" id="collapseExample">
                                    <div style={{marginTop: '-30px'}}>
                                    {showMediaLinks && (
                                        <div style={{background: '#fff', marginTop: '0' }}>
                                            {/* <div className="try-wrapper">
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
                                        </div> */}
                                    <div className={classes.cardBodyRefine}>
{/*         
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
                                    </div> */}
                                    {/* <div style={{marginTop: '20px'}}>
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
                                    </div> */}
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
                                        ]}
                                    />
                                    </div>
                                </div>
                                    )}
                                    </div>
                                </div>
                                
                                </div>
                                <div className="sidebar-li" onClick={this.addOne}>
                                    <div>
                                        <i style={{color: stage === 1 ? 'blue' : null}} class="fe fe-tiled"></i>
                                    </div>
                                    <span style={{color: stage === 1 ? 'blue' : null}}>Branding</span>
                                </div>
                                <div className="sidebar-li" onClick={this.addOne}>
                                    <div>
                                        <i style={{color: stage === 1 ? 'blue' : null}} class="fe fe-tiled"></i>
                                    </div>
                                    <span style={{color: stage === 1 ? 'blue' : null}}>Branding</span>
                                </div>
                                <div className="sidebar-li" onClick={this.addOne}>
                                    <div>
                                        <i style={{color: stage === 1 ? 'blue' : null}} class="fe fe-tiled"></i>
                                    </div>
                                    <span style={{color: stage === 1 ? 'blue' : null}}>Branding</span>
                                </div>
                                <div className="sidebar-li" onClick={this.addOne}>
                                    <div>
                                        <i style={{color: stage === 1 ? 'blue' : null}} class="fe fe-tiled"></i>
                                    </div>
                                    <span style={{color: stage === 1 ? 'blue' : null}}>Branding</span>
                                </div>
                                <div className="sidebar-li" onClick={this.addOne}>
                                    <div>
                                        <i style={{color: stage === 1 ? 'blue' : null}} class="fe fe-tiled"></i>
                                    </div>
                                    <span style={{color: stage === 1 ? 'blue' : null}}>Branding</span>
                                </div>
                                <div className="sidebar-li" onClick={this.addOne}>
                                    <div>
                                        <i style={{color: stage === 1 ? 'blue' : null}} class="fe fe-tiled"></i>
                                    </div>
                                    <span style={{color: stage === 1 ? 'blue' : null}}>Branding</span>
                                </div>
                            </div>
                            
                        </div>
                        <div className="col-md-10" style={{ height: '100vh', overflow: 'scroll' }}>
                            <div justify="center">
                                {/* {this.renderViews()} */}
                                {this.state.stage === 0 && (
                                    <GridContainer >
                                        <GridItem md={12} xs={12} sm={12} className="margin-body">
                        
                                            <GridContainer justify="center" style={{ marginTop: 70 }}>
                                                <div>
                                                    <h4 className={classes.title} style={{ textAlign: 'center', color: grayColor[1] }}>Recent Orders</h4>
                                                </div>
                                            </GridContainer>
                                            <Card>
                                                <CardBody>
                                                    {this.renderTable()}
                                                </CardBody>
                                            </Card>
                                        </GridItem>
                                    </GridContainer>
                                )}

                                {this.state.stage === 1 && (
                                    <GridContainer justify="center" style={{ marginTop: 70 }}>
                                        {this.renderBrands()}
                                    </GridContainer>
                                )}

                                {this.state.stage === 2 && (
                                    <div>
                                    <GridContainer justify="center" style={{ marginTop: 70 }}>
                                        <GridItem md={6}>
                                            <h4 className={classes.title} style={{ textAlign: 'center', color: grayColor[1] }}>Manage my Account </h4>
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
                                                                    fullWidth: true
                                                                }}
                                                                inputProps={{
                                                                    disabled: !isEdit,
                                                                    autoFocus: !isEdit,
                                                                    type: "text",
                                                                    value: isEdit ? displayName : (user ? (user.displayName || '') : ''),
                                                                    onChange: (e) => {
                                                                        profileNameChange(e.target.value)
                                                                    }
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
                                                                    fullWidth: true
                                                                }}
                                                                inputProps={{
                                                                    disabled: true,
                                                                    type: "text",
                                                                    value: user ? (user.email || '') : '',
                                                                }}
                                                            />
                                                        </GridItem>
                                                    </GridContainer>
                                                    <GridContainer>
                                                        <GridItem sm={12} xs={12} md={4}>
                                                            <h6 style={{ paddingTop: 25 }}>ADWALLET BALANCE</h6>
                                                        </GridItem>
                                                        <GridItem xs={12} sm={12} md={8}>
                                                            <CustomInput
                                                                id="campaign"
                                                                formControlProps={{
                                                                    fullWidth: true
                                                                }}
                                                                inputProps={{
                                                                    disabled: true,
                                                                    type: "text",
                                                                    value: userInfo ? (userInfo.adWallet ? (userInfo.adWallet.balance ? formatCurrency(userInfo.adWallet.balance,1,'NGN') : 0) : 0 ) : 0,
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
                                                                        checkedIcon={<Check className={classes.checkedIcon} />}
                                                                        icon={<Check className={classes.uncheckedIcon} />}
                                                                        classes={{
                                                                            checked: classes.checked,
                                                                            root: classes.checkRoot
                                                                        }}
                                                                        checked={subscribe}
                                                                        disabled={!isEdit}
                                                                    />
                                                                }
                                                                classes={{ label: classes.label, root: classes.labelRoot }}
                                                                label="Subscribe to receive updates and new blog posts in email?"
                                                            />
                                                        </GridItem>
                                                    </GridContainer>
                                                    {error &&
                                                        <GridContainer justify="center">
                                                            <GridItem xs={12} sm={12} md={6}>
                                                                <p style={{ color: "#ef5350", fontWeight: "bold" }}>{message || ''}</p>
                                                            </GridItem>
                                                        </GridContainer>
                                                    }
                                                    <GridContainer justify="center">
                                                        <GridItem xs={12} sm={12} md={4}>
                                                            <Button color={isEdit ? "success" : "info"} onClick={() => !isEdit ? editProfile(true) : this.handleSave()}>
                                                                {isEdit ? 'SAVE PROFILE' : 'EDIT PROFILE'}
                                                            </Button>
                                                        </GridItem>
                                                        {isEdit &&
                                                            <GridItem xs={12} sm={12} md={4}>
                                                                <Button color="danger" onClick={() => editProfile(false)}>
                                                                    CANCEL
                                                            </Button>
                                                            </GridItem>
                                                        }
                                                    </GridContainer>
                                                    <GridContainer justify="center">
                                                        <GridItem xs={12} sm={12} md={4}>
                                                            <Button color="warning" size="sm" simple={true} onClick={() => this.setState({changePasswordCard: true})}>
                                                                <p style={{ fontSize: 13,}}>Change Password</p>
                                                            </Button>
                                                        </GridItem>
                                                    </GridContainer>
                                                    <GridContainer justify="center">
                                                        <GridItem xs={12} sm={12} md={4}>
                                                            <Button color="danger" size="sm" simple={true} onClick={() => this.setState({deleteAccountModal: true})}>
                                                                <p style={{ fontSize: 13, textAlign: 'center'}}>{`Delete Account`}</p>
                                                            </Button>
                                                        </GridItem>
                                                    </GridContainer>
                                                </CardBody>
                                            </Card>
                                        </GridItem>
                                    </GridContainer>
                                    {changePasswordCard &&
                                    <GridContainer justify="center">
                                        <GridItem md={6}>
                                            <Card>
                                                <CardBody>
                                                    {changePasswordSuccess ? (
                                                        <>
                                                            <GridContainer justify="center">
                                                                <GridItem xs={12} sm={12} md={12}>
                                                                    <p className={classes.successMessage}>Your Password has Been changed Successfully!</p>
                                                                </GridItem>
                                                            </GridContainer>
                                                            <GridContainer justify="center">
                                                                <GridItem xs={12} sm={12} md={4}>
                                                                    <Button color="success" onClick={() => this.setState({
                                                                        oldPassword: '', newPassword: '', confirmPassword: '', changePasswordCard:false,
                                                                        changePasswordMessage: '', changePasswordSuccess: false
                                                                    })}>
                                                                        OK
                                                                    </Button>
                                                                </GridItem>
                                                            </GridContainer>
                                                        </>
                                                    ) :
                                                    (
                                                        <>
                                                            <GridContainer>
                                                                <GridItem sm={12} xs={12} md={4}>
                                                                    <h6 style={{ paddingTop: 25 }}>Old Password</h6>
                                                                </GridItem>
                                                                <GridItem xs={12} sm={12} md={8}>
                                                                    <CustomInput
                                                                        id="name"
                                                                        formControlProps={{
                                                                            fullWidth: true
                                                                        }}
                                                                        inputProps={{
                                                                            type: "password",
                                                                            value: oldPassword || '',
                                                                            onChange: (e) => {
                                                                                this.setState({oldPassword: e.target.value})
                                                                            }
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
                                                                            fullWidth: true
                                                                        }}
                                                                        inputProps={{
                                                                            type: "password",
                                                                            value: newPassword || '',
                                                                            onChange: (e) => {
                                                                                this.setState({newPassword: e.target.value})
                                                                            }
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
                                                                            fullWidth: true
                                                                        }}
                                                                        inputProps={{
                                                                            type: "password",
                                                                            value: confirmPassword || '',
                                                                            onChange: (e) => {
                                                                                this.setState({confirmPassword: e.target.value})
                                                                            }
                                                                        }}
                                                                    />
                                                                </GridItem>
                                                            </GridContainer>
                                                            <GridContainer justify="center">
                                                                <GridItem xs={12} sm={12} md={12}>
                                                                    <p style={{ color: "#ef5350", fontWeight: "bold" }}>{changePasswordMessage || ''}</p>
                                                                </GridItem>
                                                            </GridContainer>
                                                            <GridContainer justify="center">
                                                                <GridItem xs={12} sm={12} md={4}>
                                                                    <Button color="success" onClick={() => this.handleChangePassword()}>
                                                                        CHANGE
                                                                    </Button>
                                                                </GridItem>
                                                                <GridItem xs={12} sm={12} md={4}>
                                                                    <Button color="danger" onClick={() => this.setState({changePasswordCard: false})}>
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
                                    }
                                </div>
                                )}
         
                                {this.state.stage === 3 && (
                                    <div className={classes.main} className="margin-body" style={{ marginTop: 70 }}>
                                    <div className={classes.section}>
                                        <div style={{position: 'relative'}}>
                                        <div className="try-wrapper">
                                            <div className="try">
                                            <Card style={{ backgroundColor: "rgb(13, 37, 211)" }}>
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
                                                        fontSize: 14,
                                                        fontWeight: "bold",
                                                        cursor: "pointer",
                                                        color: "#fff"
                                                    }}
                                                >
                                                    Continue: {' '}
                                                    {formatCurrency(
                                                    totalPrice || 0,
                                                    this.props.exchange,
                                                    this.props.currency
                                                    )}
                                                </h4>
                                                </CardBody>
                                            </Card>
                                            </div>
                                        </div>
                                        <div style={{marginTop: 50, marginBottom: 50}}></div>
    
                                        {error && (
                                            <GridContainer justify="center">
                                            <GridItem xs={12} md={12} sm={12}>
                                                <p style={{ color: "#ef5350", fontWeight: "bold" }}>
                                                {message || ""}
                                                </p>
                                            </GridItem>
                                            </GridContainer>
                                        )}
                                        <GridContainer>
                                            {/* <GridItem md={3} sm={3}>
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
                                                    ]}
                                                />
                                                </CardBody>
                                            </div>
                                            </GridItem> */}
                                            <GridItem md={12} sm={12}>
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
                                                    <GridItem md={3}></GridItem>
                                                    <GridItem md={9} sm={7} xs={7}>
                                                        <div style={{height: 60, backgroundColor: '#fff', alignItems: 'center', marginRight: '9px', display: 'flex', justifyContent: 'space-between', paddingRight: '10px', paddingLeft: '10px'}} 
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
                                                                        onChange={(e) => sortMDLocations(e.value)}
                                                                        placeholder="Sort By"
                                                                        outlined={false}
                                                                        // styles={selectStyles}
                                                                        className="select-style"
                                                                    />
                                                                    {/* <strong style={{marginRight: '8px', fontWeight: '900'}}>Sort By {' '}: {' '}</strong> */}
                                                                    {/* <select className="select-style" onChange={(e) => sortMDLocations(e.value)}>
                                                                        {sortOptions.map((c, i) => (
                                                                            <option key={i} value={c.value}>
                                                                                {c.label}
                                                                            </option>
                                                                        ))}
                                                                    </select> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </GridItem>
                                                    <GridItem
                                                        md={12}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <GridContainer>{this.renderMDAdSpaces()}</GridContainer>
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
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

const selectStyles = { menu: (styles) => ({ ...styles, zIndex: 999 }) };

const mapStateToProps = ({ profile, login, branding, mediaplanning, paymentType }) => {
    const { loading, error, message, isEdit, displayName, subscribe, ordersArray, ordersLoader, userInfo,
        selectedBrand, success, } = profile;
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
        // success,
        orders,
        orderNos,
        subCategoriesArray,
        statesArray,
        citiesArray,
        openRow,
        savedPlans,
        savedPlan
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
        savedPlan
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
        savedPlanSelected
})(withStyles(styles)(Profile));
