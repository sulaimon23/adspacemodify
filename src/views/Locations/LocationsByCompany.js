import React, {Component} from 'react';
import {connect} from "react-redux";
import { getLocations, logOut, setAuthenticated, getTagsStatesCitiesCategories,
    getLocationsByCompanyUsername } from '../../actions';
import  qs from 'qs';
import Header from "../../components/Header/Header";
import HeaderLinks from "../../components/Header/HeaderLinks";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import blogPostPageStyle from "../../assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";
import {LinearProgress, withStyles} from "@material-ui/core";
import classNames from "classnames";
import CardBody from "../../components/Card/CardBody";
import Info from "../../components/Typography/Info";
import CardFooter from "../../components/Card/CardFooter";
import {Place, Search} from "@material-ui/icons";
import Badge from "../../components/Badge/Badge";
import {Link} from "react-router-dom";
import {getAuth} from "../../firebase";
import Footer from "../../components/Footer/Footer";
import _ from 'underscore';
import {dangerColor, infoColor, successColor} from "../../assets/jss/material-kit-pro-react";
import ReactSelect from "react-select";
import FormControl from "@material-ui/core/FormControl";
import Datetime from "react-datetime";
import Button from "../../components/CustomButtons/Button";
import CardCustom from "./../../components/Card/CardCustom";
import { numberWithCommas, substringText } from "../../utils";
import NewNavbar from 'components/NewNavbar';


let yesterday = Datetime.moment().subtract( 1, 'day' );
let valid = function( current ){
    return current.isAfter( yesterday );
};

class LocationsByCompany extends Component{

    constructor(props){
        super(props);
        this.state = {
            startDate: '',
            state: '', city: '' , category: ''
        }
    }

