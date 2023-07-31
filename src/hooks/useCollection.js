import { useEffect, useState } from "react"
import useAxiosPrivate from "./useAxiosPrivate"

const useCollection = (url) => {

    const [data, setData] = useState([])
    const [status, setStatus] = useState("")
    const [error, setError] = useState("")
    const collection = useAxiosPrivate()

    useEffect(() => {
        let isMounted = true
        const controller = new AbortController()

        try {
            collection.get(url)
            .then(response => {
                setData(response.data.data)
                setStatus(response.data.status)

                // console.log(response.data.status)
            })
            .catch(err => {
                setError(err.message)
                // console.log(err.message)
            })
        } catch (err) {
            
        }

        return () => {
            isMounted = false
            controller.abort()
        }
    }, [])

    const response = {
        data,
        setData,
        status,
        error
    }

  return response
}

export default useCollection