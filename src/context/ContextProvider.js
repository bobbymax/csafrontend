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
        const loggedInUser = auth?.user
        const {groups} = loggedInUser

        let grps = []

        groups.map(grp => grps.push(parseInt(grp?.id)))

        try {
          axios.get("applications")
          .then(res => {
            const response = res.data.data
            // console.log(response)
            setApps(response)
          })
          .catch(err => console.error(err.message))
        } catch (err) {
          console.error(err)
        }

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
