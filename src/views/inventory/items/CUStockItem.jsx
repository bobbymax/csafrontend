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
import CSTextarea from "../../../layouts/components/forms/CSTextarea";

const CUStockItem = () => {
  const initialState = {
    id: 0,
    stock_id: 0,
    location_id: 0,
    barcode: "",
    name: "",
    quantity: 0,
    description: "",
    hasFeature: false,
    color: "",
    tank_capacity: 0,
    insurance_due_date: "",
    insurance_status: "",
  };

  const [state, setState] = useState(initialState);
  const [dependencies, setDependencies] = useState(undefined);
  const [item, setItem] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...state,
    };

    try {
      if (isUpdating) {
        axios
          .patch(`items/${state.id}`, body)
          .then((res) => {
            const response = res.data;
            Alert.success("Updated!!", response.message);
            reset();
          })
          .catch((err) => {
            setIsLoading(false);
            console.error(err.message);
          });
      } else {
        axios
          .post("items", body)
          .then((res) => {
            const response = res.data;
            Alert.success("Added!!", response.message);
            reset();
          })
          .catch((err) => {
            setIsLoading(false);
            console.error(err.message);
          });
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const reset = () => {
    setState(initialState);
    setIsUpdating(false);
    setIsLoading(false);
  };

  useEffect(() => {
    if (item !== undefined) {
      setState({
        ...state,
        id: item.id,
        stock_id: item.stock_id,
        location_id: item.location_id,
        barcode: item.barcode,
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        color: item.color,
        tank_capacity: item.tank_capacity,
        insurance_due_date: item.insurance_due_date,
        insurance_status: item.insurance_status,
        hasFeature: item.hasFeature,
      });
    }
  }, [item]);

  useEffect(() => {
    if (location?.state !== null && location?.pathname !== "") {
      const { dependencies, data, action } = location?.state;
      setDependencies(dependencies);
      if (data !== undefined) setItem(data);
      if (action !== "store") setIsUpdating(true);
    }
  }, [location]);

  return (
    <>
      <PageHeader
        text={isUpdating ? "Update Stock Item" : "Add Stock Item"}
        btnIcon="arrow_back"
        btnText="Back to Stock Items"
        variant="danger"
        handleClick={() => {
          reset();
          navigate("/inventory/stock/items");
        }}
      />

      <div className="row">
        <CSForm lg={8} md={12} noHeader formSubmit={handleSubmit}>
          <div className="col-md-3 mb-4">
            <CSInput
              label="Barcode"
              value={state.barcode}
              onChange={(e) => setState({ ...state, barcode: e.target.value })}
              placeholder="Enter Barcode"
            />
          </div>
          <div className="col-md-9 mb-4">
            <CSInput
              label="Name"
              value={state.name}
              onChange={(e) => setState({ ...state, name: e.target.value })}
              placeholder="Enter Item Name"
            />
          </div>
          <div className="col-md-4 mb-4">
            <CSSelect
              label="Stock"
              value={state.stock_id}
              onChange={(e) =>
                setState({ ...state, stock_id: parseInt(e.target.value) })
              }
            >
              <CSSelectOptions label="Select Stock" value={0} disabled />
              {dependencies?.stocks?.map((stock) => (
                <CSSelectOptions
                  label={stock?.name}
                  value={stock?.id}
                  key={stock?.id}
                />
              ))}
            </CSSelect>
          </div>
          <div className="col-md-4 mb-4">
            <CSSelect
              label="Location"
              value={state.location_id}
              onChange={(e) =>
                setState({ ...state, location_id: parseInt(e.target.value) })
              }
            >
              <CSSelectOptions label="Select Location" value={0} disabled />
              {dependencies?.locations?.map((location) => (
                <CSSelectOptions
                  label={location?.name}
                  value={location?.id}
                  key={location?.id}
                />
              ))}
            </CSSelect>
          </div>
          <div className="col-md-4 mb-4">
            <CSInput
              label="Quantity"
              type="number"
              value={state.quantity}
              onChange={(e) => setState({ ...state, quantity: e.target.value })}
              placeholder="Enter Item Name"
            />
          </div>
          <div className="col-md-12 mb-4">
            <CSBox
              label="Has Extra Features"
              id="has-features"
              value={state.hasFeature}
              onChange={(e) =>
                setState({ ...state, hasFeature: e.target.checked })
              }
              checked={state.hasFeature}
            />
          </div>
          {state.hasFeature && (
            <>
              <div className="col-md-7 mb-4">
                <CSInput
                  label="Color"
                  value={state.color}
                  onChange={(e) =>
                    setState({ ...state, color: e.target.value })
                  }
                  placeholder="Enter Item Color"
                />
              </div>
              <div className="col-md-5 mb-4">
                <CSInput
                  label="Tank Capacity"
                  type="number"
                  value={state.tank_capacity}
                  onChange={(e) =>
                    setState({ ...state, tank_capacity: e.target.value })
                  }
                />
              </div>
              <div className="col-md-4 mb-4">
                <CSInput
                  label="Insurance Due Date"
                  type="date"
                  value={state.insurance_due_date}
                  onChange={(e) =>
                    setState({ ...state, insurance_due_date: e.target.value })
                  }
                />
              </div>
              <div className="col-md-8 mb-4">
                <CSSelect
                  label="Insurance Status Type"
                  value={state.insurance_status}
                  onChange={(e) =>
                    setState({
                      ...state,
                      insurance_status: e.target.value,
                    })
                  }
                >
                  <CSSelectOptions
                    label="Select Insurance Status"
                    value=""
                    disabled
                  />
                  {[
                    { label: "Comprehensive", key: "comprehensive" },
                    { label: "Third Party", key: "third-party" },
                    { label: "Third Party Plus", key: "third-party-plus" },
                  ].map((stat, i) => (
                    <CSSelectOptions
                      label={stat?.label}
                      value={stat?.key}
                      key={i}
                    />
                  ))}
                </CSSelect>
              </div>
            </>
          )}

          <div className="col-md-12">
            <CSTextarea
              id="description"
              label="Description"
              value={state.description}
              onChange={(e) =>
                setState({
                  ...state,
                  description: e.target.value,
                })
              }
              placeholder="Enter Item Description Here"
              rows={5}
            />
          </div>
          <div className="col-md-12 mt-3">
            <CSButton
              text={`${isUpdating ? "Update" : "Add"} Stock Item`}
              type="submit"
              variant="primary"
              icon="send"
              size="lg"
              isLoading={isLoading}
              block
              disabled={
                state.name === "" ||
                state.barcode === "" ||
                state.stock_id === 0
              }
            />
          </div>
        </CSForm>
      </div>
    </>
  );
};

export default CUStockItem;
