import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../components/Header/Header";
import HeaderLinks from "../../components/Header/HeaderLinks";
import image from "../../assets/img/dg1.jpg";
import loginPageStyle from "../../assets/jss/material-kit-pro-react/views/loginPageStyle.js";
import { withStyles } from "@material-ui/core";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Card from "../../components/Card/Card";
import Button from "../../components/CustomButtons/Button";
import CardBody from "../../components/Card/CardBody";
import CustomInput from "../../components/CustomInput/CustomInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import headerlogo from "../../assets/images/Asset 6.png";
import Icon from "@material-ui/core/Icon";
import { Link, Redirect } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  displayLoginMessage,
  loginUser,
  setAuthenticated,
  logOut,
  sendVerificationEmail,
  showForgotPassword,
  sendForgotPassword,
} from "../../actions";
import { getAuth } from "../../firebase";
import {
  infoColor,
  successColor,
} from "../../assets/jss/material-kit-pro-react";
import "./login.scss";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
  }

  componentDidMount() {
    getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        if (user.emailVerified === true) {
          let claims = await user.getIdTokenResult();
          console.log(claims);
          this.props.setAuthenticated(
            true,
            user,
            claims
              ? claims.claims
                ? claims.claims.branding || undefined
                : undefined
              : undefined
          );
        }
      } else {
        this.props.setAuthenticated(false, null);
      }
    });
  }

  loginClicked() {
    return (e) => {
      e.preventDefault();
      const { email, password } = this.state;
      const { displayLoginMessage, loginUser } = this.props;
      if (!this.verifyEmail(email))
        displayLoginMessage("PLEASE PROVIDE A VALID EMAIL");
      else if (password === "")
        displayLoginMessage("PLEASE PROVIDE A PASSWORD");
      else loginUser(email, password);
    };
  }

  forgotPasswordClicked() {
    return (e) => {
      e.preventDefault();
      const { email } = this.state;
      const { displayLoginMessage, sendForgotPassword } = this.props;
      if (!this.verifyEmail(email))
        displayLoginMessage("PLEASE PROVIDE A VALID EMAIL");
      else {
        sendForgotPassword(email);
      }
    };
  }

  renderButtons() {
    const { showForgotPass, forgotPasswordEmailSent } = this.props;
    if (showForgotPass && forgotPasswordEmailSent) return null;
    else if (showForgotPass) {
      return (
        <button
          // color="success"
          size="md"
          className="btn btn-primary btn-block"
          onClick={() => this.forgotPasswordClicked()}
        >
          SUBMIT
        </button>
      );
    } else {
      return (
        <button
          className="btn btn-primary btn-block"
          // color="primary"
          size="md"
          onClick={this.loginClicked()}
        >
          LOGIN
        </button>
      );
    }
  }

  verifyEmail(value) {
    let emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRex.test(value);
  }

  render() {
    const {
      classes,
      loading,
      error,
      message,
      isAuthenticated,
      user,
      logOut,
      emailVerified,
      sendVerificationEmail,
      showForgotPassword,
      showForgotPass,
      forgotPasswordEmailSent,
      setAuthenticated,
    } = this.props;
    const { email, password } = this.state;
    const routeTo = this.props.location
      ? this.props.location.state
        ? this.props.location.state.route || ""
        : "/"
      : "/";

    if (isAuthenticated) {
      return <Redirect exact to={{ pathname: "/" }} />;
    }
    return (
      <div className="log">
        <div className="main-wrapper login-body">
          <div className="login-wrapper">
            <div className="container">
              <div className="loginbox">
                <div className="login-left">
                  <Link to="/">
                    <img
                      className="img-fluid"
                      src={headerlogo}
                      alt="Logo"
                      width={250}
                      height={70}
                      style={{ display: "inline" }}
                    />
                  </Link>
                </div>
                <div className="login-right">
                  <div className="login-right-wrap">
                    <h1 style={{ marginBottom: "30px" }} className="use">
                      <span>
                        <i className="fe fe-user"></i>
                      </span>
                    </h1>
                    <form>
                      <div>
                        <TextField
                          style={{
                            paddingBottom: "1rem",
                            width: "100%",
                          }}
                          id="login_email"
                          value={email}
                          formControlProps={{
                            fullWidth: true,
                          }}
                          size="small"
                          startAdornment={
                            <InputAdornment position="start">$</InputAdornment>
                          }
                          inputProps={{
                            onChange: (e) => {
                              this.setState({ email: e.target.value });
                            },
                            autoFocus: true,
                            placeholder: "Email...",
                            type: "email",
                          }}
                          label="Email"
                          variant="outlined"
                        />
                      </div>
                      {!showForgotPass && (
                        <TextField
                          style={{
                            paddingBottom: "1rem",
                            width: "100%",
                          }}
                          size="small"
                          id="login_pass"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          value={password}
                          inputProps={{
                            onChange: (e) => {
                              this.setState({ password: e.target.value });
                            },
                            placeholder: "Password",
                            type: "password",
                            startAdornment: (
                              <InputAdornment position="start">
                                <Icon className={classes.inputIconsColor}>
                                  lock_utline
                                </Icon>
                              </InputAdornment>
                            ),
                            autoComplete: "off",
                          }}
                          variant="outlined"
                          label="Password"
                        />
                      )}
                      {showForgotPass && (
                        <>
                          <h6
                            // className={classes.textCenter}
                            style={{
                              color: forgotPasswordEmailSent
                                ? successColor[0]
                                : infoColor[0],
                            }}
                          >
                            {forgotPasswordEmailSent
                              ? "An Email has been sent to your email inbox."
                              : ""}
                          </h6>
                        </>
                      )}
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
                      <div className={classes.textCenter}>
                        {this.renderButtons()}
                      </div>
                      {!emailVerified && (
                        <div className={classes.textCenter}>
                          <Button
                            round
                            color="success"
                            size="lg"
                            onClick={() => sendVerificationEmail()}
                          >
                            VERIFY
                          </Button>
                        </div>
                      )}
                    </form>
                    {/* /Form */}
                    <div className="text-center forgotpass">
                      {showForgotPass ? (
                        <>
                          <a
                            style={{ color: "#3a75bc", cursor: "pointer" }}
                            onClick={() => showForgotPassword(false)}
                          >
                            Login?{" "}
                          </a>
                        </>
                      ) : (
                        <>
                          <a
                            style={{ cursor: "pointer" }}
                            onClick={() => showForgotPassword(true)}
                          >
                            <p style={{ color: "#3a75bc" }}>Forgot password?</p>
                          </a>
                        </>
                      )}
                    </div>
                    <div className="login-or">
                      <span className="or-line" />
                      <span className="span-or">or</span>
                    </div>
                    {/* Social Login */}
                    <div className="social-login">
                      <span>Login with</span>
                      <a href="#" className="facebook">
                        <i className="fe fe-facebook" />
                      </a>
                      <a href="#" className="google">
                        <i className="fe fe-google" />
                      </a>
                    </div>
                    {/* /Social Login */}
                    <div className="text-center dont-have">
                      Don’t have an account?
                      <Link to="/signup"> Register</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ login }) => {
  const {
    loading,
    error,
    isAuthenticated,
    user,
    message,
    emailVerified,
    showForgotPass,
    forgotPasswordEmailSent,
    branding,
    setAuthenticated,
  } = login;
  console.log(branding);
  return {
    loading,
    error,
    isAuthenticated,
    user,
    message,
    emailVerified,
    showForgotPass,
    forgotPasswordEmailSent,
    branding,
    setAuthenticated,
  };
};

export default connect(
  mapStateToProps,
  {
    displayLoginMessage,
    loginUser,
    setAuthenticated,
    logOut,
    sendVerificationEmail,
    showForgotPassword,
    sendForgotPassword,
  }
)(withStyles(loginPageStyle)(Login));
