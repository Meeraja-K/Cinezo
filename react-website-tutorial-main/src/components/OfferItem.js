import React from "react";
import { Link } from "react-router-dom";

function OfferItem({ name, price, symbol }) {
  const getTypeFromName = (name) => {
    if (name.toLowerCase().includes("month")) {
      return "1-month";
    } else if (name.toLowerCase().includes("half year")) {
      return "half-year";
    } else if (name.toLowerCase().includes("annual")) {
      return "annual";
    } else if (name.toLowerCase().includes("lifetime")) {
      return "lifetime"
    } else {
      return "";
    }
  };

  return (
    <div className="offerItem">
      <Link to={`/payment/${getTypeFromName(name)}`} className="offerItem__link">
        <button className="offerItem__button">
          <h2>{name}</h2>
          <p>{symbol}$ {price}</p>
        </button>
      </Link>
    </div>
  );
}

export default OfferItem;
