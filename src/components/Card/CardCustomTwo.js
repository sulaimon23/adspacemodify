import React from "react";
import "./card.scss";
import _ from "underscore";
import { Place } from "@material-ui/icons";
import { Link } from "react-router-dom";
const CardCustomTwo = ({
  location,
  renderAges,
  renderGender,
  renderInterest,
  renderPrice,
  substringText,
  Info,
  classes,
  numberWithCommas
}) => {
  return (
    <div className="card-two" style={{marginBottom: '2rem'}}>
      <div style={{position: 'relative'}}>
        <img
          style={{ margin: 0, height: "250px", padding: 0, width: '100%' }}
          src={location.resizedImages ? (location.resizedImages[0] || '') : (location.images ? location.images[0] || '' : '')}
          alt={location.name ? substringText(location.name, 53).toLowerCase() : ""}
        />
        <div className="view-more">
          Click to see details
        </div>
      </div>
      <div className="card-body">
        <h1
          style={{
            textTransform: "capitalize",
            fontSize: 20,
            lineHeight: "25px",
            fontWeight:  'Bold',
            color: '#0b28ba'
          }}
        >
          {location.name ? substringText(location.name, 53).toLowerCase() : ""}
        </h1>

        <Info>
          <h5 style={{color: '#000', fontSize: 18, fontWeight:  'Bold',}}>{location.category ? location.category.name || "" : ""}</h5>
        </Info>

        <p
          style={{ color: "#000", fontSize: 18, marginTop: 15 }}
        >
          {location ? !location.traffic ? `Traffic: ${0}` : `Traffic: ${location.traffic.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` :  0}
        {' '}{location.trafficOption.name}
        </p>

        <p style={{ color: "#000", fontSize: 18, marginTop: 15 }}>
          {location.size
            ? "Size: " + location.size || ""
            : "Duration (seconds): " + location.duration ||
              "" + " , Quantity: " + location.quantity ||
              ""}
            {/* {location.sizingoption} */}


          {' '}{location.sizingOption.name}
        </p>

        <div className={classes.price}>
            <p style={{ fontWeight: "bold", marginTop: 15, fontSize: 18, color: '#0a24a7'}}> <span style={{color: '#0a24a7'}}>Admatch: </span>{` ${
              location.count ? (location.count / 5) * 100 : "0"
            }%`}</p>
        </div>


        {/* {!_.isEmpty(location.dimension) && (
          <p style={{ color: "#000", fontSize: 18, fontWeight: "Bold", marginTop: 15 }}>
            {`Breadth: ${location.dimension.breadth || ""}, Length: ${location
              .dimension.length || ""}`}
          </p>
        )} */}

        {/* {this.renderTags(location)} */}
        <div>{renderInterest ? renderInterest(location) : null}</div>
        <div>{renderAges ? renderAges(location) : null}</div>
        <div>{renderGender ? renderGender(location) : null}</div>
      </div>
      <div className="card-footer">
        <div
          className={classes.price}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "40px",
          }}
        >
          <div>
            {renderPrice(location.discountedPrice, location)}

            {location.discountedPrice && location.discountedPrice.value !== 0 ? (
              <p
                style={{
                  textAlign: "left",
                  fontSize: 15,
                  textDecoration: "line-through",
                  marginTop: "-15px",
                }}
              >{`${numberWithCommas(location.discountedPrice.value)}`}</p>
            ) : (
              ""
            )}
          </div>


          <div style={{ color: "#000", fontSize: "12px" }}>
            <Place style={{ fontSize: "20px" }} />

            {`${location.city ? location.city.name || "" : ""}, ${
              location.state ? location.state.name || "" : ""
            }`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCustomTwo;
