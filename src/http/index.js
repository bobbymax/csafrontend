import axios from "axios"
// const BASE_URL = 'https://fld.test/api/'
const BASE_URL = 'http://csabackend.test/api/'

export default axios.create({
    baseURL: BASE_URL,
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
})