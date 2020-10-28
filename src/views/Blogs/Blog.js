import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "underscore";
import {
  setBlogObject,
  getBlog,
  getBlogs,
  setAuthenticated,
} from "../../actions";
import blogPostPageStyle from "../../assets/jss/material-kit-pro-react/views/blogPostPageStyle.js";
import { CircularProgress, withStyles } from "@material-ui/core";
import Header from "../../components/Header/Header";
import HeaderLinks from "../../components/Header/HeaderLinks";
import Parallax from "../../components/Parallax/Parallax";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import { Favorite, FormatAlignLeft } from "@material-ui/icons";
import PlaceHolder from "../../assets/img/bg5.jpg";
import Button from "../../components/CustomButtons/Button";
import SectionText from "../Home/Sections/SectionText";
import SectionBlogInfo from "../Home/Sections/SectionBlogInfo";
import SectionComments from "../Home/Sections/SectionComments";
import moment from "moment";
import Quote from "../../components/Typography/Quote";
import Badge from "../../components/Badge/Badge";
import SectionSimilarStories from "../Home/Sections/SectionSimilarStories";
import Footer from "../../components/Footer/Footer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { getAuth } from "../../firebase";

class Blog extends Component {
  componentDidMount() {
    const { location, match } = this.props;
    if (location && !_.isEmpty(location.blog)) {
      this.props.setBlogObject(location.blog || {});
    } else {
      let id = match.params.id;
      this.props.getBlog(id);
    }

    if (!location.blogsArray || location.blogsArray.length <= 0) {
      this.props.getBlogs();
    }

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

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      let id = prevProps.match.params.id;
      this.props.getBlog(id);
    }
  }

  renderParagraphs(content) {
    return content.map((paragraph, index) => {
      if (paragraph === "") return null;
      return (
        <p key={index}>
          {paragraph || ""}
          <br />
          <br />
        </p>
      );
    });
  }

  renderBlogTags(tags) {
    if (tags && tags.length > 0) {
      return tags.map((tag, index) => {
        return (
          <Badge key={index} color="primary">
            {tag || ""}
          </Badge>
        );
      });
    }
    return null;
  }

  render() {
    const {
      classes,
      loading,
      error,
      message,
      blogObject,
      blogsArray,
      isAuthenticated,
      user,
      logOut,
    } = this.props;
    return (
      <div>
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
          // fixed
          // color="transparent"
          // changeColorOnScroll={{
          //   height: 300,
          //   color: "info",
          // }}
        />
        <Parallax image={blogObject.coverImage || PlaceHolder} filter="dark">
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem md={8} className={classes.textCenter}>
                <h1 className={classes.titleWhite}>{blogObject.title || ""}</h1>
                <h4 className={classes.subtitleWhite}>
                  {blogObject.subtitle || ""}
                </h4>
                <br />
                {loading && <CircularProgress color="secondary" />}
                {!loading && (
                  <Button color="rose" size="lg" round>
                    <FormatAlignLeft />{" "}
                    {blogObject.created_at
                      ? moment(blogObject.created_at.toDate()).fromNow()
                      : ""}
                  </Button>
                )}
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classes.main}>
          <div className={classes.container}>
            <div className={classes.section}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={8} md={8}>
                  <h3 className={classes.sectionTitle}>
                    {blogObject.title || ""}
                  </h3>
                  {this.renderParagraphs(blogObject.content || [])}
                </GridItem>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={6} md={6}>
                  <div className={classes.blogTags}>
                    {this.renderBlogTags(blogObject.tags || [])}
                  </div>
                </GridItem>
              </GridContainer>
              <br />
              <br />
            </div>
          </div>
        </div>
        <SectionSimilarStories blogs={blogsArray} blogId={blogObject.id} />
      </div>
    );
  }
}

const mapStateToProps = ({ blog, blogs, login }) => {
  const { loading, error, message, blogObject } = blog;
  const { blogsArray } = blogs;
  const { isAuthenticated, user } = login;
  return {
    loading,
    error,
    message,
    blogObject,
    blogsArray,
    isAuthenticated,
    user,
  };
};

export default connect(
  mapStateToProps,
  {
    setBlogObject,
    getBlog,
    getBlogs,
    setAuthenticated,
  }
)(withStyles(blogPostPageStyle)(Blog));
