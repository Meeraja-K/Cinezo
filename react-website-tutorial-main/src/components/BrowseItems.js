import React from "react";
import { Link } from "react-router-dom";
import Star from "@material-ui/icons/Star";
import StarHalf from "@material-ui/icons/StarHalf";
import StarBorder from "@material-ui/icons/StarBorder";
import "../styles/BrowseItems.css"; // Import the CSS file

function BrowseItems({ image, name, text, rating, numRatings }) {
  // Function to render star icons based on rating out of 5
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full star icons
    for (let i = 0; i < fullStars && i < 5; i++) {
      stars.push(<Star key={i} />);
    }

    // Add half star icon if needed
    if (hasHalfStar && stars.length < 5) {
      stars.push(<StarHalf key={stars.length} />);
    }

    // Add empty star icons if not full
    while (stars.length < 5) {
      stars.push(<StarBorder key={stars.length} />);
    }

    return stars;
  };

  return (
    <Link
      to={`/show/${name.toLowerCase().replace(/ /g, "-")}`}
      className="BrowseItem"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="item-content">
        <div className="item-image" style={{ backgroundImage: `url(${image})` }}></div>
        <h1>{name}</h1>
        <p>{text}</p>
        <div className="rating">
          {renderStars(rating)}
          <span className="num-ratings">({numRatings})</span>
        </div>
      </div>
    </Link>
  );
}

export default BrowseItems;
