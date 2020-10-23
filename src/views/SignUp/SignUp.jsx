import React, { Component } from "react";
import { connect } from "react-redux";
import "./Signup.scss"

// import signupPageStyle from "../../assets/jss/material-kit-pro-react/views/signupPageStyle.js";
import { withStyles } from "@material-ui/core";
// import HeaderLinks from "../../components/Header/HeaderLinks";
// import Header from "../../components/Header/Header";
// import image from "../../assets/img/dg1.jpg";
import {
  logOut,
  setAuthenticated,
  displaySignUpMessage,
  signUpUser,
  loginUser,
} from "../../actions";
import { getAuth } from "../../firebase";
// import GridContainer from "../../components/Grid/GridContainer";
// import GridItem from "../../components/Grid/GridItem";
// import Card from "../../components/Card/Card";
// import CardBody from "../../components/Card/CardBody";
// import CustomInput from "../../components/CustomInput/CustomInput";
import InputAdornment from "@material-ui/core/InputAdornment";
// import Button from "../../components/CustomButtons/Button";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";
import { Email, Face, Phone, Business, Check } from "@material-ui/icons";
import { Link } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

// import OwlCarousel from 'react-owl-carousel';
// import 'owl.carousel/dist/assets/owl.carousel.css';
// import 'owl.carousel/dist/assets/owl.theme.default.css';

