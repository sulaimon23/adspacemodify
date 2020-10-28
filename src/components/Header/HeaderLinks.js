/* eslint-disable */
import React, { useState } from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Apps from "@material-ui/icons/Apps";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import ViewDay from "@material-ui/icons/ViewDay";
import Dns from "@material-ui/icons/Dns";
import Build from "@material-ui/icons/Build";
import ListIcon from "@material-ui/icons/List";
import People from "@material-ui/icons/People";
import Assignment from "@material-ui/icons/Assignment";
import MonetizationOn from "@material-ui/icons/MonetizationOn";
import Chat from "@material-ui/icons/Chat";
import Call from "@material-ui/icons/Call";
import Layers from "@material-ui/icons/Layers";
import ShoppingBasket from "@material-ui/icons/ShoppingBasket";
import LineStyle from "@material-ui/icons/LineStyle";
import Error from "@material-ui/icons/Error";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-pro-react/components/headerLinksStyle.js";
import ListItemText from "@material-ui/core/ListItemText";
import { Person } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };
  const dispatch = useDispatch();
  const currency = useSelector((state) => state.paymentType.currency);
  const changeCurrency = (curr) => {
    dispatch({
      type: "CHANGE_CURRENCY",
      payload: curr,
    });
    // window.location.reload();
    // setCurrency(curr);
  };

  let authenticated = false;
  authenticated = !(
    props.isAuthenticated === false ||
    props.isAuthenticated === undefined ||
    props.isAuthenticated === null
  );

  let user = props.user || "";
  let categories = props.categoriesArray || [];

  const smoothScroll = (e, target) => {
    if (window.location.pathname === "/sections") {
      var isMobile = navigator.userAgent.match(
        /(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i
      );
      if (isMobile) {
        // if we are on mobile device the scroll into view will be managed by the browser
      } else {
        e.preventDefault();
        var targetScroll = document.getElementById(target);
        scrollGo(document.documentElement, targetScroll.offsetTop, 1250);
      }
    }
  };
  const scrollGo = (element, to, duration) => {
    var start = element.scrollTop,
      change = to - start,
      currentTime = 0,
      increment = 20;

    var animateScroll = function() {
      currentTime += increment;
      var val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  };
  var onClickSections = {};

  const { dropdownHoverColor } = props;
  const classes = useStyles();
  return (
    <List className={classes.list + " " + classes.mlAuto}>
      <ListItem className={classes.listItem}>
        <div
          style={{
            height: "50px",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <a
              href="https://about.adspace.ng"
              target="_blank"
              className={classes.dropdownLink}
              style={{ fontSize: "0.8rem", display: "flex" }}
          >
            <div
              style={{
                height: "50px",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <strong style={{ fontSize: "1em", marginLeft: 7, width: 'max-content' }}>
                HOW IT WORKS
              </strong>
            </div>
          </a>
        </div>
      </ListItem>
      <ListItem className={classes.listItem}>
        <CustomDropdown
          noLiPadding
          navDropdown
          hoverColor={dropdownHoverColor}
          buttonText="Partner With Us"
          buttonProps={{
            className: classes.navLink,
            color: "transparent",
          }}
          buttonIcon={Apps}
          dropdownList={[
            <Link to="/contactus" className={classes.dropdownLink}>
              {" "}
              Media Owners
            </Link>,
            <Link to="/components" className={classes.dropdownLink}>
              Influencers
            </Link>,
          ]}
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <div
          style={{
            height: "50px",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Link
            to={`/blogs`}
            className={classes.dropdownLink}
            style={{ fontSize: "0.8rem", display: "flex" }}
          >
            <div
              style={{
                height: "50px",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <strong style={{ fontSize: "1em", marginLeft: 7, width: 'max-content' }}>
                BLOG POSTS
              </strong>
            </div>
          </Link>
        </div>
      </ListItem>
      <ListItem className={classes.listItem}>
        <CustomDropdown
          noLiPadding
          navDropdown
          hoverColor={dropdownHoverColor}
          buttonText={`(${currency})`}
          buttonProps={{
            className: classes.navLink,
            color: "transparent",
          }}
          buttonIcon={Apps}
          dropdownList={[
            <div
              onClick={() => changeCurrency("USD")}
              className={classes.dropdownLink}
            >
              {" "}
              USD ($)
            </div>,
            <div
              onClick={() => changeCurrency("GBP")}
              className={classes.dropdownLink}
            >
              Pounds (£)
            </div>,
            <div
              onClick={() => changeCurrency("EUR")}
              className={classes.dropdownLink}
            >
              Euro (€)
            </div>,
            <div
              onClick={() => changeCurrency("MYR")}
              className={classes.dropdownLink}
            >
              Ringgit (RM)
            </div>,
            <div
              onClick={() => changeCurrency("NGN")}
              className={classes.dropdownLink}
            >
              Naira (₦)
            </div>,
          ]}
        />
      </ListItem>
      {authenticated ? (
        <ListItem className={classes.listItem}>
          <CustomDropdown
            noLiPadding
            navDropdown
            hoverColor={dropdownHoverColor}
            buttonText={user.displayName || "ACCOUNT"}
            buttonProps={{
              className: classes.navLink,
              color: "transparent",
            }}
            buttonIcon={Person}
            dropdownList={[
              <Link to="/profile" className={classes.dropdownLink}>
                MY ACCOUNT
              </Link>,
              <Button onClick={props.logOutUser} default block>
                Log out
              </Button>,
            ]}
          />
        </ListItem>
      ) : (
        <ListItem className={classes.listItem}>
          <Link to={`/login`}>
            <div
              // color="info"
              className="other-btn"
              style={{
                justifyContent: "center",
                backgroundColor: "#e62f2d",
                color: "#fff",
              }}
            >
              LOG IN
            </div>
          </Link>
        </ListItem>
      )}
      {!authenticated && (
        <ListItem className={classes.listItem} style={{ paddingLeft: 15 }}>
          <Link to={`/signup`}>
            <div
              className="other-btn"
              style={{
                justifyContent: "center",
                backgroundColor: "#e62f2d",
                color: "#fff",
              }}
            >
              SIGN UP
            </div>
          </Link>
        </ListItem>
      )}

      <ListItem className={classes.listItem} style={{ paddingLeft: 15 }}>
        <Link to={`/mediaplanning`}>
          <div
            className="other-btn"
            style={{
              justifyContent: "center",
              backgroundColor: "#e62f2d",
              color: "#fff",
              width: 'max-content'
            }}
          >
            MEDIA PLANNING
          </div>
        </Link>
      </ListItem>
    </List>
  );
}

HeaderLinks.defaultProps = {
  hoverColor: "primary",
};

HeaderLinks.propTypes = {
  dropdownHoverColor: PropTypes.oneOf([
    "dark",
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose",
  ]),
};
