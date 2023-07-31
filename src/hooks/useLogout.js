import { useAppContext } from "../context/AuthProvider"
import useAxiosPrivate from "./useAxiosPrivate"

const useLogout = () => {

    const {setAuth} = useAppContext()
    const request = useAxiosPrivate()

    const logout = async () => {
        setAuth({})
        sessionStorage.removeItem('auth')
        try {
            await request.get('logout')
        } catch (err) {
            console.log(err)
        }
    }

  return logout
}

export default useLogout