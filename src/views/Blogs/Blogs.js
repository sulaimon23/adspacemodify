import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../components/Header/Header";
import HeaderLinks from "../../components/Header/HeaderLinks";
import GridItem from "../../components/Grid/GridItem";
import GridContainer from "../../components/Grid/GridContainer";
import blogsStyle from "../../assets/jss/material-kit-pro-react/views/sectionsSections/blogsStyle.js";
import {
  CircularProgress,
  LinearProgress,
  withStyles,
} from "@material-ui/core";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import Info from "../../components/Typography/Info";
import { getBlogs, setAuthenticated, logOut } from "../../actions";
import cardBlog4 from "../../assets/img/examples/card-blog4.jpg";
import Loader from "../../assets/img/loader.gif";
import Badge from "../../components/Badge/Badge";
import moment from "moment";
import { Link } from "react-router-dom";
import { getAuth } from "../../firebase";
import Footer from "../../components/Footer/Footer";

class Blogs extends Component {
  componentDidMount() {
    const { blogsArray } = this.props;
    if (!blogsArray || blogsArray.length === 0) this.props.getBlogs();

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

  renderBlogs() {
    const { classes, blogsArray } = this.props;

    if (blogsArray && blogsArray.length > 0) {
      return blogsArray.map((blog, index) => {

        return (
          <Card plain blog className={classes.card} key={index}>
            <Link to={{ pathname: `/blog/${blog.id}`, blog, blogsArray }}>
              <GridContainer>
                {index % 2 === 1 ? (
                  <GridItem xs={12} sm={7} md={7}>
                    <h3 className={classes.cardTitle}>{blog.title || ""}</h3>
                    <p className={classes.description1}>
                      {this.formatContent(blog.content[0] || "")}
                    </p>
                    <p className={classes.author}>
                      by <b>{blog.author || ""}</b> ,{" "}
                      {/*{blog.created_at ? moment(blog.created_at.toDate()).format('YYYY-MM-DD hh:mm:ss') : ''}*/}
                    </p>
                    {this.formatTags(blog.tags || [])}
                  </GridItem>
                ) : (
                  <GridItem xs={12} sm={5} md={5}>
                    <CardHeader image plain>
                      <img src={blog.coverImage} alt="..." />
                      <div
                        className={classes.coloredShadow}
                        style={{
                          backgroundImage: `url(${blog.coverImage})`,
                          opacity: "1",
                        }}
                      />
                    </CardHeader>
                  </GridItem>
                )}
                {index % 2 === 1 ? (
                  <GridItem xs={12} sm={5} md={5}>
                    <CardHeader image plain>
                      <img src={blog.coverImage} alt="..." />
                      <div
                        className={classes.coloredShadow}
                        style={{
                          backgroundImage: `url(${blog.coverImage})`,
                          opacity: "1",
                        }}
                      />
                    </CardHeader>
                  </GridItem>
                ) : (
                  <GridItem xs={12} sm={7} md={7}>
                    <h3 className={classes.cardTitle}>{blog.title || ""}</h3>
                    <p className={classes.description1}>
                      {this.formatContent(blog.content[0] || "")}
                    </p>
                    <p className={classes.author}>
                      by <b>{blog.author || ""}</b> ,{" "}
                      {/*{blog.created_at ? moment(blog.created_at.toDate()).format('YYYY-MM-DD hh:mm:ss') : ''}*/}
                    </p>
                    {this.formatTags(blog.tags || [])}
                  </GridItem>
                )}
              </GridContainer>
            </Link>
          </Card>
        );
      });
    }
  }

  formatContent(content) {
    if (!content) return "";
    if (content.length < 260) return `${content}...`;
    return `${content.substr(0, 260)}...`;
  }

  formatTags(tags) {
    if (tags && tags.length === 0) return null;
    return tags.map((tag, index) => {
      return (
        <Badge key={index} color="rose">
          {tag}
        </Badge>
      );
    });
  }

  render() {
    const {
      loading,
      classes,
      error,
      message,
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
          // color="dark"
          // changeColorOnScroll={{
          //   height: 300,
          //   color: "info",
          // }}
        />
        <div className={classes.blog}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem
                xs={12}
                sm={10}
                md={10}
                className={classes.mlAuto + " " + classes.mrAuto}
              >
                <h2 className={classes.title}>Latest Blogposts</h2>
                <br />
                {loading && (
                  <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={12}>
                      <LinearProgress />
                    </GridItem>
                  </GridContainer>
                )}
                {this.renderBlogs()}
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ blogs, login }) => {
  const { loading, error, message, blogsArray } = blogs;
  const { isAuthenticated, user } = login;
  return { loading, error, message, blogsArray, isAuthenticated, user };
};

export default connect(
  mapStateToProps,
  {
    getBlogs,
    logOut,
    setAuthenticated,
  }
)(withStyles(blogsStyle)(Blogs));
