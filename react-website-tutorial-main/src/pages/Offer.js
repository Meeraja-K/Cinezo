import React from "react";
import { OfferList } from "../helpers/OfferList";
import OfferItem from "../components/OfferItem";
import "../styles/Offer.css";
import { convertCurrency } from "../helpers/currencyRates";

function Offer() {
  const userCountry = localStorage.getItem('userCountry') || 'United States';

  return (
    <div className="offer">
      <h1>Our Offers</h1>
      <div className="offer__list">
        {OfferList.map((item, index) => {
          const { price, symbol } = convertCurrency(item.price, userCountry);
          return (
            <OfferItem key={index} name={item.name} price={price} symbol={symbol} />
          );
        })}
      </div>
    </div>
  );
}

export default Offer;
