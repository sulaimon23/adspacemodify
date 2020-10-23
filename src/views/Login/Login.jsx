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
import { Email } from "@material-ui/icons";
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
        <Button
          // color="success"
          size="md" 
          style={{ width: "85%", backgroundColor: "#3a75bc" }}
          onClick={() => this.forgotPasswordClicked()}
        >
          SUBMIT
        </Button>
      );
    } else {
      return (
        <Button
          // color="primary"
          size="md"
          style={{ width: "85%", backgroundColor: "#3a75bc" }}
          onClick={() => this.loginClicked()}
        >
          LOGIN
        </Button>
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
      return <div></div>;
    }

    if (isAuthenticated) {
      return <Redirect to={routeTo} />;
    }
    return (
      <div>
        <Header
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
        />
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
        >
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <Card style={{ maxWidth: "70%", margin: "auto" }}>
                  <form className={classes.form}>
                    {/* <CardHeader
                                            color="primary"
                                            signup
                                            className={classes.cardHeader}
                                        >
                                            <h4 className={classes.cardTitle}>Login</h4>
                                        </CardHeader> */}
                    <CardBody signup>
                      <h3
                        style={{
                          margin: "auto",
                          textAlign: "center",
                          paddingTop: "3rem",
                          fontWeight: "bold",
                        }}
                      >
                        Sign in to your account
                      </h3>
                      <br />
                      {/* <CustomInput
                        id="login_email"
                        value={email}
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (e) => {
                            this.setState({ email: e.target.value });
                          },
                          autoFocus: true,
                          placeholder: "Email...",
                          type: "email",
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email className={classes.inputIconsColor} />
                            </InputAdornment>
                          ),
                        }}
                      /> */}
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
                        // startAdornment={
                        //   <InputAdornment position="start">
                        //     <Email className={classes.inputIconsColor} />
                        //     $
                        //   </InputAdornment>
                        // }
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
                      <br />
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
                              : "Please provide an email"}
                          </h6>
                        </>
                      )}
                      <br />
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
                    </CardBody>
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
                    <div
                      className={classes.textCenter}
                      style={{ paddingTop: 10, paddingBottom: 10 }}
                    >
                      <div
                        className={classes.textCenter}
                        style={{ paddingTop: 10, paddingBottom: 10 }}
                      >
                        {showForgotPass ? (
                          <>
                            <a
                              style={{ color: "#3a75bc", cursor: "pointer" }}
                              onClick={() => showForgotPassword(false)}
                            >
                              Login?{" "}
                            </a>
                            <p>
                              <Link to={`/signup`} style={{ color: "#3a75bc" }}>
                                Sign Up
                              </Link>
                            </p>
                          </>
                        ) : (
                          <>
                            <p>
                              Don't have an account?{" "}
                              <Link to={`/signup`} style={{ color: "#3a75bc" }}>
                                Sign Up
                              </Link>
                            </p>
                            <a
                              style={{ cursor: "pointer" }}
                              onClick={() => showForgotPassword(true)}
                            >
                              <p style={{ color: "#3a75bc" }}>
                                Forgot password?
                              </p>
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
        </div>
        <br />
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
