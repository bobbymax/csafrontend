import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
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

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};

export default PersistAuth;
