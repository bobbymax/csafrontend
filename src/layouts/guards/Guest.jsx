import React from "react";
import loginLogo from "../../assets/images/login-logo.png";
import { Player } from "@lottiefiles/react-lottie-player";
import loaderAni from "../../assets/lpanimation.json";

const Guest = ({ children }) => {
  return (
    <div id="login__content">
      <div id="login__details">
        <div className="container_fluid">
          <div id="login__logo">
            <img src={loginLogo} alt="Login Logo" />
          </div>
          <div className="login__input">
            <div className="row">{children}</div>
          </div>
        </div>
      </div>
      <div id="vector">
        <Player autoplay loop src={loaderAni}></Player>
      </div>
    </div>
  );
};

export default Guest;
