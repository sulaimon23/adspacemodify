import React, { Component, useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import blogPostPageStyle from "../../assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";
import {
  LinearProgress,
  withStyles,
  List,
  Typography,
  CircularProgress
} from "@material-ui/core";

import Header from "../../components/Header/Header";
import HeaderLinks from "../../components/Header/HeaderLinks";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Button from "../../components/CustomButtons/Button.js";
import Card from "../../components/Card/Card";
import PageFooter from "../../components/Footer/PageFooter";
import CardBody from "../../components/Card/CardBody";
import FormControl from "@material-ui/core/FormControl";
import classNames from "classnames";
import BrowseImg from "assets/img/Browse.png";
import BookImg from "assets/img/Book.png";
import CompareImge from "assets/img/Compare.png";



import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  numberWithCommas,
  substringText,
  formatCurrency,
  // convertPrice,
} from "../../utils";

import CardCustomTwo from "./../../components/Card/CardCustomTwo";

import SearchImge from "assets/img/g1.png";
import VerifyImge from "assets/img/g2.png";
import LocationImge from "assets/img/g3.png";

import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

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
  countryChange
} from "../../actions";
import InfoArea from "../../components/InfoArea/InfoArea";
import { Place, ShutterSpeed, VerifiedUser } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { getAuth, getDb } from "../../firebase";
import Datetime from "react-datetime";
import Select from "react-select";
import Info from "../../components/Typography/Info";
import _ from "underscore";
import Badge from "../../components/Badge/Badge";
import { dangerColor } from "../../assets/jss/material-kit-pro-react";
import moment from "moment";
import backImg from "../../assets/img/Banner1.jpg";
import "./Home.scss";
import MyItems from "./Item";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Carousel from "react-elastic-carousel";
import { getRate } from "actions/RatesAction.js";

const TOPADSPACES = [
  {
    id: "Grlt5iVOy0vhtl9J7K3P",
    name: "Channels Television (6AM - 3PM)",
    imageUrl: "https://picsum.photos/id/214/500/500",
    category: { name: "Television" },
    price: 46077,
    size: 10,
    quantity: 50,
    discountedPrice: { checked: false, value: "25000" },
  },
  {
    id: "cgHlAX8huvY60EUlRjFF",
    name: "Freedom Way Lekki",
    imageUrl: "https://picsum.photos/id/313/500/500",
    category: { name: "Outdoor (OOH)" },
    price: 50000,
    size: 10,
    quantity: 50,
    discountedPrice: { checked: true, value: "40000" },
  },
  {
    id: "0i7D8IIFSMIMcSrvV0Gu",
    name: "Location 2",
    imageUrl: "https://picsum.photos/id/407/500/500",
    category: { name: "Outdoor (OOH)" },
    price: 6000,
    size: 10,
    quantity: 50,
    discountedPrice: { checked: true, value: "5800" },
  },
];

const images = [
  "https://firebasestorage.googleapis.com/v0/b/adspaceprod-11ddc.appspot.com/o/assets%2Fpopular-cities%2Fvictoria-island.jpg?alt=media&token=dd447d08-e617-4e23-8df2-79aab4ff6fc1",
  "https://firebasestorage.googleapis.com/v0/b/adspaceprod-11ddc.appspot.com/o/assets%2Fpopular-cities%2Fabuja.jpg?alt=media&token=f963a523-212d-4d0f-9102-c9fb3df0c147",
  "https://firebasestorage.googleapis.com/v0/b/adspaceprod-11ddc.appspot.com/o/assets%2Fpopular-cities%2Fikeja.jpg?alt=media&token=c9cd1a81-cdbc-4eaa-a6c0-90f3ce8c6c4f",
  "https://firebasestorage.googleapis.com/v0/b/adspaceprod-11ddc.appspot.com/o/assets%2Fpopular-cities%2Fportharcourt.jpg?alt=media&token=e4328a11-168f-4fb7-8d1a-6b5f78417d62",
]

