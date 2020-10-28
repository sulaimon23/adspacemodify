import React, { Component } from "react";
import { connect } from "react-redux";

import blogPostPageStyle from "../../assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";
import { LinearProgress, withStyles } from "@material-ui/core";
import Header from "../../components/Header/Header";
import HeaderLinks from "../../components/Header/HeaderLinks";
import Parallax from "../../components/Parallax/Parallax";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Button from "../../components/CustomButtons/Button.js";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import classNames from "classnames";
import Vodafone from "assets/img/assets-for-demo/ourClients/vodafone.jpg";
import Microsoft from "assets/img/assets-for-demo/ourClients/microsoft.jpg";
import Harvard from "assets/img/assets-for-demo/ourClients/harvard.jpg";
import Standford from "assets/img/assets-for-demo/ourClients/stanford.jpg";
import profilePic1 from "assets/img/assets-for-demo/test1.jpg";
import profilePic2 from "assets/img/assets-for-demo/test2.jpg";
import profilePic3 from "assets/img/assets-for-demo/test3.jpg";
import {
  getTagsStatesCitiesCategories,
  stateChange,
  cityChange,
  categoryChange,
  resetSearch,
  setAuthenticated,
  logOut,
  tagsChange,
  startDateChange,
} from "../../actions";
import InfoArea from "../../components/InfoArea/InfoArea";
import { Place, ShutterSpeed, VerifiedUser } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { getAuth } from "../../firebase";
import Datetime from "react-datetime";
import ReactSelect from "react-select";
import Info from "../../components/Typography/Info";
import _ from "underscore";
import CardFooter from "../../components/Card/CardFooter";
import Badge from "../../components/Badge/Badge";

const TOPADSPACES = [
  {
    id: "Grlt5iVOy0vhtl9J7K3P",
    name: "Channels Television (6AM - 3PM)",
    imageUrl: "https://picsum.photos/id/214/500/500",
    category: { name: "Television" },
    price: 46077,
    size: 10,
    quantity: 50,
  },
  {
    id: "cgHlAX8huvY60EUlRjFF",
    name: "Freedom Way Lekki",
    imageUrl: "https://picsum.photos/id/313/500/500",
    category: { name: "Outdoor (OOH)" },
    price: 50000,
    size: 10,
    quantity: 50,
  },
  {
    id: "0i7D8IIFSMIMcSrvV0Gu",
    name: "Location 2",
    imageUrl: "https://picsum.photos/id/407/500/500",
    category: { name: "Outdoor (OOH)" },
    price: 6000,
    size: 10,
    quantity: 50,
  },
];

const CITIES = [
  {
    name: "Victoria Island",
    state: "abuja",
    image: "https://picsum.photos/id/900/500/200",
  },
  {
    name: "Ikoyi",
    state: "lagos",
    image: "https://picsum.photos/id/901/500/200",
  },
  {
    name: "Agege",
    state: "lagos",
    image: "https://picsum.photos/id/903/500/200",
  },
  {
    name: "Ikorodu",
    state: "lagos",
    image: "https://picsum.photos/id/905/500/200",
  },
];

let yesterday = Datetime.moment().subtract(1, "day");
let valid = function(current) {
  return current.isAfter(yesterday);
};

