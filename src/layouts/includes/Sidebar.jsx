import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/login-logo.png";
import useLogout from "../../hooks/useLogout";
import { useLocation } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import { splitRoute } from "../../services/helpers";

const Sidebar = () => {
  const logout = useLogout();
  const { pathname } = useLocation();
  const [url, setUrl] = useState("");

  const { apps, canvas, setCanvas } = useStateContext();

  const [modules, setModules] = useState([]);

  const signout = async () => {
    await logout();
  };

  const handlePage = (path) => {
    setCanvas(false);
  };

  const handleHover = (app, action) => {
    action === "enter" ? setModules(app?.modules) : setModules([]);
    action === "enter" ? setCanvas(true) : setCanvas(false);
  };

  useEffect(() => {
    if (pathname !== "") {
      setUrl(splitRoute(pathname));
    }
  }, [pathname]);

  useEffect(() => {
    const outsideClick = () => {
      canvas && setCanvas(false);
    };

    document.addEventListener("click", outsideClick, true);

    return () => {
      document.removeEventListener("click", outsideClick, true);
    };
  }, [canvas]);

  return (
    <>
      <aside>
        <div className="sidebar__logo">
          <img src={logo} alt="Sidebar logo image" />
        </div>
        <nav className="sidebar">
          <div className="navigation">
            <Link to="/" className={`nav__item ${url === "/" ? "active" : ""}`}>
              <div className="link">
                <span className="material-icons-sharp">dashboard</span>
                <p>Dashboard</p>
              </div>
            </Link>
            {apps?.length > 0 &&
              apps?.map((application, i) => (
                <Link
                  key={i}
                  to="#"
                  className={`nav__item ${
                    url === application?.path ? "active" : ""
                  }`}
                  onMouseEnter={() => handleHover(application, "enter")}
                  // onMouseLeave={() => handleHover(application, "leave")}
                  onMouseDown={() => handleHover(application, "leave")}
                >
                  <div className="link">
                    <span className="material-icons-sharp">
                      {application?.icon}
                    </span>
                    <p>{application?.name}</p>
                  </div>
                  <div className="arrow">
                    <span className="material-icons-sharp link__slide">
                      navigate_next
                    </span>
                  </div>
                </Link>
              ))}
            <Link to="#" className="nav__item" onClick={() => signout()}>
              <span className="material-icons-sharp">logout</span>
              <p>Logout</p>
            </Link>
          </div>
        </nav>
      </aside>
      <div id="off__canvas__nav" className={`${canvas ? "show" : ""}`}>
        <div id="module__nav" className={`${canvas ? "show" : ""}`}>
          {modules?.map((modu, i) => (
            <Link
              key={i}
              to={modu?.path}
              className={`off__canvas__link ${
                pathname === modu?.path ? "active" : ""
              }`}
              onClick={() => handlePage(modu?.path)}
            >
              <span className="material-icons-sharp">{modu?.icon}</span>
              <p>{modu?.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
