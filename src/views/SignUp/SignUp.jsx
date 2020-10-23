import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./Signup.scss";

import signupPageStyle from "../../assets/jss/material-kit-pro-react/views/signupPageStyle.js";
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
import "bootstrap/dist/css/bootstrap.min.css";

// import OwlCarousel from 'react-owl-carousel';
// import 'owl.carousel/dist/assets/owl.carousel.css';
// import 'owl.carousel/dist/assets/owl.theme.default.css';
import headertext from "../../images/Asset 6.png";
// import MyItems from "../Home/Item";
import { formatCurrency, numberWithCommas } from "../../utils";
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
      nav: false,
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

  handleSignUp(e) {
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
      displaySignUpMessage("please provide a valid mail ");
    else if (fullName === "") displaySignUpMessage("please provide a name");
    else if (phoneNumber === "")
      displaySignUpMessage("please provide a phone number");
    else if (password === "") displaySignUpMessage("please provide a password");
    else if (confirmPassword === "" || password !== confirmPassword)
      displaySignUpMessage("password mismatch");
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
    e.preventDefault();
  }

  <div className=""></div>
  <div id="ball"></div>



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
      <Fragment>
        <div className="login-body">
          <div className="login-wrapper">
            <div className="loginbox">
              <div className="login-left">
                <Link to="/">
                  <img
                    className="img-fluid"
                    src={headertext}
                    alt="Logo"
                    width={250}
                    height={50}
                    style={{ display: "inline" }}
                  />
                </Link>
              </div>
              <div className="login-right">
                <div className="login-right-wrap">
                  <h1 style={{ marginBottom: "30px" }} className="use">
                    <span>
                      <i className="fe fe-user" style={{ color: "blue" }}></i>
                    </span>
                  </h1>
                  <form>
                    <div className="form-grou">
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
                              <Email className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                          ),
                          placeholder: "Email...",
                        }}
                      />
                    </div>
                    <div className="form-grou">
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
                              <Face className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                          ),
                          placeholder: "Full Name...",
                        }}
                      />
                    </div>
                    <div className="form-grou">
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
                    </div>
                    <div className="form-grou">
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
                              <Phone className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                          ),
                          placeholder: "Phone Number... (required)",
                        }}
                      />
                    </div>
                    <div className="form-grou">
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
                    </div>
                    <div className="form-grou">
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
                    </div>
                    {/* <FormControlLabel
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
                          /> */}
                    {/* <h6 className={classes.successMessage}>
                            {`** Get Free ${formatCurrency(1000, 1, 'NGN')} to your AdWallet when you sign up **`}
                          </h6> */}
                    {loading && (
                      <div className={classes.textCenter}>
                        <CircularProgress />
                      </div>
                    )}
                    {error && (
                      <h6 className={classes.errorMessage}>{message || ""}</h6>
                    )}
                    {success && (
                      <h6 className={classes.successMessage}>
                        {message || ""}
                      </h6>
                    )}
                    <div className="form-grou">
                      <button
                        className="btn btn-primary btn-block"
                        type="submit"
                        onClick={() => this.handleSignUp()}
                      >
                        Register
                      </button>
                    </div>
                  </form>
                  {/* /Form */}
                  <div className="login-or">
                    <span className="or-line" />
                    <span className="span-or">or</span>
                  </div>
                  {/* Social Login */}
                  <div className="social-login">
                    <span>Register with</span>
                    <a href="#" className="facebook">
                      <i className="fe fe-facebook" />
                    </a>
                    <a href="#" className="google">
                      <i className="fe fe-google" />
                    </a>
                  </div>
                  {/* /Social Login */}
                  <div className="text-center dont-have">
                    Already have an account? <Link to="/login">Login</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ signup, login }) => {
  const { loading, error, message, success, email, password } = signup;
  const { isAuthenticated } = login;
  return { loading, error, message, isAuthenticated, success, email, password };
};

export default connect(mapStateToProps, {
  logOut,
  setAuthenticated,
  displaySignUpMessage,
  signUpUser,
  loginUser,
})(withStyles(signupPageStyle)(SignUp));
