import { useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const Furnitures = () => {
  const [collection, setCollection] = useState([]);
  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  return <div>Furnitures</div>;
};

export default Furnitures;
