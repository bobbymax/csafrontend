import React from "react";
import avatar from "../../assets/images/avatar.png";
import logo from "../../assets/images/logo.png";

const Header = () => {
  return (
    <header className="top__header">
      <div className="components">
        <div className="brand">
          <span className="material-icons-sharp">menu</span>
          <h2>Welcome, Super Administrator</h2>
        </div>
        <div className="profile">
          {/* Notification */}
          <span className="material-icons-sharp">notifications</span>
          {/* Profile Dropdown */}
          <div className="top__nav">
            <div className="dropdown">
              <div className="avatar">
                <img src={avatar} alt="Profile Picture" />
              </div>
              <h3>Profile</h3>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