    componentDidMount() {
        const { location, statesArray, categoriesArray, tagsArray, countryArray } = this.props;
        if (location && location.pathname){
            let companyUserName = location.pathname;
            this.props.getLocationsByCompanyUsername(companyUserName);
        }

        if (!statesArray || statesArray.length <= 0 || !categoriesArray || categoriesArray.length <= 0 ||
            !tagsArray || tagsArray.length <= 0 ||
      !countryArray ||
      countryArray.length <= 0 )
            this.props.getTagsStatesCitiesCategories();

        getAuth().onAuthStateChanged((user) => {
            if (user){
                if (user.emailVerified === true)
                    this.props.setAuthenticated(true, user);
                else
                    this.props.setAuthenticated(false, user);
            }else{
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

    renderTags(location){
        if (location.tags && location.tags.length > 0){
            return location.tags.map((tag, index) => {
                return(
                    <Badge key={index} color="danger">{tag || ''}</Badge>
                )
            })
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

    renderPrice(discountedPrice = null, location){
        if (!discountedPrice.checked){
            return (
                <div>
                    <div style={{ display: "flex", flexDirection: "row"}}>
                        <h4 style={{ fontSize: 15, textDecoration: "line-through", textDecorationStyle: "double"}}>N</h4>
                        <h4 style={{ fontSize: 15}}>{` ${numberWithCommas(location.price || 0)}`}</h4>
                    </div>
                    <div>
                        <h4 style={{ fontSize: 9, color: infoColor[1]}}>{`${location.pricingOption ? 'per ' + location.pricingOption.name : ''}` }</h4>
                    </div>
                </div>
            );
        }else{
            return(
                <div>
                    <div style={{ display: "flex", flexDirection: "row"}}>
                        <h4 style={{ fontSize: 15, textDecoration: "line-through", textDecorationStyle: "double"}}>N</h4>
                        <h4 style={{ fontSize: 15}}>{`${numberWithCommas(location.discountedPrice.value || 0)}`}</h4>
                    </div>
                    <div>
                        <h4 style={{ textDecoration: "line-through", fontWeight: "normal", color: dangerColor[1], fontSize: 12 }}>
                            {`N ${numberWithCommas(location.price || 0)}`}
                        </h4>
                        <h4 style={{ fontSize: 9, color: infoColor[1]}}>{`${location.pricingOption ? 'per ' + location.pricingOption.name : ''}` }</h4>
                    </div>
                </div>
            )
        }
    }

    // renderAdSpaces(){
    //     const { locationsArray, classes } = this.props;

    //     if (locationsArray && locationsArray.length > 0){
    //         return locationsArray.map((location, index) => {
    //             return(
    //                 <GridItem xs={12} sm={6} md={6} lg={3} key={index}>
    //                     <Link to={{ pathname: `/location/${location.id}`, location }}>
    //                         <Card product className={classes.cardHover} style={{ height: "510px"}}>
    //                             <CardHeader image className={classes.cardHeaderHover}>
    //                                 <img src={location.images ? location.images[0] : location.imageUrl} alt="..." height="250"/>
    //                                 <div className={classes.cardTitleAbsolute}>
    //                                     {location.name || ''}
    //                                 </div>
    //                             </CardHeader>
    //                             <CardBody>
    //                                 <Info>
    //                                     <h6 className={classes.cardCategory}>{location.category ? (location.category.name || '') : ''}</h6>
    //                                 </Info>
    //                                 <p className={classes.cardProductDescription}>
    //                                     {`Size (sqm): ${location.size || ''}, Quantity: ${location.quantity}`}
    //                                 </p>
    //                                 {!_.isEmpty(location.dimension) &&
    //                                 <p className={classes.cardProductDescription}>
    //                                     {`Breadth: ${location.dimension.breadth || ''}, Length: ${location.dimension.length || ''}`}
    //                                 </p>
    //                                 }
    //                                 {this.renderTags(location)}
    //                             </CardBody>
    //                             <CardFooter product>
    //                                 <div className={classes.price}>
    //                                     {this.renderPrice(location.discountedPrice, location)}
    //                                 </div>
    //                                 <div className={`${classes.stats} ${classes.productStats}`}>
    //                                     <Place /> {`${location.city ? (location.city.name || '') : ''}, ${location.state ? (location.state.name || '') : ''}`}
    //                                 </div>
    //                             </CardFooter>
    //                         </Card>
    //                     </Link>
    //                 </GridItem>
    //             )
    //         })
    //     }
    // }

    renderAdSpaces() {
        const { locationsArray, classes } = this.props;

        if (locationsArray && locationsArray.length > 0) {
        return locationsArray.map((location, index) => {
            return (
            <GridItem xs={12} sm={6} md={6} lg={4} key={index}>
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
                />
                </Link>
            </GridItem>
            );
        });
        }
    }

    render() {
        const { classes, locationsArray, query , loading, isAuthenticated, user, logOut, statesArray,
            tagsArray, categoriesArray, countryArray } = this.props;
        const { startDate, state, city , category}= this.state;
        return(
            <div>
               <NewNavbar  isAuthenticated={isAuthenticated}
              user={user}
              logOutUser={() => logOut()} />
                <div className={classes.main} style={{ marginBottom: 30}}>
                    <div className={classes.sectionTestimonials}>
                        {loading &&
                        <LinearProgress />
                        }
                        <div className={classes.container} style={{marginTop: 60}} >
                            <div className="location-gal">
                                <GridContainer>
                                <GridItem xs={12} sm={12} md={3}>
                                    {/* <FormControl fullWidth className={classes.selectFormControl}> */}
                                        <ReactSelect
                                            options={categoriesArray}
                                            onChange={(e) => this.setState({ category: e.id})}
                                            placeholder="Ad type"
                                            outlined={false}
                                        />
                                    {/* </FormControl> */}
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4}>
                                    {/* <FormControl fullWidth className={classes.selectFormControl}> */}
                                        <ReactSelect
                                            options={statesArray.concat(countryArray).sort()}
                                            onChange={(e) => this.handleStateChange(e.id, statesArray, countryArray)}
                                            placeholder="State or City..."
                                            outlined={false}
                                            isLoading={loading}
                                        />
                                    {/* </FormControl> */}
                                </GridItem>

                                <GridItem xs={12} sm={12} md={3}>
                                    {/* <FormControl> */}
                                        <Datetime
                                            timeFormat={false}
                                            isValidDate={ valid }
                                            value={startDate}
                                            inputProps={{
                                                placeholder: "Start Date",
                                            }}
                                            //onChange={(e) => startDateChange(e)}
                                        />
                                    {/* </FormControl> */}
                                </GridItem>
                                <GridItem xs={12} sm={12} md={2}>
                                    <a href={`/locations?state=${state || ''}&city=${city}&category=${category}`}>
                                        {/* <Button color="primary" justIcon round>
                                            <Search />
                                        </Button> */}

                                        <div
                                            // color="info"
                                            className="hover-btn"
                                            style={{
                                            justifyContent: 'center'
                                            }}
                                        >
                                            Search
                                        </div>
                                    </a>
                                    {/*<Link to={`/locations?state=${state || ''}&city=${city}&category=${category}`}>
                                    </Link>*/}
                                </GridItem>
                            </GridContainer>
                            </div>
                            <GridContainer>
                                <GridItem md={8} className={classNames(classes.mlAuto, classes.mrAuto)}>
                                    <h4 className={classes.title}>Available Ad spaces.</h4>
                                    <h6 className={classes.subtitle}>
                                        {`${locationsArray.length || 0} ad space(s) ${query.state ? ' in ' + query.state + ' state' : ''}
                                        ${query.city ? ', ' + query.city + ' city ' : ''} ${query.category ? ' , of ' + query.category + ' Type' : ''}`}
                                    </h6>
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                {this.renderAdSpaces()}
                            </GridContainer>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = ({ locations, login, home }) => {
    const { loading, error, messages, locationsArray, query } = locations;
    const { isAuthenticated, user} = login;
    const { statesArray, tagsArray, categoriesArray, countryArray } = home;
    return { loading, error, messages, locationsArray, countryArray, query , isAuthenticated, user, statesArray, tagsArray,
        categoriesArray} ;
};


export default connect(mapStateToProps, {
    getLocations, logOut, setAuthenticated, getTagsStatesCitiesCategories, getLocationsByCompanyUsername
})(withStyles(blogPostPageStyle)(LocationsByCompany));
