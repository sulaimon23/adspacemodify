import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
// import Header from "../../components/Header/Header";
// import HeaderLinks from "../../components/Header/HeaderLinks";
// import image from "../../assets/img/dg1.jpg";
import loginPageStyle from "../../assets/jss/material-kit-pro-react/views/loginPageStyle.js";
import { withStyles } from "@material-ui/core";
// import GridContainer from "../../components/Grid/GridContainer";
// import GridItem from "../../components/Grid/GridItem";
// import Card from "../../components/Card/Card";
// import Button from "../../components/CustomButtons/Button";
// import CardBody from "../../components/Card/CardBody";
// import CustomInput from "../../components/CustomInput/CustomInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import { Email } from "@material-ui/icons";
import Icon from "@material-ui/core/Icon";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, Redirect } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import headerlogo from "../../images/Asset 6.png";
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
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified === true)
          this.props.setAuthenticated(true, user);
      } else {
        this.props.setAuthenticated(false, null);
      }
    });
  }

  loginClicked() {
    const { email, password } = this.state;
    const { displayLoginMessage, loginUser } = this.props;
    if (!this.verifyEmail(email))
      displayLoginMessage("PLEASE PROVIDE A VALID EMAIL");
    else if (password === "") displayLoginMessage("PLEASE PROVIDE A PASSWORD");
    else loginUser(email, password);
  }

  forgotPasswordClicked() {
    const { email } = this.state;
    const { displayLoginMessage, sendForgotPassword } = this.props;
    if (!this.verifyEmail(email))
      displayLoginMessage("PLEASE PROVIDE A VALID EMAIL");
    else {
      sendForgotPassword(email);
    }
  }

  renderButtons() {
    const { showForgotPass, forgotPasswordEmailSent } = this.props;
    if (showForgotPass && forgotPasswordEmailSent) return null;
    else if (showForgotPass) {
      return (
        <button
          // color="success"
          // size="md"
          className="btn btn-primary btn-block"
          onClick={() => this.forgotPasswordClicked()}
        >
          Reset Password{" "}
        </button>
      );
    } else {
      return (
        <button
          className="btn btn-primary btn-block"
          type="submit"
          onClick={() => this.loginClicked()}
        >
          Login{" "}
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
    } = this.props;
    const { email, password } = this.state;
    const routeTo = this.props.location
      ? this.props.location.state
        ? this.props.location.state.route || ""
        : "/"
      : "/";

    if (isAuthenticated === undefined) {
      return <div> </div>;
    }

    if (isAuthenticated) {
      return <Redirect to={routeTo} />;
    }
    return (
      <Fragment>
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
                      style={{
                        display: "inline",
                      }}
                    />{" "}
                  </Link>{" "}
                </div>{" "}
                <div className="login-right">
                  <div className="login-right-wrap">
                    <h1
                      style={{
                        marginBottom: "30px",
                      }}
                      className="use"
                    >
                      <span>
                        <i
                          className="fe fe-user"
                          style={{
                            color: "blue",
                            marginBottom: "20px",
                          }}
                        >
                          {" "}
                        </i>{" "}
                      </span>{" "}
                    </h1>{" "}
                    <form>
                      <TextField
                        style={{
                          paddingBottom: "1rem",
                          width: "100%",
                          marginBottom: "10px",
                        }}
                        id="login_email"
                        value={email}
                        formControlProps={{
                          fullWidth: true,
                        }}
                        size="small"
                        startAdornment={
                          <InputAdornment position="start"> $ </InputAdornment>
                        }
                        inputProps={{
                          onChange: (e) => {
                            this.setState({
                              email: e.target.value,
                            });
                          },
                          autoFocus: true,
                          placeholder: "Email...",
                          type: "email",
                        }}
                        label="Email"
                        variant="outlined"
                      />{" "}
                      {!showForgotPass && (
                        // <CustomInput
                        //   id="login_pass"
                        //   formControlProps={{
                        //     fullWidth: true,
                        //   }}
                        //   value={password}
                        //   inputProps={{
                        //     onChange: (e) => {
                        //       this.setState({ password: e.target.value });
                        //     },
                        //     placeholder: "Password",
                        //     type: "password",
                        //     startAdornment: (
                        //       <InputAdornment position="start">
                        //         <Icon className={classes.inputIconsColor}>
                        //           lock_utline
                        //         </Icon>
                        //       </InputAdornment>
                        //     ),
                        //     autoComplete: "off",
                        //   }}
                        // />
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
                              this.setState({
                                password: e.target.value,
                              });
                            },
                            placeholder: "Password",
                            type: "password",
                            startAdornment: (
                              <InputAdornment position="start">
                                <Icon className={classes.inputIconsColor}>
                                  lock_utline{" "}
                                </Icon>{" "}
                              </InputAdornment>
                            ),
                            autoComplete: "off",
                          }}
                          variant="outlined"
                          label="Password"
                        />
                      )}{" "}
                      {showForgotPass && (
                        <>
                          <br />
                          <h6
                            className={classes.textCenter}
                            style={{
                              color: forgotPasswordEmailSent
                                ? successColor[0]
                                : infoColor[0],
                            }}
                          >
                            {forgotPasswordEmailSent
                              ? "An Email has been sent to your email inbox."
                              : ""}{" "}
                          </h6>{" "}
                        </>
                      )}{" "}
                      {loading && (
                        <div className={classes.textCenter}>
                          <CircularProgress />
                        </div>
                      )}{" "}
                      {error && (
                        <h6 className={classes.errorMessage}>
                          {" "}
                          {message || ""}{" "}
                        </h6>
                      )}{" "}
                      <div className={classes.textCenter}>
                        {" "}
                        {this.renderButtons()}{" "}
                      </div>{" "}
                      {!emailVerified && (
                        <div className={classes.textCenter}>
                          <button
                            round
                            color="success"
                            size="lg"
                            onClick={() => sendVerificationEmail()}
                          >
                            VERIFY{" "}
                          </button>{" "}
                        </div>
                      )}{" "}
                      <div
                        className={classes.textCenter}
                        style={{
                          paddingTop: 10,
                          paddingBottom: 10,
                        }}
                      >
                        <div
                          className={classes.textCenter}
                          style={{
                            paddingTop: 10,
                            paddingBottom: 10,
                          }}
                        >
                          {showForgotPass ? (
                            <></>
                          ) : (
                            <>
                              <div className="text-center forgotpass">
                                <span onClick={() => showForgotPassword(true)}>
                                  {" "}
                                  Forgot Password ?{" "}
                                </span>{" "}
                              </div>{" "}
                              <div className="login-or">
                                <span className="or-line" />
                                <span className="span-or"> or </span>{" "}
                              </div>{" "}
                              {/* Social Login */}{" "}
                              <div className="social-login">
                                <span> Login with </span>{" "}
                                <a href="#" className="facebook">
                                  <i className="fe fe-facebook" />
                                </a>{" "}
                                <a href="#" className="google">
                                  <i className="fe fe-google" />
                                </a>{" "}
                              </div>{" "}
                              {/* /Social Login */}{" "}
                              <div className="text-center dont-have">
                                Don’ t have an account ?{" "}
                                <Link to="/signup"> Register </Link>{" "}
                              </div>{" "}
                            </>
                          )}{" "}
                        </div>{" "}
                      </div>
                    </form>{" "}
                    {/* /Form */}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </Fragment>
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
  } = login;
  return {
    loading,
    error,
    isAuthenticated,
    user,
    message,
    emailVerified,
    showForgotPass,
    forgotPasswordEmailSent,
  };
};

export default connect(mapStateToProps, {
  displayLoginMessage,
  loginUser,
  setAuthenticated,
  logOut,
  sendVerificationEmail,
  showForgotPassword,
  sendForgotPassword,
})(withStyles(loginPageStyle)(Login));
