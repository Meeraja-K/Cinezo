import React from "react";
import { Link } from "react-router-dom";
import House from "../assets/home.jpg";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home" style={{ backgroundImage: `url(${House})` }}>
      <div className="headerContainer">
        <h1> Cinezo </h1>
        <p> Unlock Your Entertainment Universe!</p>
        <Link to="/browse/:username">
          <button> WATCH NOW </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
