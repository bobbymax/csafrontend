import { useEffect, useState } from "react"
import useAxiosPrivate from "./useAxiosPrivate"


const useController = (url) => {

    const axios = useAxiosPrivate()

    const [iterable, setIterable] = useState([])
    const [message, setMessage] = useState("")

    const fetchiterable = async () => {
        try {
            const response = await axios.get(url)
            // return response.data

            setIterable(response.data?.data)
            setMessage(response.data?.message)
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        fetchiterable()
    }, [])

  return [iterable, message]
}

export default useController