const CITIES = [
  {
    id: "victoriaisland",
    name: "Victoria Island",
    state: "lagos",
    image:
      "https://firebasestorage.googleapis.com/v0/b/adspaceprod-11ddc.appspot.com/o/assets%2Fpopular-cities%2Fvictoria-island.jpg?alt=media&token=dd447d08-e617-4e23-8df2-79aab4ff6fc1",
  },
  {
    id: "abuja",
    name: "Abuja",
    state: "abuja",
    image:
      "https://firebasestorage.googleapis.com/v0/b/adspaceprod-11ddc.appspot.com/o/assets%2Fpopular-cities%2Fabuja.jpg?alt=media&token=f963a523-212d-4d0f-9102-c9fb3df0c147",
  },
  {
    id: "ikeja",
    name: "Ikeja",
    state: "lagos",
    image:
      "https://firebasestorage.googleapis.com/v0/b/adspaceprod-11ddc.appspot.com/o/assets%2Fpopular-cities%2Fikeja.jpg?alt=media&token=c9cd1a81-cdbc-4eaa-a6c0-90f3ce8c6c4f",
  },
  {
    id: "portharcourt",
    name: "Portharcourt",
    state: "portharcourt",
    image:
      "https://firebasestorage.googleapis.com/v0/b/adspaceprod-11ddc.appspot.com/o/assets%2Fpopular-cities%2Fportharcourt.jpg?alt=media&token=e4328a11-168f-4fb7-8d1a-6b5f78417d62",
  },
];

let yesterday = Datetime.moment().subtract(1, "day");
let valid = function(current) {
  return current.isAfter(yesterday);
};

const styles = {
  container: {
    height: "600px",
  },
  select: {
    height: "50px",
    paddingBottom: "0",
    // padding: "70px 0",
  },
};

const breakPoints = [
  { width: 1, itemsToShow: 2 },
  { width: 550, itemsToShow: 3 },
  { width: 768, itemsToShow: 4 },
  { width: 1200, itemsToShow: 4 },
];

var settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const Home = (props) => {
  document.title = 'Adspace.ng | Advert Space | Billboards | Television | Newspaper |Radio | Influencer | Magazine';
  const [items, setItems] = useState([
    { id: 1, title: require("../../assets/img/l1.png") },
    { id: 2, title: require("../../assets/img/l1.png") },
    { id: 3, title: require("../../assets/img/l1.png") },
    { id: 4, title: require("../../assets/img/l1.png") },
    { id: 5, title: require("../../assets/img/l1.png") },
  ]);
  const [responsive, setResponsive] = useState({
    0: {
      items: 1,
    },
    450: {
      items: 2,
    },
    600: {
      items: 3,
    },
    1000: {
      items: 5,
    },
  });
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [ newsletter, setNewsletter ] = useState('');
  const [newsletterLoading, setnewsletterLoading] = useState(false);
  const ref = getDb().collection('newsletter');

  const [countryCode, setCountryCode] = useState("NG");
  const [email, setEmail] = useState("");
  const [needConvert, setneedConvert] = useState(false);
  const [currExch, setcurrExch] = useState(386.39);
  //   // nav : ['<p class="fa fa-angle-left" aria-hidden="true">rjnjf</p>','<i class="fa fa-angle-right" aria-hidden="true"></i>']
  // };

  const currency = useSelector((state) => state.paymentType.currency);
  const exchange = useSelector((state) => state.paymentType.exchange);
  useEffect(() => {
    const {
      statesArray,
      citiesArray,
      categoriesArray,
      tagsArray,
      countryArray,
      getTopCitiesAndTopAdspaces
    } = props;
    if (
      !statesArray ||
      statesArray.length <= 0 ||
      !citiesArray ||
      citiesArray.length <= 0 ||
      !categoriesArray ||
      categoriesArray.length <= 0 ||
      !tagsArray ||
      tagsArray.length <= 0 ||
      !countryArray ||
      countryArray.length <= 0
    ){
      props.getTagsStatesCitiesCategories();
    }
    else props.resetSearch();
    props.getRate();
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified === true) props.setAuthenticated(true, user);
        else props.setAuthenticated(false, user);
      } else {
        props.setAuthenticated(false, user);
      }
    });
    // getGeoLocation();
    // getCurrencyExchange();
  }, []);

  const notify = () => toast.success("Subscribed successfully!");
  const notifyerror = () => toast.success("Error not successful");

  const getGeoLocation = async () => {
    const geolocation = localStorage.getItem("geolocation");
    if (geolocation) {
      //prevents the API fetching every time
      const val = JSON.parse(geolocation);
      return setCountryCode(val.countryCode);
    }
    const response = await fetch("http://ip-api.com/json", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    // console.log(response.json());
    const res = await response.json();

    if (res.status === "success") {
      if (res.countryCode !== "NG") setneedConvert(true);
      setCountryCode(res.countryCode);
      localStorage.setItem("geolocation", JSON.stringify(res));
    } else {
      return;
    }
  };

  const getCurrencyExchange = async () => {
    const exchange = localStorage.getItem("exchange");
    if (exchange) {
      //prevents the API fetching every time
      const val = JSON.parse(exchange);
      return setcurrExch(val.USDNGN);
    }
    const response = await fetch(
      "http://api.currencylayer.com/live?access_key=455082e71597d5bea52549772cb8e260&currencies=NGN,AUD,CAD,NGN,MXN&format=1",
      {
        method: "GET",
      }
    );
    const res = await response.json();
    if (res.success) {
      setcurrExch(res.quotes.USDNGN);
      localStorage.setItem("exchange", JSON.stringify(res.quotes));
    }
  };

async function emailNewsletter(e) {
  e.preventDefault();
  setnewsletterLoading(true)
  await ref.add({
    email: newsletter,
  }).then((result) => notify()).catch((err) => notifyerror());
  setNewsletter('');
  setnewsletterLoading(false)
}

  const renderCities = () => {
    const { classes, stateCities, city, cityChange } = props;
    if (stateCities && stateCities.length > 0) {
      return (
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={10}>
            <FormControl fullWidth className={classes.selectFormControl}>
              <Select
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
  };

  const renderPrice = (discountedPrice = {}, location) => {
    if (!discountedPrice.checked) {
      return (
        <div style={{ display: "flex", flexDirection: "row" }}>
        <h4
            style={{ color: "#000", fontSize: 15 }}
          >{` ${numberWithCommas(
            formatCurrency(
              location.price || 0,
              exchange,
              currency
            )
          )}`}</h4>
          {' '}
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

  const renderCategories = (cssClass) => {
    const { classes, categoriesArray } = props;
    return categoriesArray.map((cat, index) => {
      let url = cat.imageUrl
        ? cat.imageUrl
        : "https://picsum.photos/id/40" + index + "/500/500";
      return (
        <GridItem key={index} xs={12} sm={4} md={4} className={cssClass}>
          <div className="city-text">
            <Card background style={{ backgroundImage: `url(${url})` }}>
              <Link to={`/locations?category=${cat.id}`}>
                <CardBody background>
                  <h3
                    className={classes.cardTitleWhite}
                    className="city-h3"
                    style={{ paddingTop: "50px", fontWeight: "800" }}
                  >
                    {cat.name || ""}
                  </h3>
                </CardBody>
              </Link>
            </Card>
          </div>
        </GridItem>
      );
    });
  };

  const renderTags = (location) => {
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
  };

  const renderTopAdspaces = (classes, topAdspaces, loading) => {
    if (loading){
      return <LinearProgress />
    }
    return topAdspaces.map((location, index) => {
      return (
        <GridItem key={index} xs={12} sm={12} md={4}>
          <Link
            style={{ display: "inline-block", width: "100%" }}
            to={{ pathname: `/location/${location.id}` }}
          >
            <CardCustomTwo
              product
              classes={classes}
              location={location}
              substringText={substringText}
              Info={Info}
              renderPrice={renderPrice}
              numberWithCommas={numberWithCommas}
            />
          </Link>
        </GridItem>
      );
    });
  };
  

  const renderPopularCities = (classes, topCities, loading) => {
    if (loading){
      return [1,2,3,4].map((city, index) => {
        return (
            <GridItem md={3} key={index}>
              <div className="city-text">
                <Card
                    background
                    style={{ backgroundImage: `url(${images[index]})`, height: 120 }}
                >
                  <CardBody background>
                    <LinearProgress />
                  </CardBody>
                </Card>
              </div>
            </GridItem>
        );
      });
    }else {
      return topCities.map((city, index) => {
        return (
            <GridItem md={3} key={index}>
              <div className="city-text">
                <Link to={`/locations?state=${city.state}&city=${city.id}`}>
                  <Card
                      background
                      style={{ backgroundImage: `url(${images[index]})`, height: 120 }}
                  >
                    <CardBody background>
                      <h6
                          // className={classes.cardTitleWhite}
                          style={{ textAlign: "left" }}
                          className="city-h6"
                      >
                        {city.name}
                      </h6>
                    </CardBody>
                  </Card>
                </Link>
              </div>
            </GridItem>
        );
      });
    }
  };

  const {
    classes,
    statesArray,
    countryArray,
    country,
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
    countryChange,
    city,
    isAuthenticated,
    user,
    logOut,
    tagsChange,
    startDateChange,
    startDate,
    topCities,
    topAdspaces
  } = props;
  return (
    <div>
      <ToastContainer />
      <Header
        brand="ADSPACE"
        links={
          <HeaderLinks
            dropdownHoverColor="red"
            isAuthenticated={isAuthenticated}
            user={user}
            logOutUser={() => logOut()}
          />
        }
        fixed
        color="blue"
        // changeColorOnScroll={{
        //   height: 300,
        //   color: "dark",
        // }}
      />
      <div className="my-header">
        <div className="mobile-pd">
          <h2 className="heading">Find and Book Advert Spaces in Nigeria</h2>
          <p className="heading-p">
            BIllboards, Influencers, Television, Print, Radio and More...
          </p>
        </div>
        <form className="gallery">
          <GridContainer>
            <GridItem xs={12} sm={12} md={3}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <Select
                  options={categoriesArray}
                  onChange={(e) => categoryChange(e.id)}
                  placeholder="Select Ad type"
                  outlined={false}
                  styles={styles.select}
                />
              </FormControl>
            </GridItem>

            <GridItem xs={12} sm={12} md={4}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <Select
                  style={{ borderRadius: "10px" }}
                  options={statesArray.concat(countryArray).sort()}
                  onChange={(e) => stateChange(e.id, statesArray, countryArray)}
                  placeholder="State or City"
                  outlined={false}
                  isLoading={loading}
                  className={classes.selectFormControl}
                  // className="home-hover-btn"
                />
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
              <Datetime
                timeFormat={false}
                isValidDate={valid}
                value={startDate}
                style={{
                  marginTop: "0px",
                  fontSize: "14px",
                  color: "#000",
                }}
                inputProps={{
                  placeholder: "Start Date",
                }}
                onChange={(e) => startDateChange(e)}
              />
              {/* </FormControl> */}
            </GridItem>

            <GridItem xs={12} sm={12} md={2}>
              <Link
                // to={`/locations?state=${state ||
                //   ""}&city=${city}&country=${country}&category=${category}&startDate=${
                //   startDate === ""
                //     ? ""
                //     : moment(startDate).format("MM-DD-YYYY")
                // }`}
                to={
                  state || country || category || startDate
                    ? `/locations?state=${state ||
                        ""}&city=${city}&country=${country}&category=${category}&startDate=${
                        startDate === ""
                          ? ""
                          : moment(startDate).format("MM-DD-YYYY")
                      }`
                    : null
                }
              >
                <div
                  // color="info"
                  className="hover-btn"
                  style={{
                    justifyContent: "center",
                  }}
                >
                  Search
                </div>
              </Link>
            </GridItem>
          </GridContainer>
        </form>
      </div>

      <div className={classes.main}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <h4
              className={classes.title}
              style={{ marginBottom: 20, paddingTop: 30, fontSize: "25px" }}
            >
              Popular Cities
            </h4>
          </GridContainer>
          <GridContainer justify="center">
            {renderPopularCities(classes, topCities, loading)}
          </GridContainer>
        </div>

        <div className={classes.container}>
          <GridContainer justify="center">
            <h4
              className={classes.title}
              style={{ marginBottom: 50, fontSize: "25px" }}
            >
              Top Adspaces
            </h4>
          </GridContainer>
          <GridContainer justify="center">
          
              {renderTopAdspaces(classes, topAdspaces, loading)}
            
          </GridContainer>
        </div>

        <div className={classes.container}>
          <GridContainer justify="center">
            <h4
              className={classes.title}
              style={{ marginBottom: 20, fontSize: "25px" }}
            >
              Top Categories
            </h4>
          </GridContainer>
          <GridContainer justify="center">
            {renderCategories(classes.photoGallery)}
          </GridContainer>
        </div>

        <div className={classes.container}>
          <div
            style={{
              borderWidth: 1,
              backgroundColor: "#0d25d3",
              padding: "3rem",
            }}
          >
            <GridContainer
              style={
                {
                  // height: '15rem',
                  // justifyContent: 'space-between',
                  // alignItems: 'center',
                  // display: 'flex', paddingLeft: "2rem", paddingRight: "2rem"
                }
              }
            >
              <GridItem
                md={4}
                // className={classNames(classes.mlAuto, classes.mrAuto)}
              >
                <img
                  width="100%"
                  height="100%"
                  src={require("../../assets/img/t1.png")}
                  alt="subscribe"
                />
              </GridItem>
              <GridItem
                md={8}
                // className={classNames(classes.mlAuto, classes.mrAuto)}
              >
                <div xs={12} sm={12} style={{ marginBottom: "1rem" }}>
                  <h2 className={classes.title} style={{ color: "#fff" }}>
                    {" "}
                    Subscribe to see our secret deal{" "}
                  </h2>
                  <h5 className={classes.description} style={{ color: "#fff" }}>
                    Prices drop the second you sign up!{" "}
                  </h5>
                </div>
                <form onSubmit={emailNewsletter}>
                  <GridContainer>
                    <GridItem
                      md={9}
                      // className={classNames(classes.mlAuto, classes.mrAuto)}
                    >
                      <input
                        className="my-input"
                        type="email"
                        required
                        value={newsletter}
                        style={{
                          height: 50,
                          borderRadius: "50px",
                          border: 0,
                          marginBottom: "1rem",
                          paddingLeft: "1.5rem",
                          fontSize: "16px",
                          fontWeight: "700",
                        }}
                        placeholder="subscribe"
                        onChange={(e) => setNewsletter( e.target.value )}
                      />
                    </GridItem>
                    <GridItem
                      md={3}
                      // className={classNames(classes.mlAuto, classes.mrAuto)}
                    >
                      <Button
                        className="hover-btn"
                        disabled={loadingEmail}
                        type="submit"
                        style={{
                          justifyContent: "center",
                          backgroundColor: "#e62f2d",
                        }}
                      >
                        {!newsletterLoading ? 'Sign me up'  : 'Waiting..'}
                      </Button>
                    </GridItem>
                  </GridContainer>
                </form>
              </GridItem>
            </GridContainer>
          </div>
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
                  Find the right Adspace for your brand select from{" "}
                  <b> 5000+ Ad locations</b> we have available
                </h5>
              </GridItem>
            </GridContainer>
            <br />
            <br />

            <div className={classes.ourClients}>
              <OwlCarousel
                className="owl-theme"
                loop
                dots={false}
                margin={10}
                responsiveClass={true}
                items={5}
                // nav={this.state.nav}
                responsive={responsive}
                // {...this.state.navText}
                autoplay={true}
                touchDrag={true}
                animateIn={true}
              >
                <MyItems>
                  <img
                    src={require("../../assets/img/l1.png")}
                    alt="stanford"
                    height="100%"
                    width="100%"
                    alt="icon-1"
                  />
                </MyItems>

                <MyItems>
                  <img
                    src={require("../../assets/img/l3.png")}
                    alt="stanford"
                    height="100%"
                    width="100%"
                    alt="icon-2"
                  />
                </MyItems>

                <MyItems>
                  <img
                    src={require("../../assets/img/l4.png")}
                    alt="stanford"
                    height="100%"
                    width="100%"
                    alt="icon-2"
                  />
                </MyItems>

                <MyItems>
                  <img
                    src={require("../../assets/img/l5.png")}
                    alt="stanford"
                    height="100%"
                    width="100%"
                    alt="icon-4"
                  />
                </MyItems>

                <MyItems>
                  <img
                    src={require("../../assets/img/l6.png")}
                    alt="stanford"
                    height="100%"
                    width="100%"
                    alt="icon-5"
                  />
                </MyItems>

                <MyItems>
                  <img
                    src={require("../../assets/img/l7.png")}
                    alt="stanford"
                    height="100%"
                    width="100%"
                    alt="icon-6"
                  />
                </MyItems>

                <MyItems>
                  <img
                    src={require("../../assets/img/l8.png")}
                    alt="stanford"
                    height="100%"
                    width="100%"
                    alt="icon-7"
                  />
                </MyItems>

                <MyItems>
                  <img
                    src={require("../../assets/img/l9.png")}
                    alt="stanford"
                    height="100%"
                    width="100%"
                    alt="icon-8"
                  />
                </MyItems>

                <MyItems>
                  <img
                    src={require("../../assets/img/l10.png")}
                    alt="stanford"
                    height="100%"
                    width="100%"
                    alt="icon-9"
                  />
                </MyItems>
              </OwlCarousel>
            </div>
            {/* {this.state.items.map(item => <img key={item.id} src={item.title} alt="vodafone" height='100%' width="100%" />)} */}

            <div
              className={classes.container}
              style={{
                textAlign: "center",
                backgroundColor: "#fff",
                marginTop: "60px",
              }}
            >
              <p
                style={{ textAlign: "center", marginTop: "2rem" }}
                className="brand-header"
              >
                How Adspace works
              </p>
              <GridContainer
                style={{ marginTop: "3rem", marginBottom: "6rem" }}
              >
                <GridItem xs={12} sm={4} md={4}>
                  <div className="home123">
                    {/* <h1 className="header-number">1</h1> */}
                    <img src={BrowseImg} width="100%" alt="brose-image" />
                    <div className="absolute">
                      <p className="header-text">Browse</p>
                      <span className="header-subText">
                        Over <strong>5000</strong> ad spaces from 16 media types
                      </span>
                    </div>
                  </div>
                </GridItem>

                <GridItem xs={12} sm={4} md={4}>
                  <div className="home123">
                    {/* <h1 className="header-number">2</h1> */}
                    <img src={CompareImge} width="100%" alt="compare-image" />
                    <div className="absolute">
                      <p className="header-text">Compare</p>
                      <span className="header-subText">
                        Transparent media information and rates
                      </span>
                    </div>
                  </div>
                </GridItem>

                <GridItem xs={12} sm={4} md={4}>
                  <div className="home123">
                    {/* <h1 className="header-number">3</h1> */}
                    <img src={BookImg} width="100%" alt="book-image" />
                    <div className="absolute">
                      <p className="header-text">Book</p>
                      <span className="header-subText">
                        Pay and voila, your ad space is booked!
                      </span>
                    </div>
                  </div>
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </div>
        <PageFooter />
      </div>
    </div>
  );
};

const mapStateToProps = ({ home, login }) => {
  const {
    loading,
    error,
    message,
    statesArray,
    citiesArray,
    categoriesArray,
    stateCities,
    countryArray,
    state,
    city,
    country,
    category,
    tagsArray,
    tags,
    startDate,
    topCities,
    topAdspaces
  } = home;
  const { isAuthenticated, user } = login;

  return {
    loading,
    error,
    message,
    statesArray,
    citiesArray,
    categoriesArray,
    countryArray,
    stateCities,
    state,
    city,
    category,
    country,
    isAuthenticated,
    user,
    tagsArray,
    tags,
    startDate,
    topCities,
    topAdspaces
  };
};

export default connect(
  mapStateToProps,
  {
    getTagsStatesCitiesCategories,
    stateChange,
    getRate,
    cityChange,
    categoryChange,
    resetSearch,
    setAuthenticated,
    logOut,
    tagsChange,
    startDateChange,
    countryChange,
  }
)(withStyles(blogPostPageStyle)(Home));
