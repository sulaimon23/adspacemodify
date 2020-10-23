import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../components/Header/Header";
import HeaderLinks from "../../components/Header/HeaderLinks";
import { logOut, setAuthenticated } from "../../actions";
import { getAuth } from "../../firebase";
import contactsStyle from "../../assets/jss/material-kit-pro-react/views/sectionsSections/contactsStyle.js";
import { withStyles } from "@material-ui/core";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import InfoArea from "../../components/InfoArea/InfoArea";
import { Check, Email, Phone, PinDrop } from "@material-ui/icons";
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardFooter from "../../components/Card/CardFooter";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "../../components/CustomButtons/Button";
import city from "../../assets/img/dg1.jpg";
import { sendEmail } from "../../actions";
import { Redirect } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./Contactus.scss";

class ContactUs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      firstname: "",
      lastname: "",
      message: "",
      robot: false,
      phone: "",
      errorMessage: "",
      companyName: '',
      twitter: '',
      instagram: ''
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

  handleSendMessage() {
    const { firstname, lastname, email, message, robot, phone, twitter, companyName, instagram } = this.state;

    if (robot) this.props.sendEmail(firstname, lastname, email, message, phone, twitter, companyName, instagram);
    else
      this.setState({
        errorMessage:
            "PLEASE CLICK THE ROBOT CHECK BOX, TO VERIFY YOU ARE NOT A ROBOT",
      });
  }

  render() {
    const {
      classes,
      loading,
      isAuthenticated,
      user,
      logOut,
      success,
      error,
    } = this.props;
    const {
      firstname,
      lastname,
      email,
      message,
      robot,
      phone,
      errorMessage,
      twitter,
      instagram,
      companyName
    } = this.state;

    if (success) {
      return <Redirect to="/" />;
    }

    return (
        <div style={{ height: "100%" }}>
          <Header
              brand="ADSPACE"
              links={
                <HeaderLinks
                    dropdownHoverColor="rose"
                    isAuthenticated={isAuthenticated}
                    user={user}
                    logOutUser={() => logOut()}
                />
              }
              color="transparent"
              changeColorOnScroll={{
                height: 300,
                color: "info",
              }}
          />
          <div className="cd-section">
            <div
                // className=""
                className={classes.contacts + " " + classes.section}
                style={{height: '100%'}}
                style={{ backgroundImage: `url(${city})` }}
            >
              <div className={classes.container}>
                <GridContainer>
                  <GridItem xs={12} sm={5} md={5}>
                    <h2 className={classes.title}>Get in Touch</h2>
                    <h5 className={classes.description}>
                      You need more information? Check what other persons are
                      saying about our product. They are very happy with their
                      purchase.
                    </h5>
                    <InfoArea
                        className={classes.infoArea}
                        title="AdspaceMedia Limited"
                         description={
                           <span>

                           </span>
                         }
                         icon={PinDrop}
                    />
                    <InfoArea
                        className={classes.infoArea}
                        title="Lagos"
                        description={
                          <span>
                          28 Silverbird Road, ilasan jakande, Lekki
                        </span>
                        }
                        icon={PinDrop}
                    />
                    <InfoArea
                        className={classes.infoArea}
                        title="Abuja"
                        description={
                          <span>
                          N0 23B, ALFAYYUM STREET .OFF ASWAN STREET .ZONE 3 WUSE
                        </span>
                        }
                        icon={PinDrop}
                    />
                    <InfoArea
                        className={classes.infoArea}
                        title="UK"
                        description={
                          <span>
                          9 Aintree Grove, upminster RM14 2NU London
                        </span>
                        }
                        icon={PinDrop}
                    />
                    <InfoArea
                        className={classes.infoArea}
                        title="Malaysia"
                        description={
                          <span>
                          C2-5-1 Publika, Jalan Dutamas, 50420, Kuala Lumpur.
                        </span>
                        }
                        icon={PinDrop}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={5} md={6} className={classes.mlAuto}>
                    <Card className={classes.card1}>
                      <form>
                        <CardBody>
                          <h3
                              style={{
                                margin: "auto",
                                textAlign: "center",
                                paddingTop: "2rem",
                                fontWeight: "bold",
                              }}
                          >
                            Contact Us
                          </h3>
                          <br />
                          <GridContainer>
                            <GridItem xs={12} sm={6} md={6}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  labelText="First Name"
                                  id="first"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  value={firstname}
                                  inputProps={{
                                    type: "firstname",
                                    onChange: (e) => {
                                      this.setState({
                                        firstname: e.target.value,
                                        errorMessage: "",
                                      });
                                    },
                                    placeholder: "First name...",
                                  }}
                              />
                              {/* <CustomInput
                                labelText="First Name"
                                id="first"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                value={firstname}
                                inputProps={{
                                  type: "firstname",
                                  onChange: (e) => {
                                    this.setState({
                                      firstname: e.target.value,
                                      errorMessage: "",
                                    });
                                  },
                                  placeholder: "First name...",
                                }}
                              /> */}
                            </GridItem>
                            <GridItem xs={12} sm={6} md={6}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  labelText="Last Name"
                                  id="last"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  value={lastname}
                                  inputProps={{
                                    type: "lastname",
                                    onChange: (e) => {
                                      this.setState({
                                        lastname: e.target.value,
                                        errorMessage: "",
                                      });
                                    },
                                    placeholder: "Last name...",
                                  }}
                              />
                            </GridItem>
                          </GridContainer>
                          <GridContainer>
                            <GridItem xs={12} sm={6} md={6}>
                              <TextField
                                  style={{ paddingTop: "1.3rem" }}
                                  variant="outlined"
                                  size="small"
                                  labelText="Email Address"
                                  id="email-address"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  value={email}
                                  inputProps={{
                                    type: "email",
                                    onChange: (e) => {
                                      this.setState({
                                        email: e.target.value,
                                        errorMessage: "",
                                      });
                                    },
                                    placeholder: "Email...",
                                  }}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={6} md={6}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  style={{ paddingTop: "1.3rem" }}
                                  labelText="Phone Number"
                                  id="phone"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  value={phone}
                                  inputProps={{
                                    type: "tel",
                                    onChange: (e) => {
                                      this.setState({
                                        phone: e.target.value,
                                        errorMessage: "",
                                      });
                                    },
                                    placeholder: "Phone...",
                                  }}
                              />
                            </GridItem>
                          </GridContainer>
                          <GridContainer>
                            <GridItem xs={12} sm={6} md={6}>
                              <TextField
                                  style={{ paddingTop: "1.3rem" }}
                                  variant="outlined"
                                  size="small"
                                  labelText="twitter"
                                  id="twitter"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  value={twitter}
                                  inputProps={{
                                    type: "text",
                                    onChange: (e) => {
                                      this.setState({
                                        twitter: e.target.value,
                                        errorMessage: "",
                                      });
                                    },
                                    placeholder: "Twitter...",
                                  }}
                              />
                            </GridItem>
                            <GridItem xs={12} sm={6} md={6}>
                              <TextField
                                  style={{ paddingTop: "1.3rem" }}
                                  variant="outlined"
                                  size="small"
                                  labelText="instagram"
                                  id="twitter"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  value={instagram}
                                  inputProps={{
                                    type: "text",
                                    onChange: (e) => {
                                      this.setState({
                                        instagram: e.target.value,
                                        errorMessage: "",
                                      });
                                    },
                                    placeholder: "Instagram...",
                                  }}
                              />
                            </GridItem>
                          </GridContainer>
                          <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                              <TextField
                                  variant="outlined"
                                  style={{ paddingTop: "1.3rem", width: "100%" }}
                                  labelText="Company Name"
                                  id="companyName"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  value={companyName}
                                  inputProps={{
                                    onChange: (e) => {
                                      this.setState({
                                        companyName: e.target.value,
                                        errorMessage: "",
                                      });
                                    },
                                    placeholder: "Company Name  (optional)...",
                                  }}
                              />
                            </GridItem>
                          </GridContainer>
                          <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                              <TextField
                                  variant="outlined"
                                  style={{ paddingTop: "1.3rem", width: "100%" }}
                                  labelText="Your Message"
                                  id="message"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                  value={message}
                                  inputProps={{
                                    multiline: true,
                                    rows: 5,
                                    onChange: (e) => {
                                      this.setState({
                                        message: e.target.value,
                                        errorMessage: "",
                                      });
                                    },
                                    placeholder: "Message...",
                                  }}
                              />
                            </GridItem>
                          </GridContainer>
                        </CardBody>
                        {loading && (
                            <div className={classes.textCenter}>
                              <CircularProgress />
                            </div>
                        )}
                        {errorMessage && errorMessage.length > 0 && (
                            <div className={classes.textCenter}>
                              <p style={{ color: "#ef5350", fontWeight: "bold" }}>
                                {errorMessage || ""}
                              </p>
                            </div>
                        )}
                        <CardFooter className={classes.justifyContentBetween}>
                          <FormControlLabel
                              control={
                                <Checkbox
                                    tabIndex={-1}
                                    value={robot}
                                    onClick={() =>
                                        this.setState({
                                          robot: !robot,
                                          errorMessage: "",
                                        })
                                    }
                                    checkedIcon={
                                      <Check className={classes.checkedIcon} />
                                    }
                                    icon={<Check className={classes.uncheckedIcon} />}
                                    classes={{
                                      checked: classes.checked,
                                      root: classes.checkRoot,
                                    }}
                                />
                              }
                              classes={{ label: classes.label }}
                              label="I'm not a robot"
                          />
                          <Button
                              // color="primary"
                              // size="lg"
                              className={classes.pullRight}
                              style={{ width: "50%", backgroundColor: "#3a75bc" }}
                              onClick={() => this.handleSendMessage()}
                          >
                            Send Message
                          </Button>
                        </CardFooter>
                      </form>
                    </Card>
                  </GridItem>
                </GridContainer>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

const mapStateToProps = ({ contactus, login }) => {
  const { loading, error, message, success } = contactus;
  const { isAuthenticated, user } = login;
  return { loading, error, message, success };
};

export default connect(
    mapStateToProps,
    {
      logOut,
      setAuthenticated,
      sendEmail,
    }
)(withStyles(contactsStyle)(ContactUs));
