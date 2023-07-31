import { useAppContext } from "../context/AuthProvider"
import {axiosPrivate} from "../http"
import DataFile from "../services/file"


const useRefreshToken = () => {

    const {setAuth} = useAppContext()

    const refresh = async () => {
        const response = await axiosPrivate.get('refresh')
        const token = response.data?.data?.token

        setAuth(prev => {
            return {...prev, token}
        })

        sessionStorage.setItem('auth', DataFile.encrypt(response.data?.data))

        return token
    }

  return refresh
}

export default useRefreshToken