import {
  container,
  mlAuto,
  section,
  main,
  mainRaised,
  title,
  cardTitle,
  grayColor,
  roseColor,
    successColor
} from "../../../../assets/jss/material-kit-pro-react.js";

import modalStyle from "../../../../assets/jss/material-kit-pro-react/modalStyle.js";
import tooltipsStyle from "../../../../assets/jss/material-kit-pro-react/tooltipsStyle.js";
import imagesStyles from "../../../../assets/jss/material-kit-pro-react/imagesStyles.js";
import customSelectStyle from "../../../../assets/jss/material-kit-pro-react/customSelectStyle.js";
import {blackColor, hexToRgb, primaryColor, whiteColor} from "../../../../assets/jss/material-kit-pro-react";
import hoverCardStyle from "../hoverCardStyle";

const productStyle = theme => ({
  mlAuto,
  ...hoverCardStyle,
  main,
  ...imagesStyles,
  ...customSelectStyle,
  ...tooltipsStyle,
  ...modalStyle(theme),
  container: {
    ...container,
    zIndex: 2
  },
  mainRaised: {
    ...mainRaised
  },
  cardCategory: {
    marginBottom: "0",
    marginTop: "10px",
    "& svg,& .fab,& .fas,& .far,& .fal,& .material-icons": {
      position: "relative",
      top: "8px",
      lineHeight: "0"
    }
  },
  section: {
    ...section,
    padding: "70px 0px"
  },
  title: {
    ...title,
    marginBottom: 0
  },
  sectionGray: {
    background: grayColor[14]
  },
  mainPrice: {
    margin: "10px 0px 25px",
    color: successColor[1]
  },
  textCenter: {
    textAlign: "center!important"
  },
  features: {
    paddingTop: "30px"
  },
  productPage: {
    backgroundColor: grayColor[2],
    "& $mainRaised": {
      margin: "-40vh 0 0",
      padding: "40px"
    },
    "& .image-gallery-slide img": {
      borderRadius: "3px",
      maxWidth: "300px",
      height: "auto"
    },
    "& .image-gallery-swipe": {
      margin: "30px 0px",
      overflow: "hidden",
      width: "100%",
      height: "auto",
      textAlign: "center"
    },
    "& .image-gallery-thumbnails > .image-gallery-thumbnails-container a": {
      "&.active > div": {
        opacity: "1",
        borderColor: grayColor[6]
      },
      "& > div": {
        width: "80%",
        maxWidth: "85px",
        margin: "0 auto",
        padding: "8px",
        display: "block",
        border: "1px solid transparent",
        background: "transparent",
        borderRadius: "3px",
        opacity: ".8"
      },
      "& > div img": {
        borderRadius: "3px",
        width: "100%",
        height: "auto",
        textAlign: "center"
      }
    }
  },
  titleRow: {
    marginTop: "-8vh"
  },
  floatRight: {
    float: "right!important"
  },
  pageHeader: {
    minHeight: "70vh",
    maxHeight: "700px",
    height: "auto",
    backgroundPosition: "center center"
  },
  relatedProducts: {
    marginTop: "50px",
    "& $title": {
      marginBottom: "80px"
    }
  },
  pickSize: {
    marginTop: "50px"
  },
  pullRight: {
    float: "right"
  },
  pullLeft: {
    float: "left"
  },
  cardTitle: {
    ...cardTitle,
    textAlign: "center"
  },
  cardDescription: {
    textAlign: "center",
    color: grayColor[0]
  },
  textRose: {
    color: roseColor[0]
  },
  justifyContentBetween: {
    justifyContent: "space-between!important"
  },
  socialFeed: {
    "& p": {
      display: "table-cell",
      verticalAlign: "top",
      overflow: "hidden",
      paddingBottom: "10px",
      maxWidth: 300
    },
    "& i": {
      fontSize: "20px",
      display: "table-cell",
      paddingRight: "10px"
    }
  },
  cardTitleAbsolute: {
    ...cardTitle,
    position: "absolute !important",
    bottom: "15px !important",
    left: "15px !important",
    color: whiteColor + " !important",
    fontSize: "1.125rem !important",
    textShadow: "0 2px 5px rgba(" + hexToRgb(grayColor[9]) + ", 0.5) !important"
  },
  cardProductDescription: {
    textAlign: "center",
    color: grayColor[0]
  },
  price: {
    color: successColor[1],
    "& h4": {
      marginBottom: "0px",
      marginTop: "0px",
      fontWeight: "bold"
    }
  },
  img: {
    width: "20%",
    marginRight: "5%",
    marginBottom: "5%",
    float: "left"
  },
  block: {
    color: "inherit",
    padding: "0.9375rem",
    fontWeight: "500",
    fontSize: "12px",
    textTransform: "uppercase",
    borderRadius: "3px",
    textDecoration: "none",
    position: "relative",
    display: "block"
  },
  inlineBlock: {
    display: "inline-block",
    padding: "0px",
    width: "auto"
  },
  list: {
    marginBottom: "0",
    padding: "0",
    marginTop: "0"
  },
  left: {
    float: "left!important",
    display: "block"
  },
  right: {
    padding: "15px 0",
    margin: "0",
    float: "right"
  },
  icon: {
    top: "3px",
    width: "18px",
    height: "18px",
    position: "relative"
  },
    margin: "0",
    bigMap: {
        height: "90vh",
        maxHeight: "550px",
        width: "100%",
        display: "block"
    },
  checkboxAndRadio: {
    position: "relative",
    display: "block",
    marginTop: "10px",
    marginBottom: "10px"
  },
  checkboxAndRadioHorizontal: {
    position: "relative",
    display: "block",
    "&:first-child": {
      marginTop: "10px"
    },
    "&:not(:first-child)": {
      marginTop: "-14px"
    },
    marginTop: "0",
    marginBottom: "0"
  },
  checked: {
    color: primaryColor[0] + "!important"
  },
  checkedIcon: {
    width: "20px",
    height: "20px",
    border: "1px solid rgba(" + hexToRgb(blackColor) + ", 0.84)",
    borderRadius: "3px"
  },
  uncheckedIcon: {
    width: "0px",
    height: "0px",
    padding: "9px",
    border: "1px solid rgba(" + hexToRgb(blackColor) + ", .54)",
    borderRadius: "3px"
  },
});

export default productStyle;
