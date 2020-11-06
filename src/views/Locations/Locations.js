import React, { Component } from "react";
import "./locations.scss";
import { connect } from "react-redux";
import {
  getLocations,
  logOut,
  setAuthenticated,
  getTagsStatesCitiesCategories,
  getSubCategories,
  sortLocations,
  loadMoreLocations,
  subCategoryChange,
} from "../../actions";
import qs from "qs";
import Header from "../../components/Header/Header";
import HeaderLinks from "../../components/Header/HeaderLinks";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Card from "../../components/Card/Card";
import blogPostPageStyle from "../../assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";
import {
  CircularProgress,
  LinearProgress,
  withStyles,
} from "@material-ui/core";
import classNames from "classnames";
import CardCustom from "./../../components/Card/CardCustom";
import Info from "../../components/Typography/Info";
import { Place, Search, Dashboard } from "@material-ui/icons";
import Badge from "../../components/Badge/Badge";
import { Link } from "react-router-dom";
import { getAuth } from "../../firebase";
import _ from "underscore";
import {
  dangerColor,
  infoColor,
  successColor,
} from "../../assets/jss/material-kit-pro-react";
import ReactSelect from "react-select";
import FormControl from "@material-ui/core/FormControl";
import Datetime from "react-datetime";
import Button from "../../components/CustomButtons/Button";
import {numberWithCommas, substringText, formatCurrency, isUserLoggedIn} from "../../utils";
import moment from "moment";
import Tooltip from "@material-ui/core/Tooltip";
import { pageSize } from "../../config";
import { CURRENCY } from "actions/type";
import NewNavbar from "components/NewNavbar";

let yesterday = Datetime.moment().subtract(1, "day");
let valid = function(current) {
  return current.isAfter(yesterday);
};

const sortOptions = [
  { value: 1, label: "Price - Low To High" },
  { value: 2, label: "Price - High To Low" },
  { value: 3, label: "Alphabetical Order [A - Z]" },
  { value: 4, label: "Alphabetical Order [Z - A]" },
];

