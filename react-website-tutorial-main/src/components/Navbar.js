import React, { useState } from "react";
import Logo from "../assets/Logo.png";
import { Link, useHistory } from "react-router-dom";
import ReorderIcon from "@material-ui/icons/Reorder";
import "../styles/Navbar.css";
import { useUserContext } from '../helpers/UserContext';

function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);
  const { isLoggedIn, logout, isPaid, authStatus } = useUserContext();
  const history = useHistory();

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };

  const handleLogout = () => {
    logout();
    history.push('/');
  };

  return (
    <div className="navbar">
      <div className="leftSide" id={openLinks ? "open" : "close"}>
        <img src={Logo} alt="Logo" />
        <div className="hiddenLinks">
          <ul>
            <Link to="/"> {isLoggedIn ? "Home1" : "Home"} </Link>
            <Link to="/browse"> Browse </Link>
            <Link to="/offer"> Offers </Link>
            <Link to="/about"> About </Link>
            {isLoggedIn && isPaid && authStatus ? (
              <>
              <Link to="/profile"> Profile </Link>
              <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/contact"> Contact </Link>
            )}
          </ul>
        </div>
      </div>
      <div className="rightSide">
        <ul>
          <Link to="/"> {isLoggedIn ? "Home" : "Home"} </Link>
          <Link to="/browse"> Browse </Link>
          <Link to="/offer"> Offers </Link>
          <Link to="/about"> About </Link>
          {isLoggedIn && isPaid && authStatus ? (
            <>
              <Link to="/profile"> Profile </Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/contact"> Contact </Link>
          )}
        </ul>
        <button onClick={toggleNavbar}>
          <ReorderIcon />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
