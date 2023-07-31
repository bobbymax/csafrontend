import { useState } from "react"
import useAxiosPrivate from "./useAxiosPrivate"

const useBulkCollection = (...requests) => {

    const bulk = useAxiosPrivate()
    const [data, setData] = useState({})

  return (
    <div>useBulkCollection</div>
  )
}

export default useBulkCollection