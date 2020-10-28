import React from "react";
import Slider from "react-slick";

export default ({ children }) => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 5000,
    cssEase: "linear",
  };

  return <Slider {...settings}>{children}</Slider>;
};
