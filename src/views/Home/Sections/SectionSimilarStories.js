import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import TrendingUp from "@material-ui/icons/TrendingUp";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Info from "components/Typography/Info.js";
import Success from "components/Typography/Success.js";
import Danger from "components/Typography/Danger.js";

import blog6 from "assets/img/examples/blog6.jpg";
import blog8 from "assets/img/examples/blog8.jpg";
import blog7 from "assets/img/examples/blog7.jpg";

import sectionSimilarStoriesStyle from "assets/jss/material-kit-pro-react/views/blogPostSections/sectionSimilarStoriesStyle.js";
import {Link} from "react-router-dom";

const useStyles = makeStyles(sectionSimilarStoriesStyle);

export default function SectionSimilarStories(props) {
  const classes = useStyles();
  let newBlogs = props.blogs.filter(blog => blog.id !== props.blogId) || [];

  function formatContent(content){
    if (!content) return '';
    if (content.length < 190) return `${content}...`;
    return `${content.substr(0, 190)}...`;
  }

  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <GridContainer>
          <GridItem md={12}>
            <h2 className={classes.title + " " + classes.textCenter}>
              Similar Blogs
            </h2>
            <br />
            <GridContainer>
              {newBlogs.map((blog, index) => {
                return(
                    <GridItem xs={12} sm={4} md={4} key={index}>
                      <Card blog>
                        <Link to={{ pathname: `/blog/${blog.id}`, blog }}>
                          <CardHeader image>
                            <img src={blog.coverImage} alt="..." />
                            <div
                                className={classes.coloredShadow}
                                style={{
                                  backgroundImage: "url(" + blog.coverImage + ")",
                                  opacity: "1"
                                }}
                            />
                          </CardHeader>
                          <CardBody>
                            <h4 className={classes.cardTitle}>
                              {blog.title || ''}
                            </h4>
                            <p className={classes.description}>
                              {formatContent(blog.content[0] || '')}
                            </p>
                          </CardBody>
                        </Link>
                      </Card>
                    </GridItem>
                )
              })}
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
