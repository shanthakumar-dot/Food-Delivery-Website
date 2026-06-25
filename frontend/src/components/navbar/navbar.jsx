import { useContext } from "react";
import "./navbar.css";
import { assets } from "../../assets/assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { StoreContext } from "../../context/storecontext";

const Navbar = ({ setLogin, searchQuery, setSearchQuery }) => {
  const [menu, setMenu] = useState("menu");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const { token, settoken } = useContext(StoreContext);

  const logout = () => {
    settoken("");
    localStorage.removeItem("token");
    setLogin(false);
    alert("Logged out successfully");
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate("/search");
    }
  };

  const handleIconClick = () => {
    if (showSearch && searchQuery.trim()) {
      navigate("/search");
    } else {
      setShowSearch(!showSearch);
      setSearchQuery("");
    }
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>

      <ul className="navbar_menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          menu
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          mobile-app
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          contact-us
        </a>
      </ul>

      <div className="navbar-right">
        <div className="navbar-search-wrapper">
          <input
            type="text"
            className={`navbar-search-input ${showSearch ? "active" : ""}`}
            placeholder="Search food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
          <img
            src={assets.search_icon}
            alt="Search"
            className="navbar-search-icon-img"
            onClick={handleIconClick}
          />
        </div>

        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
        </div>

        <div>
          {!token ? (
            <button onClick={() => setLogin(true)}>sign in</button>
          ) : (
            <div className="navbar-profile">
              <img src={assets.profile_icon} alt="" />
              <ul className="nav-profile-dropdown">
                <li onClick={() => navigate("/myorders")}>
                  <img src={assets.bag_icon} alt="" />
                  orders
                </li>
                <hr />
                <li onClick={logout}>
                  <img src={assets.logout_icon} alt="" />
                  logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
