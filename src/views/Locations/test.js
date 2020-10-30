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
} from "../../actions";
import qs from "qs";
import Header from "../../components/Header/Header";
import HeaderLinks from "../../components/Header/HeaderLinks";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Card from "../../components/Card/Card";
// import CardHeader from "../../components/Card/CardHeader";
import blogPostPageStyle from "../../assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";
import {
  CircularProgress,
  LinearProgress,
  withStyles,
} from "@material-ui/core";
import classNames from "classnames";
import CardCustom from "./../../components/Card/CardCustom";
// import CardBody from "../../components/Card/CardBody";
import Info from "../../components/Typography/Info";
// import CardFooter from "../../components/Card/CardFooter";
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
import { numberWithCommas, substringText } from "../../utils";
import moment from "moment";
import Tooltip from "@material-ui/core/Tooltip";
import { pageSize } from "../../config";
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
    };
  }

  componentDidMount() {
    const {
      location,
      statesArray,
      categoriesArray,
      tagsArray,
      subCategories,
      countryArray,
    } = this.props;
    if (location && location.search) {
      let searchString = location.search;
      let parsedObj = qs.parse(searchString, { ignoreQueryPrefix: true });

      this.props.getLocations(parsedObj, false);
    }

    if (
      !statesArray ||
      statesArray.length <= 0 ||
      !categoriesArray ||
      categoriesArray.length <= 0 ||
      !tagsArray ||
      tagsArray.length <= 0 ||
      !countryArray ||
      countryArray.length <= 0
    )
      this.props.getTagsStatesCitiesCategories();

    if (!subCategories || subCategories.length <= 0)
      this.props.getSubCategories();

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
          return age.min && age.max ? <Badge key={index} color="danger">
              {/* {tag.min + tag.max|| ""} */}
             {`${age.min || ''} - ${age.max || ''}`}
            </Badge> : null
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

  renderPrice(discountedPrice = null, location) {

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
            <h4 style={{ fontSize: 9, color: infoColor[1] }}>{`${
              location.pricingOption ? "per " + location.pricingOption.name : ""
            }`}</h4>
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

  renderAdSpaces() {
    const { locationsArray, classes } = this.props;


    if (locationsArray && locationsArray.length > 0) {
      return locationsArray.map((location, index) => {
        return (
          <GridItem xs={12} sm={6} md={6} lg={4} key={index}>
            <Link to={{ pathname: `/location/${location.id}`, location }}>
              <CardCustom
                product
                // className={classes.cardHover}
                // style={{ height: "600px" }}
                classes={classes}
                location={location}
                renderInterest={this.renderInterest}
                renderAges={this.renderAges}
                renderGender={this.renderGender}
                substringText={substringText}
                Info={Info}
                renderPrice={this.renderPrice}
              />
              {/* <CardImg
                  style={{ margin: 0, height: "250px", padding: 0 }}
                  src={location.images ? location.images[0] : location.imageUrl}
                  alt="..."
                /> */}
              {/* <img
                    src={
                      location.images ? location.images[0] : location.imageUrl
                    }
                    alt="..."
                    // height="250"
                    style={{width: '100%', height: '100%'}}
                  /> */}
            </Link>
          </GridItem>
        );
      });
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
      country: id,
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
      loadMoreLocations,
      originalLocationsArray,
      disableLoad,
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
      <div>
       <NewNavbar  isAuthenticated={isAuthenticated}
              user={user}
              logOutUser={() => logOut()} />

        <div className={classes.main} style={{ marginBottom: 30 }}>
          <div className={classes.sectionTestimonials}>
            {loading && <LinearProgress />}
            <div className={classes.container}>
              {/* <form className="location-gal">
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <FormControl fullWidth className={classes.selectFormControl}>
                    <ReactSelect
                      options={categoriesArray}
                      onChange={(e) => this.handleCategorySelect(e.id)}
                      placeholder="Select Ad type"
                      value={category.value}
                      outlined={false}
                      styles={selectStyles}
                    />
                  </FormControl>
                </GridItem>

                <GridItem xs={12} sm={12} md={3}>
                  <FormControl fullWidth className={classes.selectFormControl}>
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
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl fullWidth className={classes.selectFormControl}>
                    <Datetime
                      timeFormat={false}
                      isValidDate={valid}
                      value={startDate}
                      inputProps={{
                        placeholder: "Start Date",
                      }}
                      onChange={(e) =>
                        this.setState({ startDate: e })
                      }
                    />
                  </FormControl>
                </GridItem>

                <GridItem xs={12} sm={12} md={2}>
                  <a
                    href={`/locations?state=${state ||
                      ""}&city=${city}&country=${country}&category=${category}&startDate=${
                      startDate === ""
                        ? ""
                        : moment(startDate).format("MM-DD-YYYY")
                    }&tags=${tags}&subCategory=${
                      subCategory.value === null ? "" : subCategory
                    }`}
                  >
                      <Button
                      color="info"
                      style={{
                        backgroundColor: "#e62f2d",
                        borderRadius: "50px 50px 50px 50px",
                        height: "50px",
                        fontWeight: "700",
                        width: "100%",
                      }}
                      className={classes.button}
                    >
                      Search
                    </Button>
                  </a>
                </GridItem>

                <GridItem xs={12} sm={12} md={4}>
                  <div style={{ paddingTop: 40 }}>
                    <ReactSelect
                      options={sortOptions}
                      onChange={(e) => sortLocations(e.value)}
                      placeholder="Sort By"
                      outlined={false}
                      styles={selectStyles}
                    />
                  </div>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <div style={{ paddingTop: 40 }}>
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

            </form> */}

              <GridContainer>
                {/* <GridItem xs={12} sm={12} md={4}>
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
                    options={statesArray}
                    onChange={(e) => this.handleStateChange(e.id, statesArray)}
                    placeholder="State or City..."
                    outlined={false}
                    isLoading={loading}
                    styles={selectStyles}
                  />
                </GridItem> */}
                {/* <GridItem xs={12} sm={12} md={4}>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={8}>
                      <FormControl>
                        <Datetime
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
                    <GridItem xs={12} sm={12} md={2}>
                      <Tooltip
                        id="tooltip-tina"
                        title="Advanced Search"
                        placement="top"
                        classes={{ tooltip: classes.tooltip }}
                      >
                        <Button
                          color="success"
                          justIcon
                          round
                          onClick={() =>
                            this.setState({ advancedSearch: !advancedSearch })
                          }
                        >
                          <Dashboard />
                        </Button>
                      </Tooltip>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={2}>
                      <a
                        href={`/locations?state=${state ||
                          ""}&city=${city}&category=${category}&startDate=${
                          startDate === ""
                            ? ""
                            : moment(startDate).format("MM-DD-YYYY")
                        }&tags=${tags}&subCategory=${
                          subCategory.value === null ? "" : subCategory
                        }`}
                      >
                        <Tooltip
                          id="tooltip-tina"
                          title="Search"
                          placement="top"
                          classes={{ tooltip: classes.tooltip }}
                        >
                          <Button color="primary" justIcon round>
                            <Search />
                          </Button>
                        </Tooltip>
                      </a>
                    </GridItem>
                  </GridContainer>
                </GridItem> */}
              </GridContainer>
              {/* {advancedSearch && (
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <ReactSelect
                      options={tagsArray}
                      onChange={(e) => this.handleTagChange(e)}
                      placeholder="Select multiple tags"
                      outlined={false}
                      isMulti
                      styles={selectStyles}
                    />
                  </GridItem>
                  {category &&
                    category !== "" &&
                    subCatsSelectedCategory &&
                    subCatsSelectedCategory.length > 0 && (
                      <GridItem xs={12} sm={12} md={4}>
                        <ReactSelect
                          options={subCatsSelectedCategory}
                          onChange={(e) => this.setState({ subCategory: e.id })}
                          placeholder="Select Sub category"
                          value={subCategory.value}
                          outlined={false}
                          styles={selectStyles}
                        />
                      </GridItem>
                    )}
                </GridContainer>
              )} */}
              <GridContainer>
                {/* <GridItem md={4} /> */}
                {/* <GridItem
                  md={4}
                  className={classNames(classes.mlAuto, classes.mrAuto)}
                > */}
                {/* <h4 className={classes.title}>Available Ad spaces.</h4> */}
                {/* <h6 className={classes.subtitle}>
                    {`${originalLocationsArray.length || 0} ad space(s) ${query.state ? " in " + query.state + " state" : ""}`}
                    color="dark"
                    changeColorOnScroll={{
                        height: 300,
                        color: "info",
                    }}
                 /> */}
                {/* <h6 className={classes.subtitle}>
                    {`${originalLocationsArray.length || 0} ad space(s) ${
                      query.state ? " in " + query.state + " state" : ""
                    }
                                        ${
                                          query.city
                                            ? ", " + query.city + " city "
                                            : ""
                                        } ${
                      query.category ? " , of " + query.category + " Type" : ""
                    }`}
                  </h6> */}
                <div
                  className={classes.main}
                  style={{ width: "100%", marginBottom: 30 }}
                >
                  <div className={classes.sectionTestimonials}>
                    {loading && <LinearProgress style={{ marginBottom: 20 }} />}
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
                            href={`/locations?state=${state ||
                              ""}&city=${city}&country=${country}&category=${category}&startDate=${
                              startDate === ""
                                ? ""
                                : moment(startDate).format("MM-DD-YYYY")
                            }&tags=${tags}&subCategory=${
                              subCategory.value === null ? "" : subCategory
                            }`}
                          >
                            <div
                                className="hover-btn"
                                style={{
                                justifyContent: 'center'
                                }}
                            >
                                Search
                            </div>
                          </a>
                        </GridItem>
                      </GridContainer>
                      {/* {advancedSearch && (
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={4}>
                            <ReactSelect
                              options={tagsArray}
                              onChange={(e) => this.handleTagChange(e)}
                              placeholder="Select multiple tags"
                              outlined={false}
                              isMulti
                              styles={selectStyles}
                            />
                          </GridItem>
                          {category &&
                            category !== "" &&
                            subCatsSelectedCategory &&
                            subCatsSelectedCategory.length > 0 && (
                              <GridItem xs={12} sm={12} md={4}>
                                <ReactSelect
                                  options={subCatsSelectedCategory}
                                  onChange={(e) =>
                                    this.setState({ subCategory: e.id })
                                  }
                                  placeholder="Select Sub category"
                                  value={subCategory.value}
                                  outlined={false}
                                  styles={selectStyles}
                                />
                              </GridItem>
                            )}
                        </GridContainer>
                      )} */}
                    </div>
                  </div>

                  <GridContainer>
                    <GridItem md={4} />
                    <GridItem
                      md={4}
                      className={classNames(classes.mlAuto, classes.mrAuto)}
                    >
                      <h4
                        style={{
                          textAlign: "center",
                          fontSize: "25px",
                          marginTop: "20px",
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
                        }`}
                      </h6>
                    </GridItem>
                    <GridItem
                      md={4}
                      className={classNames(classes.mlAuto, classes.mrAuto)}
                    >
                      {/* <GridContainer>
                        <GridItem md={2} />
                        <GridItem xs={12} sm={12} md={6}>
                          <div style={{ paddingTop: 40 }}>
                            <ReactSelect
                              options={sortOptions}
                              onChange={(e) => sortLocations(e.value)}
                              placeholder="Sort By"
                              outlined={false}
                              styles={selectStyles}
                            />
                          </div>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                          <div style={{ paddingTop: 40 }}>
                            <ReactSelect
                              options={sortOptions}
                              onChange={(e) => sortLocations(e.value)}
                              placeholder="Sort By"
                              outlined={false}
                              styles={selectStyles}
                            />
                          </div>
                        </GridItem>
                      </GridContainer> */}
                    </GridItem>
                  </GridContainer>
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

                  <GridContainer>
                        {/* <GridItem md={2} /> */}
                        <GridItem xs={12} sm={12} md={4}>
                          <div style={{ paddingTop: 40 }}>
                            <ReactSelect
                              options={subCategoriesArry}
                              onChange={(e) => sortLocations(e.value)}
                              placeholder="Sort By Sub Category"
                              outlined={false}
                              styles={selectStyles}
                            />
                          </div>
                        </GridItem>
                        <GridItem md={4} />
                        <GridItem xs={12} sm={12} md={4}>
                          <div style={{ paddingTop: 40 }}>
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

                    <GridContainer justify="left" style={{marginTop: 30}}>
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

const mapStateToProps = ({ locations, login, home }) => {
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
  } = locations;
  const { isAuthenticated, user } = login;
  const { statesArray, tagsArray, categoriesArray, countryArray } = home;

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
  }
)(withStyles(blogPostPageStyle)(Locations));
