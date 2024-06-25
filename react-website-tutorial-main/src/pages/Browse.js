import React, { useState } from "react";
import { BrowseList } from "../helpers/BrowseList";
import BrowseItems from "../components/BrowseItems";
import SearchIcon from '@material-ui/icons/Search';
import "../styles/Browse.css";

function Browse() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Function to filter BrowseList based on searchTerm
  const filteredList = BrowseList.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="browse">
      <h1 className="BrowseTitle">Browse Shows</h1>
      <div className="search-bar">
        <SearchIcon className="search-icon" />
        <input
          type="text"
          placeholder="Search shows, movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="BrowseList">
        {filteredList.map((item, key) => (
          <BrowseItems
            key={key}
            image={item.image}
            name={item.name}
            text={item.text}
            rating={parseFloat(item.rating)} // Pass the rating as a float
          />
        ))}
      </div>
    </div>
  );
}

export default Browse;
