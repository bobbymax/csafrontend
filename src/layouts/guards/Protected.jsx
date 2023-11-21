import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import "../../assets/css/main.css";
import Content from "../includes/Content";
import Header from "../includes/Header";
import Wrapper from "../includes/Wrapper";
import Sidebar from "../includes/Sidebar";
import Main from "../includes/Main";
import { useAppContext } from "../../context/AuthProvider";
import { events } from "../../services/helpers";
import useLogout from "../../hooks/useLogout";

const Protected = ({ children }) => {
  const { auth } = useAppContext();
  const location = useLocation();
  const logout = useLogout();

  let timer;

  const handleLogoutTimer = () => {
    timer = setTimeout(() => {
      resetTimer();

      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });

      signout();
    }, process.env.REACT_APP_SESSION_DURATION);
  };

  const resetTimer = () => {
    if (timer) clearTimeout(timer);
  };

  useEffect(() => {
    if (auth && auth?.user !== null) {
      Object.values(events).forEach((item) => {
        window.addEventListener(item, () => {
          resetTimer();
          handleLogoutTimer();
        });
      });
    }
  }, [auth]);

  const signout = async () => {
    await logout();
  };

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