// import MyItems from "../Home/Item";
import {formatCurrency, numberWithCommas} from "../../utils";
import Redirect from "react-router-dom/es/Redirect";

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      phoneNumber: "",
      subscribe: false,
      responsive: {
        0: {
          items: 1,
        },
        450: {
          items: 1,
        },
        600: {
          items: 1,
        },
        1000: {
          items: 1,
        },
      },
      nav : false
    };
  }

  componentDidMount() {
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

  /*componentDidUpdate(prevProps){
        if (this.props.success !== prevProps.success){
            const { email, password } = this.props;
            this.props.loginUser(email, password);
        }
    }*/

  handleSignUp() {
    const {
      email,
      fullName,
      password,
      confirmPassword,
      companyName,
      phoneNumber,
      subscribe,
    } = this.state;
    const { displaySignUpMessage, signUpUser } = this.props;

    if (!this.verifyEmail(email))
      displaySignUpMessage("PLEASE PROVIDE A VALID EMAIL");
    else if (fullName === "") displaySignUpMessage("PLEASE PROVIDE A NAME");
    else if (phoneNumber === "")
      displaySignUpMessage("PLEASE PROVIDE A PHONE NUMBER");
    else if (password === "") displaySignUpMessage("PLEASE PROVIDE A PASSWORD");
    else if (confirmPassword === "" || password !== confirmPassword)
      displaySignUpMessage("PASSWORD MISMATCH");
    else {
      signUpUser(
        email,
        fullName,
        companyName,
        phoneNumber,
        password,
        subscribe
      );
    }
  }

  verifyEmail(value) {
    let emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRex.test(value);
  }

  render() {
    const {
      loading,
      message,
      classes,
      isAuthenticated,
      user,
      logOut,
      error,
      success,
    } = this.props;
    const {
      email,
      fullName,
      password,
      confirmPassword,
      companyName,
      phoneNumber,
      subscribe,
    } = this.state;


    if (success) {
      return <Redirect to="/" />;
    }


    return (
      <div>
        {/* <Header
          absolute
          color="transparent"
          brand="AD SPACE"
          links={
            <HeaderLinks
              dropdownHoverColor="info"
              isAuthenticated={isAuthenticated}
              user={user}
              logOutUser={() => logOut()}
            />
          }
        /> */}
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
        >
                        <form className={classes.form}>
                          <TextField
                            style={{
                              paddingBottom: "1rem",
                              width: "100%",
                            }}
                            variant="outlined"
                            label="Email"
                            size="small"
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                            }}
                            value={email}
                            inputProps={{
                              type: "email",
                              onChange: (e) => {
                                this.setState({ email: e.target.value });
                              },
                              startAdornment: (
                                <InputAdornment
                                  position="start"
                                  className={classes.inputAdornment}
                                >
                                  <Email
                                    className={classes.inputAdornmentIcon}
                                  />
                                </InputAdornment>
                              ),
                              placeholder: "Email...",
                            }}
                          />
                          <TextField
                            style={{
                              paddingBottom: "1rem",
                              width: "100%",
                            }}
                            variant="outlined"
                            label="Full Name"
                            size="small"
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                            }}
                            value={fullName}
                            inputProps={{
                              type: "text",
                              onChange: (e) => {
                                this.setState({ fullName: e.target.value });
                              },
                              startAdornment: (
                                <InputAdornment
                                  position="start"
                                  className={classes.inputAdornment}
                                >
                                  <Face
                                    className={classes.inputAdornmentIcon}
                                  />
                                </InputAdornment>
                              ),
                              placeholder: "Full Name...",
                            }}
                          />
                          <TextField
                            style={{
                              paddingBottom: "1rem",
                              width: "100%",
                            }}
                            variant="outlined"
                            label="Company Name"
                            size="small"
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                            }}
                            value={companyName}
                            id="companyName"
                            inputProps={{
                              type: "text",
                              onChange: (e) => {
                                this.setState({ companyName: e.target.value });
                              },
                              startAdornment: (
                                <InputAdornment
                                  position="start"
                                  className={classes.inputAdornment}
                                >
                                  <Business
                                    className={classes.inputAdornmentIcon}
                                  />
                                </InputAdornment>
                              ),
                              placeholder: "Company Name... (optional)",
                            }}
                          />
                          <TextField
                            style={{
                              paddingBottom: "1rem",
                              width: "100%",
                            }}
                            variant="outlined"
                            label="Phone Number"
                            size="small"
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                            }}
                            value={phoneNumber}
                            inputProps={{
                              type: "tel",
                              onChange: (e) => {
                                this.setState({ phoneNumber: e.target.value });
                              },
                              startAdornment: (
                                <InputAdornment
                                  position="start"
                                  className={classes.inputAdornment}
                                >
                                  <Phone
                                    className={classes.inputAdornmentIcon}
                                  />
                                </InputAdornment>
                              ),
                              placeholder: "Phone Number... (required)",
                            }}
                          />

                          <TextField
                            style={{
                              paddingBottom: "1rem",
                              width: "100%",
                            }}
                            variant="outlined"
                            label="Password"
                            size="small"
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                            }}
                            value={password}
                            inputProps={{
                              onChange: (e) => {
                                this.setState({ password: e.target.value });
                              },
                              type: "password",
                              startAdornment: (
                                <InputAdornment
                                  position="start"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.inputAdornmentIcon}>
                                    lock_outline
                                  </Icon>
                                </InputAdornment>
                              ),
                              placeholder: "Password...",
                            }}
                          />
                          <TextField
                            style={{
                              paddingBottom: "1rem",
                              width: "100%",
                            }}
                            variant="outlined"
                            label="Confirm Password"
                            size="small"
                            formControlProps={{
                              fullWidth: true,
                              className: classes.customFormControlClasses,
                            }}
                            value={confirmPassword}
                            inputProps={{
                              onChange: (e) => {
                                this.setState({
                                  confirmPassword: e.target.value,
                                });
                              },
                              type: "password",
                              startAdornment: (
                                <InputAdornment
                                  position="start"
                                  className={classes.inputAdornment}
                                >
                                  <Icon className={classes.inputAdornmentIcon}>
                                    lock_outline
                                  </Icon>
                                </InputAdornment>
                              ),
                              placeholder: "Confirm Password...",
                            }}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                tabIndex={-1}
                                onClick={() =>
                                  this.setState({ subscribe: !subscribe })
                                }
                                checkedIcon={
                                  <Check className={classes.checkedIcon} />
                                }
                                icon={
                                  <Check className={classes.uncheckedIcon} />
                                }
                                classes={{
                                  checked: classes.checked,
                                  root: classes.checkRoot,
                                }}
                              />
                            }
                            classes={{
                              label: classes.label,
                              root: classes.labelRoot,
                            }}
                            label="Subscribe to receive updates and new blog posts in email?"
                          />
                          <h6 className={classes.successMessage}>
                            {`** Get Free ${formatCurrency(1000, 1, 'NGN')} to your AdWallet when you sign up **`}
                          </h6>
                          {loading && (
                            <div className={classes.textCenter}>
                              <CircularProgress />
                            </div>
                          )}
                          {error && (
                            <h6 className={classes.errorMessage}>
                              {message || ""}
                            </h6>
                          )}
                          {success && (
                            <h6 className={classes.successMessage}>
                              {message || ""}
                            </h6>
                          )}
                          <div className={classes.textCenter}>
                            <button
                              // round
                              style={{
                                width: "100%",
                                backgroundColor: "#3a75bc",
                              }}
                              // color="primary"
                              onClick={() => this.handleSignUp()}
                            >
                              SIGN UP
                            </button>
                          </div>
                          <div
                            className={classes.textCenter}
                            style={{ paddingTop: 10, paddingBottom: 10 }}
                          >
                            <p>
                              Already have an account?{" "}
                              <Link to={`/login`} style={{ color: "#3a75bc" }}>
                                Sign In
                              </Link>
                            </p>
                          </div>
                        </form>
        </div>
        <br />
      </div>
    );
  }
}

const mapStateToProps = ({ signup, login }) => {
  const { loading, error, message, success, email, password } = signup;
  const { isAuthenticated } = login;
  return { loading, error, message, isAuthenticated, success, email, password };
};

export default connect(
  mapStateToProps,
  {
    logOut,
    setAuthenticated,
    displaySignUpMessage,
    signUpUser,
    loginUser,
  }
)(withStyles(signupPageStyle)(SignUp));
