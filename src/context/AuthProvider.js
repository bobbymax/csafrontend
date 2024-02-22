import { createContext, useContext, useEffect, useState } from "react";
import DataFile from "../services/file";

const AuthContext = createContext({})

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({})
    const sess = sessionStorage.getItem('auth')

    useEffect(() => {
        if (sess !== null) {
            // const authSession = DataFile.decrypt(sess)
            const authSession = sess
            setAuth(authSession)
        }
    }, [sess])

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAppContext = () => useContext(AuthContext)