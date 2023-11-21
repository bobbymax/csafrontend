import axios from "axios"

export default axios.create({
    baseURL: process.env.REACT_APP_BASE_URI,
})

export const axiosPrivate = axios.create({
    baseURL: process.env.REACT_APP_BASE_URI,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
})