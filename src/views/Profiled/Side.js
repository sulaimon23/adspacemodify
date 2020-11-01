import React, { Component } from "react";
import { connect } from "react-redux";
import NumericInput from "react-numeric-input";
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
  addReduceQuantityByInput,
} from "../../actions";
// import shoppingCartStyle from "../../assets/jss/material-kit-pro-react/views/shoppingCartStyle.js";
import {
  CircularProgress,
  DialogContent,
  LinearProgress,
  withStyles,
} from "@material-ui/core";
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

import Carousel from "react-slick";
import Typography from "@material-ui/core/Typography";
import Instruction from "../../components/Instruction/Instruction";
import Tooltip from "@material-ui/core/Tooltip";
import Datetime from "react-datetime";
import classNames from "classnames";

import BookingDetails from "../MediaPlanning/BookingDetails";
import "../MediaPlanning/mediaplanning.scss";
import Clearfix from "../../components/Clearfix/Clearfix";
import Accordion from "../../components/Accordion/Accordion";

import Pagination from "../../components/Pagination/Pagination";
import styles from "../../assets/jss/material-kit-pro-react/views/ecommerceSections/productsStyle.js";
import _ from "underscore";


let yesterday = Datetime.moment().subtract(1, "day");

let valid = function(current) {
    return current.isAfter(yesterday);
  };

