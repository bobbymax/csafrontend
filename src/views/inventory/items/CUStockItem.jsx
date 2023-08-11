import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSBox from "../../../layouts/components/forms/CSBox";
import CSButton from "../../../layouts/components/forms/CSButton";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Alert from "../../../services/alert";

const CUStockItem = () => {
  const initialState = {
    id: 0,
    stock_id: 0,
    location_id: 0,
    barcode: "",
    name: "",
    quantity: 0,
  };

  const [state, setState] = useState(initialState);
  const [dependencies, setDependencies] = useState(undefined);
  const [item, setItem] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  return <div>CUStockItem</div>;
};

export default CUStockItem;
