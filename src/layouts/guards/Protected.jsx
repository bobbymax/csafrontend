import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import "../../assets/css/main.css";
import Content from "../includes/Content";
import Header from "../includes/Header";
import Wrapper from "../includes/Wrapper";
import Sidebar from "../includes/Sidebar";
import Main from "../includes/Main";
import { useAppContext } from "../../context/AuthProvider";

const Protected = ({ children }) => {
  const { auth } = useAppContext();
  const location = useLocation();

  return auth?.user ? (
    <Content>
      {/* Main Wrapper */}
      <Wrapper>
        {/* Aside Navigation */}
        <Sidebar />
        {/* Main Content */}
        <div id="right-side">
          {/* Header Section */}
          <Header />
          <Main>{children}</Main>
        </div>
      </Wrapper>
    </Content>
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};

export default Protected;