class Locations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "",
      state: "",
      city: "",
      category: "",
      country: "",
      advancedSearch: false,
      subCategory: "",
      tags: "",
      subCatsSelectedCategory: [],
      currExchange: 1,
      currencyCode: "NGN",
    };
    this.renderPrice = this.renderPrice.bind(this);
  }

  async componentDidMount() {
    document.title = 'Adspace.ng – Adspace | Advert Space | Billboards | Television | Newspaper |Radio | Influencer | Magazine';
    const {
      location,
      statesArray,
      categoriesArray,
      tagsArray,
      subCategories,
      userInfo,
      exchange,
      currency,
      subCategoriesArry
    } = this.props;
    let parsedObj = '';

    let loggedInUser = await isUserLoggedIn();
    if (location && location.search) {
      let searchString = location.search;
      parsedObj = qs.parse(searchString, { ignoreQueryPrefix: true });
      this.props.getLocations(
          parsedObj,
          false,
          undefined,
          undefined,
          loggedInUser,
          userInfo
      );
    }
    if (
        !statesArray ||
        statesArray.length <= 0 ||
        !categoriesArray ||
        categoriesArray.length <= 0 ||
        !tagsArray ||
        tagsArray.length <= 0
    )
      this.props.getTagsStatesCitiesCategories();

    if (!subCategories || subCategories.length <= 0)
      this.props.getSubCategories(parsedObj.category || '');

    if (loggedInUser !== undefined){
      if (loggedInUser.emailVerified === true)
        this.props.setAuthenticated(true, loggedInUser);
      else this.props.setAuthenticated(false, loggedInUser);
    }else{
      this.props.setAuthenticated(false, loggedInUser);
    }
  }

  handleStateChange(state, statesArray = [], countryArray) {
    let stateOrCity = statesArray.find((element) => element.id === state);
    let country = countryArray.find((element) => element.id === state);
    stateOrCity = stateOrCity === undefined ? { id: null } : stateOrCity;
    country = country === undefined ? { id: null } : country;

    if (stateOrCity.id === stateOrCity.stateId) {
      this.setState({ state: state });
    } else if (stateOrCity.id === null) {
      this.setState({ state: "" });
      this.setState({ city: "" });
    } else this.setState({ city: state });

    if (country.id === null) {
      this.setState({ country: "" });
    } else this.setState({ country: country.name.toLowerCase() });
  }

  renderTags(location) {
    if (location.tags && location.tags.length > 0) {
      return location.tags.map((tag, index) => {
        if (index <= 3) {
          return (
            <Badge key={index} color="danger">
              {tag || ""}
            </Badge>
          );
        }
      });
    }
    return null;
  }

  renderGender(location) {
    if (location.genders && location.genders.length > 0) {
      return location.genders.map((tag, index) => {
        if (index <= 3) {
          return (
            <Badge key={index} color="success">
              {tag || ""}
            </Badge>
          );
        }
      });
    }
    return null;
  }

  renderAges(location) {
    if (location.ages && location.ages.length > 0) {
      return location.ages.map((age, index) => {
        if (index <= 3) {
          return age.min && age.max ? (
            <Badge key={index} color="danger">
              {`${age.min || ""} - ${age.max || ""}`}
            </Badge>
          ) : null;
        }
      });
    }
    return null;
  }

  renderInterest(location) {
    if (location.interests && location.interests.length > 0) {
      return location.interests.map((tag, index) => {
        if (index <= 3) {
          return (
            <Badge key={index} color="info">
              {tag || ""}
            </Badge>
          );
        }
      });
    }
    return null;
  }

  renderPrice = (discountedPrice = {}, location) => {
    if (!discountedPrice.checked) {
      return (
        <div style={{ display: "flex", flexDirection: "row" }}>
        <h4
            style={{ color: "#000", fontSize: 15 }}
          >{` ${numberWithCommas(
            formatCurrency(
              location.price || 0,
              this.props.exchange,
              this.props.currency
            )
          )}`}</h4>
          {location.pricingOption && location.pricingOption.name && (
            <h4 style={{ color: "#000", fontSize: 13 }}>{`${location.pricingOption
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
            <h4 style={{ fontSize: 13 }}>{`${numberWithCommas(
              formatCurrency(location.price || 0)
            )}`} {location.pricingOption ? location.pricingOption.name : ''}</h4>
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

  renderAdSpaces() {
    const { locationsArray, classes } = this.props;

    if (locationsArray && locationsArray.length > 0) {
      return locationsArray.map((location, index) => {
        return (
          // <GridContainer>
            <GridItem xs={12} sm={10} md={4}  key={index}>
              <Link to={{ pathname: `/location/${location.id}`, location }}>
                <CardCustom
                  product
                  classes={classes}
                  location={location}
                  renderInterest={this.renderInterest}
                  renderAges={this.renderAges}
                  renderGender={this.renderGender}
                  substringText={substringText}
                  Info={Info}
                  renderPrice={this.renderPrice}
                  numberWithCommas={numberWithCommas}
                />
              </Link>
            </GridItem>
          // </GridContainer>
        )
      })
    }
  }

  handleTagChange(selectedTags) {
    let tagString = "";
    if (selectedTags && selectedTags.length > 0) {
      selectedTags.forEach((tag) => {
        tagString = tagString + tag.id + "~";
      });
    }
    this.setState({ tags: tagString });
  }

  handleCategorySelect(id) {
    const { subCategoriesArry } = this.props;

    let subCats = subCategoriesArry.filter((cat) => cat.cat_id === id);
    this.setState({
      category: id,
      subCatsSelectedCategory: subCats,
      subCategory: { value: null },
    });
  }

  handleCountrySelect(id) {
    const { countryArray } = this.props;
    let subCats = countryArray.filter((cat) => cat.cat_id === id);
    this.setState({
      category: id,
      subCatsSelectedCategory: subCats,
      subCategory: { value: null },
    });
  }

  render() {
    const {
      classes,
      locationsArray,
      query,
      loading,
      isAuthenticated,
      user,
      logOut,
      statesArray,
      countryArray,
      tagsArray,
      categoriesArray,
      subCategoriesArry,
      lastItem,
      getLocations,
      sortLocations,
      subCategoryChange,
      loadMoreLocations,
      originalLocationsArray,
      disableLoad,
      // exchange,
      filteredSubCat
    } = this.props;
    const {
      startDate,
      state,
      city,
      category,
      advancedSearch,
      subCategory,
      tags,
      country,
      subCatsSelectedCategory,
    } = this.state;

    return (
      <div style={{ minHeight: "100vh", backgroundColor: "red" }}>
        <NewNavbar  isAuthenticated={isAuthenticated}
              user={user}
              logOutUser={() => logOut()} />

        <div
          className={classes.main}
          style={{
            marginBottom: 0,
            minHeight: "100vh",
          }}
        >
          <div className={classes.sectionTestimonials}>
            {loading && <LinearProgress />}
            <div className={classes.container}>
              <GridContainer>
              </GridContainer>
              <GridContainer>
                <div className={classes.main} style={{ width: "100%" }}>
                  <div className={classes.sectionTestimonials}>
                    {loading && <LinearProgress style={{ marginBottom: 30 }} />}
                    <div className="location-gal">
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={3}>
                          <ReactSelect
                            options={categoriesArray}
                            onChange={(e) => this.handleCategorySelect(e.id)}
                            placeholder="Select Ad type"
                            value={category.value}
                            outlined={false}
                            styles={selectStyles}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4}>
                          <ReactSelect
                            options={statesArray.concat(countryArray).sort()}
                            onChange={(e) =>
                              this.handleStateChange(
                                e.id,
                                statesArray,
                                countryArray
                              )
                            }
                            placeholder="State or City"
                            outlined={false}
                            isLoading={loading}
                            styles={selectStyles}
                          />
                        </GridItem>

                        <GridItem xs={12} sm={12} md={3}>
                          <Datetime
                            timeFormat={false}
                            isValidDate={valid}
                            value={startDate}
                            inputProps={{
                              placeholder: "Start Date",
                            }}
                            onChange={(e) => this.setState({ startDate: e })}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={2}>
                          <a
                            href={
                              state || country || category || startDate
                                ? `/locations?state=${state ||
                                    ""}&city=${city}&country=${country}&category=${category}&startDate=${
                                    startDate === ""
                                      ? ""
                                      : moment(startDate).format("MM-DD-YYYY")
                                  }&tags=${tags}&subCategory=${
                                    subCategory.value === null
                                      ? ""
                                      : subCategory
                                  }`
                                : null
                            }
                          >
                            <div
                              className="hover-btn"
                              style={{
                                justifyContent: "center",
                              }}
                            >
                              Search
                            </div>
                          </a>
                        </GridItem>
                      </GridContainer>
                    </div>
                  </div>

                  <GridContainer>
                    <GridItem
                      md={12}
                      className={classNames(classes.mlAuto, classes.mrAuto)}
                    >
                      <hr
                        style={{
                          borderTop: 3,
                          borderTopColor: "#bbb",
                          borderTopStyle: "solid",
                        }}
                      />
                    </GridItem>
                  </GridContainer>

                  <GridContainer style={{ marginTop: -70 }}>
                    <GridItem xs={12} sm={12} md={4}>
                      <div className="location-gal">
                        <ReactSelect
                          options={filteredSubCat}
                          onChange={(e) => subCategoryChange(e.id)}
                          placeholder="Sort By Sub Category"
                          outlined={false}
                          styles={selectStyles}
                        />
                      </div>
                    </GridItem>
                    <GridItem md={4}>
                      <h4
                        style={{
                          textAlign: "center",
                          fontSize: "25px",
                        }}
                        className={classes.title}
                      >
                        Available Ad spaces.
                      </h4>
                      <h6 className={classes.subtitle}>
                        {`${originalLocationsArray.length || 0} ad space(s) ${
                          query.state ? " in " + query.state + " state" : ""
                        }
                            ${
                              query.city
                                ? ", " + query.city + " city "
                                : ""
                            } ${
                          query.category
                            ? " , of " + query.category + " Type"
                            : ""
                        }  ${
                          query.country
                            ? " , of " + query.country + " country"
                            : ""
                        } ${
                          query.subCategoriesArry
                            ? " , of " +
                              query.subCategoriesArry +
                              " subCategoriesArry"
                            : ""
                        }`}
                      </h6>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <div className="location-gal">
                        <ReactSelect
                          options={sortOptions}
                          onChange={(e) => sortLocations(e.value)}
                          placeholder="Sort By"
                          outlined={false}
                          styles={selectStyles}
                        />
                      </div>
                    </GridItem>
                  </GridContainer>

                  <GridContainer justify="left" style={{ marginTop: 30 }}>
                    {this.renderAdSpaces()}
                  </GridContainer>

                  {locationsArray && locationsArray.length > 0 && !disableLoad && (
                    <div className={classes.sectionDescription}>
                      <Button
                        color="success"
                        round
                        onClick={() => loadMoreLocations()}
                      >
                        LOAD MORE...
                      </Button>
                    </div>
                  )}
                </div>
              </GridContainer>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const selectStyles = { menu: (styles) => ({ ...styles, zIndex: 999 }) };

const mapStateToProps = ({ locations, login, paymentType, home }) => {
  const {
    loading,
    error,
    messages,
    locationsArray,
    originalLocationsArray,
    query,
    subCategoriesArry,
    lastItem,
    disableLoad,
    userInfo,
    filteredSubCat
  } = locations;
  const { isAuthenticated, user } = login;
  const { statesArray, tagsArray, categoriesArray, countryArray } = home;
  const { exchange, currency } = paymentType;
  return {
    loading,
    error,
    messages,
    locationsArray,
    query,
    isAuthenticated,
    user,
    statesArray,
    countryArray,
    tagsArray,
    categoriesArray,
    subCategoriesArry,
    lastItem,
    originalLocationsArray,
    disableLoad,
    userInfo,
    exchange,
    currency,
    filteredSubCat
  };
};

export default connect(
  mapStateToProps,
  {
    getLocations,
    logOut,
    setAuthenticated,
    getTagsStatesCitiesCategories,
    getSubCategories,
    sortLocations,
    loadMoreLocations,
    subCategoryChange,
  }
)(withStyles(blogPostPageStyle)(Locations));
