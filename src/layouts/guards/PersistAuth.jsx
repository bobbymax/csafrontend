import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import LoaderOne from "../components/loaders/LoaderOne";
// import useRefreshToken from "../../hooks/useRefreshToken";
// import { useAppContext } from "../../context/AuthProvider";

const PersistAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  // const refresh = useRefreshToken();
  // const { auth } = useAppContext();

  useEffect(() => {
    // const verifyRefreshToken = async () => {
    //   try {
    //     await refresh();
    //   } catch (err) {
    //     console.log(err);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // !auth?.token ? verifyRefreshToken() : setIsLoading(false);
    // console.log(auth);
    setIsLoading(false);
  }, []);

  return <>{isLoading ? <LoaderOne /> : <Outlet />}</>;
};

export default PersistAuth;
