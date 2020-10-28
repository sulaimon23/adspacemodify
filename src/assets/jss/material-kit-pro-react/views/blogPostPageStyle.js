import {
  container,
  title,
  main,
  whiteColor,
  mainRaised,
  mlAuto,
  mrAuto,
  containerFluid,
  section,
  blackColor,
  cardTitle,
  coloredShadow,
  grayColor,
  hexToRgb,
  primaryBoxShadow,
  primaryColor,
  successColor,
} from "../../../../assets/jss/material-kit-pro-react.js";
import hoverCardStyle from "../hoverCardStyle";
import { defaultFont } from "../../material-kit-pro-react";
import tooltipsStyle from "../tooltipsStyle";

const blogPostPageStyle = (theme) => ({
  ...hoverCardStyle,
  ...tooltipsStyle,
  container: {
    ...container,
    zIndex: "2",
  },
  textCenter: {
    textAlign: "center",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.2rem",
  },
  mainTextHeader: {
    textShadow: "3px 3px 6px black",
    color: "#fff",
    fontWeight: "500",
    fontSize: "0.9rem",
    [theme.breakpoints.up("sm")]: {
      fontSize: "1.6rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "2.2rem",
    },
  },
  title: {
    ...title,
    marginBottom: "2px",
    minHeight: "5px",
  },
  titleWhite: {
    ...title,
    color: whiteColor,
  },
  subtitle: {
    color: blackColor,
  },
  subtitleWhite: {
    color: whiteColor,
  },
  sectionTitle: {
    ...title,
  },
  section: {
    paddingBottom: "0",
    backgroundPosition: "50%",
    backgroundSize: "cover",
    padding: "70px 0",
    "& p": {
      fontSize: "1.188rem",
      lineHeight: "1.5em",
      color: grayColor[15],
      marginBottom: "30px",
    },
  },
  main: {
    ...main,
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
    display: "block",
  },
  inlineBlock: {
    display: "inline-block",
    padding: "0px",
    width: "auto",
  },
  list: {
    marginBottom: "0",
    padding: "0",
    marginTop: "0",
  },
  left: {
    float: "left!important",
    display: "block",
  },
  right: {
    padding: "15px 0",
    margin: "0",
    float: "right",
  },
  icon: {
    width: "18px",
    height: "18px",
    top: "3px",
    position: "relative",
  },
  button: {
    margin: "0 !important",
    paddingTop: "9px",
    paddingBottom: "9px",
    // marginTop: '50px'
  },
  label: {
    cursor: "pointer",
    paddingLeft: "0",
    color: "rgba(" + hexToRgb(blackColor) + ", 0.26)",
    fontSize: "14px",
    lineHeight: "1.428571429",
    fontWeight: "400",
    display: "inline-flex",
  },
  selectMenu: {
    "& > div > ul": {
      border: "0",
      padding: "5px 0",
      margin: "0",
      boxShadow: "none",
      minWidth: "100%",
      borderRadius: "4px",
      boxSizing: "border-box",
      display: "block",
      fontSize: "14px",
      textAlign: "left",
      listStyle: "none",
      backgroundColor: whiteColor,
      backgroundClip: "padding-box",
    },
    "& $selectPaper $selectMenuItemSelectedMultiple": {
      backgroundColor: "inherit",
    },
    "& > div + div": {
      maxHeight: "266px !important",
    },
  },
  select: {
    padding: "12px 0 7px",
    textAlign: "left",
    fontSize: ".75rem",
    fontWeight: "400",
    lineHeight: "1.42857",
    textDecoration: "none",
    textTransform: "uppercase",
    color: grayColor[7],
    letterSpacing: "0",
    "&:focus": {
      backgroundColor: "transparent",
    },
    "&[aria-owns] + input + svg": {
      transform: "rotate(180deg)",
    },
    "& + input + svg": {
      transition: "all 300ms linear",
    },
  },
  selectPaper: {
    boxSizing: "borderBox",
    borderRadius: "4px",
    padding: "0",
    minWidth: "100%",
    display: "block",
    border: "0",
    boxShadow: "0 2px 5px 0 rgba(" + hexToRgb(blackColor) + ", 0.90)",
    backgroundClip: "padding-box",
    margin: "2px 0 0",
    fontSize: "14px",
    textAlign: "left",
    listStyle: "none",
    backgroundColor: "transparent",
    maxHeight: "266px",
  },
  selectMenuItem: {
    fontSize: "13px",
    padding: "10px 20px",
    margin: "0 5px",
    borderRadius: "2px",
    transition: "all 150ms linear",
    display: "block",
    clear: "both",
    fontWeight: "400",
    lineHeight: "2",
    whiteSpace: "nowrap",
    color: grayColor[7],
    paddingRight: "30px",
    "&:hover": {
      backgroundColor: primaryColor[0],
      color: whiteColor,
      ...primaryBoxShadow,
    },
  },
  selectMenuItemSelected: {
    backgroundColor: primaryColor[0] + "!important",
    color: whiteColor,
  },
  selectFormControl: {
    fontSize: "14px",
    fontWeight: '700',
    // zIndex: 99999,
    // margin: "7px 0 17px 0 !important",
    // width: '100px',
    // height: '100px',
    "& > div": {
      "&:before": {
        borderBottomWidth: "1px !important",
        borderBottomColor: grayColor[4] + "!important",
      },
      "&:after": {
        borderBottomColor: primaryColor[0] + "!important",
      },
    },
  },
  selectMenuItemSelectedMultiple: {
    backgroundColor: "transparent !important",
    "&:hover": {
      backgroundColor: primaryColor[0] + "!important",
      color: whiteColor,
      ...primaryBoxShadow,
      "&:after": {
        color: whiteColor,
      },
    },
    "&:after": {
      top: "16px",
      right: "12px",
      width: "12px",
      height: "5px",
      borderLeft: "2px solid currentColor",
      transform: "rotate(-45deg)",
      opacity: "1",
      color: grayColor[7],
      position: "absolute",
      content: "''",
      borderBottom: "2px solid currentColor",
      transition: "opacity 90ms cubic-bezier(0,0,.2,.1)",
    },
  },
  sectionTestimonials: {
    paddingTop: "50px",
    paddingBottom: "10px",
    textAlign: "center",
    "& $cardTitle": {
      marginTop: "0px",
    },
  },
  coloredShadow,
  alignLeft: {
    textAlign: "left",
  },
  cardTitle: {
    ...cardTitle,
    marginTop: 0,
  },
  cardDescription: {
    fontSize: "16px",
    lineHeight: "1.6em",
    color: grayColor[0],
  },
  ourClients: {
    textAlign: "center",
    "& img": {
      width: "100%",
      maxWidth: "140px",
      margin: "0 auto",
      display: "inline-block",
    },
  },
  features1: {
    textAlign: "center",
    // padding: "80px 0",
  },
  mlAuto,
  mrAuto,
  socialFeed: {
    "& p": {
      display: "table-cell",
      verticalAlign: "top",
      overflow: "hidden",
      paddingBottom: "10px",
      maxWidth: 300,
    },
    "& i": {
      fontSize: "20px",
      display: "table-cell",
      paddingRight: "10px",
    },
  },
  photoGallery: {
    padding: "7.5px",
    transition: "all .2s cubic-bezier(0.4,0,0.2,1)",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },
  containerFluid: {
    ...containerFluid,
    ...section,
    padding: "70px 0px",
    paddingBottom: "0px",
    marginBottom: "-35px",
  },
  cardTitleWhite: {
    "&, & a": {
      ...title,
      textAlign: "center",
      //marginTop: "50%",
      //marginBottom: "0",
      minHeight: "auto",
      color: whiteColor + " !important",
    },
  },
  cardTitleAbsolute: {
    ...cardTitle,
    position: "absolute !important",
    bottom: "15px !important",
    left: "15px !important",
    color: whiteColor + " !important",
    fontSize: "1.3rem !important",
    textShadow:
      "0 2px 5px rgba(" + hexToRgb(grayColor[9]) + ", 0.5) !important",
  },
  cardProductDescription: {
    textAlign: "center",
    color: grayColor[0],
    fontSize: "13px",
  },
  price: {
    color: successColor[1],
    "& h4": {
      marginBottom: "0px",
      marginTop: "0px",
      fontWeight: "bold",
    },
  },
  stats: {
    color: grayColor[0],
    fontSize: "12px",
    lineHeight: "22px",
    display: "inline-flex",
    "& svg": {
      position: "relative",
      top: "4px",
      width: "16px",
      height: "16px",
      marginRight: "3px",
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      position: "relative",
      top: "4px",
      fontSize: "16px",
      marginRight: "3px",
    },
  },
  productStats: {
    paddingTop: "7px",
    paddingBottom: "7px",
    margin: "0",
  },
  blogTags: {
    marginTop: "8px",
  },
  labelRoot: {
    ...defaultFont,
    color: grayColor[3] + " !important",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "1.42857",
    top: "10px",
    letterSpacing: "unset",
    "& + $underline": {
      marginTop: "0px",
    },
  },
  input: {
    color: grayColor[14],
    height: "unset",
    "&,&::placeholder": {
      fontSize: "14px",
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: "400",
      lineHeight: "1.42857",
      opacity: "1",
    },
    "&::placeholder": {
      color: grayColor[3],
    },
  },
  formControl: {
    margin: "0 0 17px 0",
    paddingTop: "27px",
    position: "relative",
    verticalAlign: "unset",
    "& svg,& .fab,& .far,& .fal,& .fas,& .material-icons": {
      color: grayColor[14],
    },
  },
  whiteUnderline: {
    "&:hover:not($disabled):before,&:before": {
      backgroundColor: whiteColor,
    },
    "&:after": {
      backgroundColor: whiteColor,
    },
  },
  checkboxAndRadio: {
    position: "relative",
    display: "block",
    marginTop: "10px",
    marginBottom: "10px",
  },
  checkboxAndRadioHorizontal: {
    position: "relative",
    display: "block",
    "&:first-child": {
      marginTop: "10px",
    },
    "&:not(:first-child)": {
      marginTop: "-14px",
    },
    marginTop: "0",
    marginBottom: "0",
  },
  checked: {
    color: primaryColor[0] + "!important",
  },
  checkedIcon: {
    width: "20px",
    height: "20px",
    border: "1px solid rgba(" + hexToRgb(blackColor) + ", 0.84)",
    borderRadius: "3px",
  },
  uncheckedIcon: {
    width: "0px",
    height: "0px",
    padding: "9px",
    border: "1px solid rgba(" + hexToRgb(blackColor) + ", .54)",
    borderRadius: "3px",
  },
  note: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    bottom: "10px",
    color: grayColor[21],
    display: "block",
    fontWeight: "400",
    fontSize: "13px",
    lineHeight: "13px",
    left: "0",
    marginLeft: "20px",
    position: "absolute",
    width: "260px",
  },
  typo: {
    paddingLeft: "25%",
    marginBottom: "40px",
    position: "relative",
    width: "100%",
  },
  pageHeader: {
    position: "relative",
    height: "100vh",
    maxHeight: "1600px",
    backgroundPosition: "50%",
    backgroundSize: "cover",
    margin: "0",
    padding: "0",
    border: "0",
    display: "flex",
    WebkitBoxAlign: "center",
    MsFlexAlign: "center",
    alignItems: "center",
    "&:before": {
      background: "rgba(" + hexToRgb(blackColor) + ", 0.5)",
    },
    "&:after,&:before": {
      position: "absolute",
      zIndex: "1",
      width: "100%",
      height: "100%",
      display: "block",
      left: "0",
      top: "0",
      content: "''",
    },
  },
  conatinerHeader2: {
    ...container,
    zIndex: "2",
    position: "relative",
    "& h1, & h4, & h6": {
      color: whiteColor,
    },
    paddingTop: "25vh",
  },
});

export default blogPostPageStyle;
