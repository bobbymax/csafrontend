import { useEffect, useState } from "react"
import useAxiosPrivate from "./useAxiosPrivate"


export const useFetchDependencies = (params) => {
    const axios = useAxiosPrivate()

    const [dependencies, setDependencies] = useState([])

    const fetchDependencies = async () => {
        try {

            const requests = params.map(param => axios.get(param?.url))
            const responses = await Promise.all(requests)
            const depends = responses.map(response => response.data?.data)

            const setters = depends.reduce((acc, depend, i) => {
                acc[params[i]?.name] = depend
                return acc
            }, {})

            setDependencies(setters)
        } catch (error) {
            console.error(error);
            throw Error("Invalid URL Error")
        }
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        fetchDependencies()

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [])

    return dependencies
}

export const useFetchCollection = (url) => {
    const axios = useAxiosPrivate()

    const [iterable, setIterable] = useState([])

    const fetchiterable = async () => {
        try {
            const response = await axios.get(url)
            setIterable(response.data?.data)
        } catch (error) {
            console.error(error);
        }
    }

    const updateIterable = (data, action) => {
        if (action === "alter") {
            setIterable(
                iterable.map((item) => data.id === item.id ? data : item)
            )
        } else if (action === "store") {
            setIterable([data, ...iterable])
        } else if (action === "delete") {
            setIterable(iterable.filter(collection => collection.id !== data.id))
        } else {
            throw Error("Invalid Action Provided to Update Iterable.")
        }
    }

    const destroySelectedData = async (dataId) => {
        const response = await axios.delete(`${url}/${dataId}`)
        return response.data
    }

    const submitForm = async (body, isUpdating) => {
        try {
            if (isUpdating) {
                const response = await axios.patch(`${url}/${body?.id}`, body)
                return response.data
            } else {
                const response = await axios.post(url, body)
                return response.data
            }
        } catch (error) {
            console.error(error);
            throw Error(error)
        }
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        fetchiterable()

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [])

  return {iterable, updateIterable, submitForm, destroySelectedData}
}