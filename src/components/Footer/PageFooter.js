import React from "react";
import Footer from "./Footer";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core";
import Menu from "../../components/Menu/Menu";
import Divider from "@material-ui/core/Divider";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Grid from '@material-ui/core/Grid';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import blogPostPageStyle from "../../assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";
import { Link } from "react-router-dom";
import InfoArea from "../../components/InfoArea/InfoArea";
import { Check, Email, Phone, PinDrop } from "@material-ui/icons";

// const listMenu = [
//   {
//     "Contact Us",
//     "Adspace NG, G1-2",
//     "Adspace NG, G1-2",
//     "KLCC",
//     "Jalan Jalan",
//     "50480 Kuala Lumpur, Malaysia",
//     "+60-123456457",

//   }
// ];


const TOPADSPACES = [
  {
    id: "Grlt5iVOy0vhtl9J7K3P",
    name: "Channels Television (6AM - 3PM)",
  },
  {
    id: "cgHlAX8huvY60EUlRjFF",
    name: "Freedom Way Lekki",
  },
  {
    id: "0i7D8IIFSMIMcSrvV0Gu",
    name: "Location 2",
  },
];


const CATEGORYARRAY = [
  {
    id: "billboard",
    name: "Billboard",
  },
  {
    id: "cinema",
    name: "Cinema",
  },
  {
    id: "exhibition",
    name: "Exhibition",
  },
  {
    id: "lamppost",
    name: "Lamppost",
  },
  {
    id: "ledscreen",
    name: "LED Billboard",
  },
  {
    id: "magazine",
    name: "Magazine",
  },
  {
    id: "newspaper",
    name: "Newspaper",
  },
  {
    id: "influencer",
    name: "Influencer",
  },
  {
    id: "radio",
    name: "Radio",
  },
  {
    id: "television",
    name: "Television",
  },
  {
    id: "vehicle",
    name: "Vehicle",
  },
]


const CITIES = [
  {
    id: "victoriaisland",
    name: "Victoria Island",
    state: "lagos",
  },
  {
    id: "abuja",
    name: "Abuja",
    state: "abuja",
  },
  {
    id: "ikeja",
    name: "Ikeja",
    state: "lagos",
  },
  {
    id: "portharcourt",
    name: "Portharcourt",
    state: "portharcourt",
  },
];


const PageFooter = ({ classes }) => {


  const renderTopAdspace =  () => {
    return TOPADSPACES.map((topadspace, index) => {
      return (
        <div key={index}>
          <Link
                style={{ display: "inline-block", width: "100%" }}
                to={{ pathname: `/location/${topadspace.id}` }}
              >
            <p>
              {topadspace.name}
            </p>
          </Link>
        </div>
      )
    })
  }


  const renderCategories = () => {
    return CATEGORYARRAY.map((cat, index) => {
      return (
          <div key={index}>
              <Link style={{ display: "inline-block", width: "100%" }} to={`/locations?category=${cat.id}`}>
                  <p>
                    {cat.name}
                  </p>
              </Link>
          </div>
      );
    });
  }


  const renderCities = () => {
    return CITIES.map((city, index) => {
      return (
          <div key={index}>
              <Link style={{ display: "inline-block", width: "100%" }} 
              to={`/locations?state=${city.state}&city=${city.id}`} >
                  <p>
                    {city.name}
                  </p>
              </Link>
          </div>
      );
    });
  }



  return (
    <Footer
      theme="dark"
      content={
        <div>          
          <h5 className={classes.right} style={{fontSize: '15px'}}>
            Copyright &copy; {1900 + new Date().getYear()}{" "}
            <a href="/" className={classes.aClasses}>
              ADSPACEMEDIA LIMITED
            </a>{" "}
            All Rights Reserved.
          </h5>
        </div>
      }
    >
      <GridContainer>
        <GridItem xs={12} sm={12} md={3}>
        <h5>Top Adspace</h5>
          {renderTopAdspace(classes)}
        </GridItem>

        <GridItem xs={12} sm={12} md={3}>
          <h5>Top Category</h5>
          {renderCategories(classes)}
        </GridItem>

        <GridItem xs={12} sm={12} md={3}>
          <h5>Top Cities</h5>
          {renderCities(classes)}
        </GridItem>

        <GridItem xs={12} sm={12} md={3}>
          <h5>Contact Us</h5>

          <h5>ADSPACEMEDIA LIMITED</h5>
          <div>
            <h6>Lagos</h6>
            <p>
              28 Silverbird Road, ilasan jakande, Lekki
            </p>

            <h6>Abuja</h6>
            <p>
              No 23B, Alfayym Sreet .Off Aswan Street .Zone 3 Wuse
            </p>


            <h6>UK</h6>
            <p>
              9 Aintree Grove, upminster RM14 2NU London
            </p>

            <h6>Malaysia</h6>
            <p>
              C2-5-1 Publika, Jalan Dutamas, 50420, Kuala Lumpur.
            </p>
          </div>
          
          <GridContainer>
            <GridItem
              md={12}
            >
              <a
                style={{ display: "inline-block", padding: 4 }}
                href="https://twitter.com/adspaceapp"
                target="_blank"
              >
                <i className="fab fa-twitter" />
              </a>
              <a
                style={{ display: "inline-block", padding: 4 }}
                href="https://www.instagram.com/adspaceapp"
                target="_blank"
              >
                <i className="fab fa-instagram" />
              </a>
              <a
                style={{ display: "inline-block", padding: 4 }}
                href="https://www.facebook.com/adspaceapp"
                target="_blank"
              >
                <i className="fab fa-facebook-square" />
              </a>
            </GridItem>
          </GridContainer>
        </GridItem>

      </GridContainer>
      <Divider />
    </Footer>
  );
};

export default connect(null)(withStyles(blogPostPageStyle)(PageFooter));