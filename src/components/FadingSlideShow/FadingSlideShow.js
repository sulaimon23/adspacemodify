import React from "react";
import Slider from "react-slick";

export default ({ url, children }) => {
  const settings = {
    dots: false,
    fade: true,
    arrows: false,
    lazyLoad: true,
    autoplay: true,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const renderImages = url.map((val, key) => {
    return (
      <div key={key}>
        <div
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%,rgba(0,0,0,0.3) 100%), url(${val}) no-repeat`,
            height: "84vh",
            fontWeight: "bold",
            backgroundSize: "100% 755px",
          }}
        >
          <div style={{ position: "relative", top: "23%" }}> {children}</div>
        </div>
      </div>
    );
  });

  return (
    <div>
      <Slider {...settings}>{renderImages}</Slider>
    </div>
  );
};