class Home extends Component {
  componentDidMount() {
    const { statesArray, citiesArray, categoriesArray, tagsArray } = this.props;
    if (
      !statesArray ||
      statesArray.length <= 0 ||
      !citiesArray ||
      citiesArray.length <= 0 ||
      !categoriesArray ||
      categoriesArray.length <= 0 ||
      !tagsArray ||
      tagsArray.length <= 0
    )
      this.props.getTagsStatesCitiesCategories();
    else this.props.resetSearch();

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

  renderCities() {
    const { classes, stateCities, city, cityChange } = this.props;
    if (stateCities && stateCities.length > 0) {
      return (
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={10}>
            <FormControl fullWidth className={classes.selectFormControl}>
              <ReactSelect
                options={stateCities}
                onChange={(e) => cityChange(e.id)}
                placeholder="Search for a city (optional)"
              />
            </FormControl>
          </GridItem>
        </GridContainer>
      );
    }
    return null;
  }

  renderCategories(cssClass) {
    const { classes, categoriesArray } = this.props;
    return categoriesArray.map((cat, index) => {
      let url = cat.imageUrl
        ? cat.imageUrl
        : "https://picsum.photos/id/40" + index + "/500/500";
      return (
        <GridItem key={index} xs={12} sm={3} md={3} className={cssClass}>
          <Card background style={{ backgroundImage: `url(${url})` }}>
            <Link to={`/locations?category=${cat.id}`}>
              <CardBody background>
                <h3
                  className={classes.cardTitleWhite}
                  style={{ paddingTop: "50px" }}
                >
                  {cat.name || ""}
                </h3>
              </CardBody>
            </Link>
          </Card>
        </GridItem>
      );
    });
  }

  renderTags(location) {
    if (location.tags && location.tags.length > 0) {
      return location.tags.map((tag, index) => {
        return (
          <Badge key={index} color="danger">
            {tag || ""}
          </Badge>
        );
      });
    }
    return null;
  }

  renderTopAdspaces(classes) {
    return TOPADSPACES.map((location, index) => {
      return (
        <GridItem xs={12} sm={6} md={6} lg={4} key={index}>
          <Link to={{ pathname: `/location/${location.id}` }}>
            <Card product className={classes.cardHover}>
              <CardHeader image className={classes.cardHeaderHover}>
                <img src={location.imageUrl} alt="..." />
                <div className={classes.cardTitleAbsolute}>
                  {location.name || ""}
                </div>
              </CardHeader>
              <CardBody>
                <Info>
                  <h6 className={classes.cardCategory}>
                    {location.category ? location.category.name || "" : ""}
                  </h6>
                </Info>
                <p className={classes.cardProductDescription}>
                  {`Size (sqm): ${location.size || ""}, Quantity: ${
                    location.quantity
                  }`}
                </p>
                {!_.isEmpty(location.dimension) && (
                  <p className={classes.cardProductDescription}>
                    {`Breadth: ${location.dimension.breadth ||
                      ""}, Length: ${location.dimension.length || ""}`}
                  </p>
                )}
                {this.renderTags(location)}
              </CardBody>
              <CardFooter product>
                <div className={classes.price}>
                  <h4>{`NGN ${location.price || 0}`}</h4>
                </div>
                <div className={`${classes.stats} ${classes.productStats}`}>
                  <Place />{" "}
                  {`${location.state ? location.state.name || "" : ""}, ${
                    location.city ? location.city.name || "" : ""
                  }`}
                </div>
              </CardFooter>
            </Card>
          </Link>
        </GridItem>
      );
    });
  }

  renderPopularCities(classes) {
    return CITIES.map((city, index) => {
      return (
        <GridItem md={3} key={index}>
          <Card
            background
            style={{ backgroundImage: `url(${city.image})`, height: 120 }}
          >
            <CardBody background>
              <h6
                className={classes.cardTitleWhite}
                style={{ textAlign: "left" }}
              >
                {city.name}
              </h6>
            </CardBody>
          </Card>
        </GridItem>
      );
    });
  }

  render() {
    const {
      classes,
      statesArray,
      citiesArray,
      categoriesArray,
      loading,
      state,
      category,
      tagsArray,
      tags,
      stateChange,
      categoryChange,
      searchLocations,
      city,
      isAuthenticated,
      user,
      logOut,
      tagsChange,
      startDateChange,
      startDate,
    } = this.props;

    return (
      <div>
        <Header
          brand="ADSPACE"
          links={
            <HeaderLinks
              dropdownHoverColor="info"
              isAuthenticated={isAuthenticated}
              user={user}
              logOutUser={() => logOut()}
            />
          }
          fixed
          color="transparent"
          changeColorOnScroll={{
            height: 300,
            color: "info",
          }}
        />
        <Parallax image={require("../../assets/img/dg1.jpg")} filter="dark">
          <div className={classes.container} style={{ marginBottom: 90 }}>
            <GridContainer justify="flex-end">
              <GridItem md={8} className={classes.textCenter}>
                <Card raised>
                  <CardHeader>
                    <h2 className={classes.title}>Find Your Ad space</h2>
                  </CardHeader>
                  <CardBody>
                    {loading && <LinearProgress />}
                    <GridContainer justify="center">
                      <GridItem xs={12} sm={12} md={5}>
                        <FormControl
                          variant="outlined"
                          fullWidth
                          className={classes.selectFormControl}
                        >
                          <InputLabel
                            htmlFor="simple-select"
                            className={classes.selectLabel}
                          >
                            Choose tags
                          </InputLabel>
                          <Select
                            multiple
                            variant="outlined"
                            value={tags}
                            onChange={(e) => tagsChange(e.target.value)}
                            MenuProps={{ className: classes.selectMenu }}
                            classes={{ select: classes.select }}
                            inputProps={{
                              name: "multipleSelect",
                              id: "multiple-select",
                            }}
                          >
                            <MenuItem
                              disabled
                              classes={{
                                root: classes.selectMenuItem,
                              }}
                            >
                              Choose 3 Tags
                            </MenuItem>
                            {tagsArray.map((tag, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  classes={{
                                    root: classes.selectMenuItem,
                                    selected:
                                      classes.selectMenuItemSelectedMultiple,
                                  }}
                                  value={tag.id}
                                >
                                  {tag.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={5}>
                        <FormControl
                          fullWidth
                          className={classes.selectFormControl}
                        >
                          <InputLabel
                            htmlFor="simple-select"
                            className={classes.selectLabel}
                          >
                            Ad Type
                          </InputLabel>
                          <Select
                            MenuProps={{
                              className: classes.selectMenu,
                              classes: { paper: classes.selectPaper },
                            }}
                            classes={{
                              select: classes.select,
                            }}
                            value={category}
                            onChange={(value) => {
                              categoryChange(value.target.value);
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
                              Choose an Ad Type
                            </MenuItem>
                            {categoriesArray.map((category, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  classes={{
                                    root: classes.selectMenuItem,
                                  }}
                                  value={category.id}
                                >
                                  {category.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </GridItem>
                    </GridContainer>
                    <GridContainer justify="center">
                      <GridItem xs={12} sm={12} md={5}>
                        <FormControl
                          fullWidth
                          className={classes.selectFormControl}
                        >
                          <br />
                          <ReactSelect
                            options={statesArray}
                            onChange={(e) => stateChange(e.id, citiesArray)}
                            placeholder="Search for a state (optional)"
                            outlined={false}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={5}
                        style={{ marginTop: 10 }}
                      >
                        <br />
                        <FormControl fullWidth>
                          <Datetime
                            timeFormat={false}
                            isValidDate={valid}
                            value={startDate}
                            inputProps={{
                              placeholder: "Start Date",
                            }}
                            onChange={(e) => startDateChange(e)}
                          />
                        </FormControl>
                      </GridItem>
                    </GridContainer>
                    {this.renderCities()}
                    <br />
                    <GridContainer justify="center">
                      <GridItem xs={12} sm={12} md={6}>
                        <Link
                          to={`/locations?state=${state ||
                            ""}&city=${city}&category=${category}`}
                        >
                          <Button color="success" className={classes.button}>
                            Search
                          </Button>
                        </Link>
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classes.main}>
          <div className={classes.container}>
            <GridContainer>
              <h4 className={classes.title} style={{ marginBottom: 20 }}>
                Popular Cities
              </h4>
            </GridContainer>
            <GridContainer justify="center">
              {this.renderPopularCities(classes)}
            </GridContainer>
          </div>

          <div className={classes.container}>
            <GridContainer>
              <h4 className={classes.title} style={{ marginBottom: 20 }}>
                Top Adspaces
              </h4>
            </GridContainer>
            <GridContainer justify="center">
              {this.renderTopAdspaces(classes)}
            </GridContainer>
          </div>

          <div className={classes.container}>
            <GridContainer>
              <h4 className={classes.title} style={{ marginBottom: 20 }}>
                Top Categories
              </h4>
            </GridContainer>
            <GridContainer justify="center">
              {this.renderCategories(classes.photoGallery)}
            </GridContainer>
          </div>

          <div className={classes.sectionTestimonials}>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem
                  md={8}
                  className={classNames(classes.mlAuto, classes.mrAuto)}
                >
                  <h2 className={classes.title}>Trusted by 100+ Brands</h2>
                  <h5 className={classes.description}>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                    <b> 100+ brands</b> in over <b> 100+ ad locations</b>{" "}
                    available
                  </h5>
                </GridItem>
              </GridContainer>
              <br />
              <br />
              <GridContainer justify="center">
                <GridItem md={4} sm={4}>
                  <Card plain profile>
                    <GridContainer>
                      <GridItem md={3} sm={3}>
                        <CardHeader image plain>
                          <a href="#pablo">
                            <img src={profilePic1} alt="..." />
                          </a>
                          <div
                            className={classes.coloredShadow}
                            style={{
                              backgroundImage: "url(" + profilePic1 + ")",
                              opacity: "1",
                            }}
                          />
                          <div
                            className={classes.coloredShadow}
                            style={{
                              backgroundImage: "url(" + profilePic1 + ")",
                              opacity: "1",
                            }}
                          />
                        </CardHeader>
                      </GridItem>
                      <GridItem md={9} sm={9}>
                        <CardBody plain className={classes.alignLeft}>
                          <h4 className={classes.cardTitle}>Khaldi Yass</h4>
                          <p className={classes.cardDescription}>
                            {'"'}Lorem Ipsum is simply dummy text of the
                            printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since
                            the 1500s, {'"'}
                          </p>
                        </CardBody>
                      </GridItem>
                    </GridContainer>
                  </Card>
                </GridItem>
                <GridItem md={4} sm={4}>
                  <Card plain profile>
                    <GridContainer>
                      <GridItem md={3} sm={3}>
                        <CardHeader image plain>
                          <a href="#pablo">
                            <img src={profilePic2} alt="..." />
                          </a>
                          <div
                            className={classes.coloredShadow}
                            style={{
                              backgroundImage: "url(" + profilePic2 + ")",
                              opacity: "1",
                            }}
                          />
                          <div
                            className={classes.coloredShadow}
                            style={{
                              backgroundImage: "url(" + profilePic2 + ")",
                              opacity: "1",
                            }}
                          />
                        </CardHeader>
                      </GridItem>
                      <GridItem md={9} sm={9}>
                        <CardBody plain className={classes.alignLeft}>
                          <h4 className={classes.cardTitle}>Josh Murray</h4>
                          <p className={classes.cardDescription}>
                            {'"'}Lorem Ipsum is simply dummy text of the
                            printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since
                            the 1500s,
                            {'"'}
                          </p>
                        </CardBody>
                      </GridItem>
                    </GridContainer>
                  </Card>
                </GridItem>
                <GridItem md={4} sm={4}>
                  <Card plain profile>
                    <GridContainer>
                      <GridItem md={3} sm={3}>
                        <CardHeader image plain>
                          <a href="#pablo">
                            <img src={profilePic3} alt="..." />
                          </a>
                          <div
                            className={classes.coloredShadow}
                            style={{
                              backgroundImage: "url(" + profilePic3 + ")",
                              opacity: "1",
                            }}
                          />
                          <div
                            className={classes.coloredShadow}
                            style={{
                              backgroundImage: "url(" + profilePic3 + ")",
                              opacity: "1",
                            }}
                          />
                        </CardHeader>
                      </GridItem>
                      <GridItem md={9} sm={9}>
                        <CardBody plain className={classes.alignLeft}>
                          <h4 className={classes.cardTitle}>Michael Onubogu</h4>
                          <p className={classes.cardDescription}>
                            {'"'}Lorem Ipsum is simply dummy text of the
                            printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since
                            the 1500s, {'"'}
                          </p>
                        </CardBody>
                      </GridItem>
                    </GridContainer>
                  </Card>
                </GridItem>
              </GridContainer>
              <div className={classes.ourClients}>
                <GridContainer justify="center">
                  <GridItem md={3} sm={3}>
                    <img src={Vodafone} alt="vodafone" />
                  </GridItem>
                  <GridItem md={3} sm={3}>
                    <img src={Microsoft} alt="microsoft" />
                  </GridItem>
                  <GridItem md={3} sm={3}>
                    <img src={Harvard} alt="harvard" />
                  </GridItem>
                  <GridItem md={3} sm={3}>
                    <img src={Standford} alt="stanford" />
                  </GridItem>
                </GridContainer>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.section}>
          <div className={classes.container}>
            {/* Feature 1 START */}
            <div className={classes.features1}>
              <GridContainer>
                <GridItem
                  xs={12}
                  sm={8}
                  md={8}
                  className={classes.mlAuto + " " + classes.mrAuto}
                >
                  <h2 className={classes.title}>Why our product is the best</h2>
                  <h5 className={classes.description}>
                    This is the paragraph where you can write more details about
                    your product. Keep you user engaged by providing meaningful
                    information. Remember that by this time, the user is
                    curious, otherwise he wouldn{"'"}t scroll to get here. Add a
                    button if you want the user to see more.
                  </h5>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={4} md={4}>
                  <InfoArea
                    vertical
                    icon={Place}
                    title="100+ Locations"
                    description="Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing a feature will be enough"
                    iconColor="info"
                  />
                </GridItem>
                <GridItem xs={12} sm={4} md={4}>
                  <InfoArea
                    vertical
                    icon={VerifiedUser}
                    title="Verified Users"
                    description="Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing a feature will be enough."
                    iconColor="success"
                  />
                </GridItem>
                <GridItem xs={12} sm={4} md={4}>
                  <InfoArea
                    vertical
                    icon={ShutterSpeed}
                    title="Optimized Searches"
                    description="Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing a feature will be enough."
                    iconColor="danger"
                  />
                </GridItem>
              </GridContainer>
            </div>
            {/* Feature 1 END */}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ home, login }) => {
  const {
    loading,
    error,
    message,
    statesArray,
    citiesArray,
    categoriesArray,
    stateCities,
    state,
    city,
    category,
    tagsArray,
    tags,
    startDate,
  } = home;
  const { isAuthenticated, user } = login;
  return {
    loading,
    error,
    message,
    statesArray,
    citiesArray,
    categoriesArray,
    stateCities,
    state,
    city,
    category,
    isAuthenticated,
    user,
    tagsArray,
    tags,
    startDate,
  };
};

export default connect(
  mapStateToProps,
  {
    getTagsStatesCitiesCategories,
    stateChange,
    cityChange,
    categoryChange,
    resetSearch,
    setAuthenticated,
    logOut,
    tagsChange,
    startDateChange,
  }
)(withStyles(blogPostPageStyle)(Home));