export class Side extends Component {
      constructor(props) {
        super(props);
    
        this.state = {
          branding: "",
          brands: [
            {
              ages: [],
              gender: "",
              interests: [],
              brandName: "",
            },
          ],
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
        const {stage} = this.props
      }


      
  addOne = () => {
    const { stage, showMediaLinks } = this.props;
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
  addZero = () => {
    const { stage, showMediaLinks } = this.state;
    return this.setState({ stage: 0 }, () =>
      this.setState({ showMediaLinks: false })
    );
  };
  addMedia = () => {
    const { stage, showMediaLinks } = this.state;
    return this.setState({ stage: 3 }, () =>
      this.setState({ showMediaLinks: true })
    );
  };


    render() {
      
        
        return (

            <div className="left">
                 <div className="sidebar">
                <span className="menu-title">main</span>

                <div className="sidebar-li">
                  <div>
                    <i class="fe fe-home"></i>
                  </div>
                  <span>Dashboard</span>
                </div>

                <span className="menu-title">orders</span>

                <div className="sidebar-li" onClick={this.addTwo}>
                  <div>
                    <i
                      style={{ color:this.state.stage === 2 ? "blue" : null }}
                      class="fe fe-user-plus"
                    ></i>
                  </div>
                  <span style={{ color:this.state.stage === 2 ? "blue" : null }}>
                    Account
                  </span>
                </div>

                <div className="sidebar-li" onClick={this.addOne}>
                  <div>
                    <i
                      style={{ color: this.state.stage === 1 ? "blue" : null }}
                      class="fe fe-tiled"
                    ></i>
                  </div>
                  <span style={{ color: this.state.stage === 1 ? "blue" : null }}>
                    Branding
                  </span>
                </div>

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
                      <div className="sidebar-li" onClick={() => this.addTwo()}>
                        <div>
                          <i
                            style={{ color: this.state.stage === 3 ? "blue" : null }}
                            class="fe fe-cart"
                          ></i>
                        </div>
                        <span style={{ color: this.state.stage === 3 ? "blue" : null }}>
                          Media Planning
                        </span>
                      </div>
                    </a>
                  </p>

                  <div class="collapse" id="collapseExample">
                    <div style={{ marginTop: "-30px" }}>
                      <div
                        className={this.props.classes.cardTitle + " " + this.props.classes.textLeft}
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
                          classes={{ tooltip: this.props.classes.tooltip }}
                        >
                          <Button
                            link
                            justIcon
                            size="sm"
                            className={
                              this.props.classes.pullLeft + " " + this.props.classes.refineButton
                            }
                            onClick={() => this.props.getAllLocations}
                          >
                            <RefreshOutlined />
                            Refresh
                          </Button>
                        </Tooltip>
                        <Tooltip
                          id="tooltip-top"
                          title="Reset Filter"
                          placement="top"
                          classes={{ tooltip: this.props.classes.tooltip }}
                        >
                          <Button
                            link
                            justIcon
                            size="sm"
                            className={
                              this.props.classes.pullRight + " " + this.props.classes.refineButton
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
                      <div style={{ marginTop: "20px" }}>
                        <FormControl variant="outlined" fullWidth>
                          <Datetime
                            style={{ borderWidth: 0 }}
                            timeFormat={false}
                            isValidDate={this.props.valid}
                            value={this.props.startDate}
                            inputProps={{
                              placeholder: "Start Date",
                            }}
                            onChange={(e) => this.setState({ startDate: e })}
                          />
                        </FormControl>
                      </div>
                      {this.state.showMediaLinks && (
                        <div style={{ background: "#fff", marginTop: "0" }}>
                          <div className={this.props.classes.cardBodyRefine}>
                            <Accordion
                              active={[0, 1, 2, 3, 4]}
                              activeColor="rose"
                              collapses={[
                                {
                                  title: "States",
                                  content: (
                                    <div className={this.props.classes.customExpandPanel}>
                                      <div
                                        className={
                                          this.props.classes.checkboxAndRadio +
                                          " " +
                                          this.props.classes.checkboxAndRadioHorizontal
                                        }
                                      >
                                        {this.props.renderStatesMD()}
                                      </div>
                                    </div>
                                  ),
                                },
                                {
                                  title: "Adtype",
                                  content: (
                                    <div className={this.props.classes.customExpandPanel}>
                                      <div
                                        className={
                                          this.props.classes.checkboxAndRadio +
                                          " " +
                                          this.props.classes.checkboxAndRadioHorizontal
                                        }
                                      >
                                        {this.props.renderCategoriesMD()}
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
                <div className="sidebar-li" onClick={this.props.addOne}>
                  <div>
                    <i
                      style={{ color:this.state.stage === 1 ? "blue" : null }}
                      class="fe fe-tiled"
                    ></i>
                  </div>
                  <span style={{ color: this.state.stage === 1 ? "blue" : null }}>
                    Branding
                  </span>
                </div>
                <div className="sidebar-li" onClick={this.props.addOne}>
                  <div>
                    <i
                      style={{ color: this.state.stage === 1 ? "blue" : null }}
                      class="fe fe-tiled"
                    ></i>
                  </div>
                  <span style={{ color: this.state.stage === 1 ? "blue" : null }}>
                    Branding
                  </span>
                </div>
                <div className="sidebar-li" onClick={this.props.addOne}>
                  <div>
                    <i
                      style={{ color: this.state.stage === 1 ? "blue" : null }}
                      class="fe fe-tiled"
                    ></i>
                  </div>
                  <span style={{ color: this.state.stage === 1 ? "blue" : null }}>
                    Branding
                  </span>
                </div>
                <div className="sidebar-li" onClick={this.props.addOne}>
                  <div>
                    <i
                      style={{ color: this.state.stage === 1 ? "blue" : null }}
                      class="fe fe-tiled"
                    ></i>
                  </div>
                  <span style={{ color: this.state.stage === 1 ? "blue" : null }}>
                    Branding
                  </span>
                </div>
                <div className="sidebar-li" onClick={this.props.addOne}>
                  <div>
                    <i
                      style={{ color: this.state.stage === 1 ? "blue" : null }}
                      class="fe fe-tiled"
                    ></i>
                  </div>
                  <span style={{ color: this.state.stage === 1 ? "blue" : null }}>
                    Branding
                  </span>
                </div>
                <div className="sidebar-li" onClick={this.props.addOne}>
                  <div>
                    <i
                      style={{ color: this.state.stage === 1 ? "blue" : null }}
                      class="fe fe-tiled"
                    ></i>
                  </div>
                  <span style={{ color: this.state.stage === 1 ? "blue" : null }}>
                    Branding
                  </span>
                </div>
              </div>
            </div>
                     
        )
    }
}


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
  }
)(withStyles(styles)(Side));
