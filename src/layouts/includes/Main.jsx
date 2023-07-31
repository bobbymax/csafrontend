import React from "react";
import { useStateContext } from "../../context/ContextProvider";

const Main = ({ children }) => {
  const { canvas } = useStateContext();

  return (
    <main>
      <div className="container-fluid">{children}</div>
      <div id="overlay" className={`${canvas ? "show" : ""}`}></div>
    </main>
  );
};

export default Main;
