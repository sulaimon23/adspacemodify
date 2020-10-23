import {
  section,
  container,
  cardTitle,
  coloredShadow,
  mlAuto,
  mrAuto,
    main,
    mainRaised,
  grayColor
} from "../../../../../assets/jss/material-kit-pro-react.js";

import customCheckboxRadioSwitch from "../../../../../assets/jss/material-kit-pro-react/customCheckboxRadioSwitchStyle.js";

import tooltipsStyle from "../../../../../assets/jss/material-kit-pro-react/tooltipsStyle.js";
import popoverStyles from "../../../../../assets/jss/material-kit-pro-react/popoverStyles.js";
import {
  blackColor,
  dangerColor,
  hexToRgb, primaryBoxShadow, primaryColor,
  successColor,
  whiteColor
} from "../../../../../assets/jss/material-kit-pro-react";
import modalStyle from "../../modalStyle";

const styles = theme => ({
  ...customCheckboxRadioSwitch,
  ...tooltipsStyle,
  ...popoverStyles,
  ...modalStyle(theme),
  main,
  mainRaised,
  checkRoot: {
    padding: "14px",
    "&:hover": {
      backgroundColor: "unset"
    }
  },
  coloredShadow,
  mlAuto,
  mrAuto,
  cardTitle: {
    ...cardTitle,
    textAlign: "center",
    marginBottom: "0px !important"
  },
  cardDescription: {
    color: grayColor[0],
    textAlign: "center"
  },
  container: {
    ...container
  },
  description: {
    color: grayColor[0]
  },
  section: {
    ...section,
    padding: "70px 0px"
  },
  priceContainer: {
    display: "inline-flex"
  },
  price: {
    fontSize: "18px",
    color: successColor[1]
  },
  priceOld: {
    fontSize: "16px",
    color: dangerColor[1],
    textDecoration: "line-through"
  },
  priceNew: {
    color: successColor[1]
  },
  pullRight: {
    float: "right"
  },
  buttonGroup: {
    position: "relative",
    margin: "10px 1px",
    display: "inline-block",
    verticalAlign: "middle"
  },
  firstButton: {
    borderTopRightRadius: "0",
    borderBottomRightRadius: "0",
    margin: "0",
    position: "relative",
    float: "left",
    "&:hover": {
      zIndex: "2"
    }
  },
  lastButton: {
    borderTopLeftRadius: "0",
    borderBottomLeftRadius: "0",
    margin: "0",
    "&:hover": {
      zIndex: "2"
    }
  },
  cardHeaderImage: {
    position: "relative",
    padding: "0",
    zIndex: "1",
    marginLeft: "15px",
    marginRight: "15px",
    marginTop: "-30px",
    borderRadius: "6px",
    "& img": {
      width: "100%",
      borderRadius: "6px",
      pointerEvents: "none"
    },
    "& a": {
      display: "block"
    }
  },
  justifyContentBetween: {
    WebkitBoxPack: "justify!important",
    justifyContent: "space-between !important"
  },
  customExpandPanel: {
    maxHeight: "273px",
    overflowY: "scroll",
    "&  label": {
      display: "block",
    }
  },
  priceSlider: {
    fontWeight: "500"
  },
  refineButton: {
    margin: "-3px 0"
  },
  cardBodyRefine: {
    paddingLeft: "15px",
    paddingRight: "15px"
  },
  textLeft: {
    textAlign: "left"
  },
  imgContainer: {
    width: "100px",
    maxHeight: "140px",
    overflow: "hidden",
    display: "block",
    "& img": {
      width: "100%"
    }
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
      backgroundClip: "padding-box"
    },
    "& $selectPaper $selectMenuItemSelectedMultiple": {
      backgroundColor: "inherit"
    },
    "& > div + div": {
      maxHeight: "266px !important"
    }
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
      backgroundColor: "transparent"
    },
    "&[aria-owns] + input + svg": {
      transform: "rotate(180deg)"
    },
    "& + input + svg": {
      transition: "all 300ms linear"
    }
  },
  selectPaper: {
    boxSizing: "borderBox",
    borderRadius: "4px",
    padding: "0",
    minWidth: "100%",
    display: "block",
    border: "0",
    boxShadow: "0 2px 5px 0 rgba(" + hexToRgb(blackColor) + ", 0.26)",
    backgroundClip: "padding-box",
    margin: "2px 0 0",
    fontSize: "14px",
    textAlign: "left",
    listStyle: "none",
    backgroundColor: "transparent",
    maxHeight: "266px"
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
      ...primaryBoxShadow
    }
  },
  selectMenuItemSelected: {
    backgroundColor: primaryColor[0] + "!important",
    color: whiteColor
  },
  selectFormControl: {
    zIndex: 99999,
    margin: "7px 0 17px 0 !important",
    "& > div": {
      "&:before": {
        borderBottomWidth: "1px !important",
        borderBottomColor: grayColor[4] + "!important"
      },
      "&:after": {
        borderBottomColor: primaryColor[0] + "!important"
      }
    }
  },
});

export default styles;
