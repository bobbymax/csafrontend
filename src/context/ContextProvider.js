import { createContext, useContext, useState, useEffect } from "react";
import { useAppContext } from "./AuthProvider";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
    const [apps, setApps] = useState([])
    const [groups, setGroups] = useState([])
    const [canvas, setCanvas] = useState(false)
    const {auth} = useAppContext()
    const axios = useAxiosPrivate()

    
    useEffect(() => {
      if (auth?.user && auth?.token && auth?.user) {
        try {
          axios.get("applications")
        .then(res => setApps(res.data.data))
        .catch(err => console.error(err.message))
        } catch (err) {
          console.error(err)
        }

        const {groups} = auth?.user

        setGroups(groups)
      }
    }, [auth])

  return (
    <StateContext.Provider
      value={{ apps, setApps, canvas, setCanvas, groups }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
