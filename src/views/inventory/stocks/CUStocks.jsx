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

const CUStocks = () => {
  const initialState = {
    id: 0,
    brand_id: 0,
    stock_type_id: 0,
    department_id: 0,
    code: "",
    name: "",
    quantity: 0,
    number: 1,
    measure: "",
    restockable: false,
    request_on_delivery: false,
    inStock: false,
    tags: [],
  };

  const [state, setState] = useState(initialState);
  const [dependencies, setDependencies] = useState(undefined);
  const [stock, setStock] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...state,
      inStock: state.inStock ? 1 : 0,
      request_on_delivery: state.request_on_delivery ? 1 : 0,
      restockable: state.restockable ? 1 : 0,
      quantity: state.number * state.quantity,
    };

    try {
      if (isUpdating) {
        axios
          .patch(`stocks/${state.id}`, body)
          .then((res) => {
            const response = res.data;
            Alert.success("Updated!!", response.message);
            reset();
          })
          .catch((err) => {
            console.error(err.message);
            setIsLoading(false);
          });
      } else {
        axios
          .post("stocks", body)
          .then((res) => {
            const response = res.data;
            Alert.success("Added!!", response.message);
            reset();
          })
          .catch((err) => {
            console.error(err.message);
            setIsLoading(false);
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

  const handleTagged = (e, tag) => {
    let deps = [];
    const isChecked = e.target.checked;

    if (isChecked) {
      deps.push(tag?.id);

      setState({
        ...state,
        tags: [...deps, ...state.tags],
      });
    } else {
      if (state.tags.includes(tag?.id)) {
        setState({
          ...state,
          tags: state.tags?.filter((tagID) => tagID !== tag?.id),
        });
      }
    }
  };

  useEffect(() => {
    if (stock !== undefined) {
      setState({
        ...state,
        id: stock?.id,
        brand_id: stock?.brand_id,
        stock_type_id: stock?.stock_type_id,
        department_id: stock?.department_id,
        code: stock?.code,
        name: stock?.name,
        quantity: stock?.quantity,
        measure: stock?.measure,
        restockable: stock?.restockable === 1,
        request_on_delivery: stock?.request_on_delivery === 1,
        inStock: stock?.inStock === 1,
        tags: stock?.tagIds,
      });

      setIsUpdating(true);
    }
  }, [stock]);

  useEffect(() => {
    const { state, pathname } = location;

    if (state !== null && state?.dependencies && state?.action !== "") {
      const { dependencies } = state;
      setDependencies(dependencies);
      if (pathname === "/inventory/stock/update") setStock(state?.data);
    }
  }, [location]);

  return (
    <>
      <PageHeader
        text={isUpdating ? "Update Stock" : "Add Stock"}
        btnIcon="arrow_back"
        btnText="Back to Stocks"
        variant="danger"
        handleClick={() => {
          reset();
          navigate("/inventory/stock");
        }}
      />

      <div className="row">
        <CSForm lg={8} md={12} noHeader formSubmit={handleSubmit}>
          <div className="col-md-3 mb-4">
            <CSInput
              id="code"
              label="Stock Code"
              placeholder="Enter Stock Code"
              value={state.code}
              onChange={(e) => setState({ ...state, code: e.target.value })}
            />
          </div>
          <div className="col-md-5 mb-4">
            <CSSelect
              label="Department"
              value={state.department_id}
              onChange={(e) =>
                setState({ ...state, department_id: parseInt(e.target.value) })
              }
            >
              <CSSelectOptions value={0} label="Select Department" disabled />
              {dependencies?.departments?.map((dept) => (
                <CSSelectOptions
                  key={dept?.id}
                  value={dept?.id}
                  label={dept?.code}
                />
              ))}
            </CSSelect>
          </div>
          <div className="col-md-4 mb-4">
            <CSSelect
              label="Stock Type"
              value={state.stock_type_id}
              onChange={(e) =>
                setState({ ...state, stock_type_id: parseInt(e.target.value) })
              }
            >
              <CSSelectOptions value={0} label="Select Stock Type" disabled />
              {dependencies?.stockTypes?.map((st) => (
                <CSSelectOptions key={st?.id} value={st?.id} label={st?.name} />
              ))}
            </CSSelect>
          </div>

          <div className="col-md-5 mb-4">
            <CSSelect
              label="Brand"
              value={state.brand_id}
              onChange={(e) =>
                setState({ ...state, brand_id: parseInt(e.target.value) })
              }
            >
              <CSSelectOptions value={0} label="NONE" />
              {dependencies?.brands?.map((brand) => (
                <CSSelectOptions
                  key={brand?.id}
                  value={brand?.id}
                  label={brand?.name}
                />
              ))}
            </CSSelect>
          </div>
          <div className="col-md-7 mb-4">
            <CSInput
              id="name"
              label="Name"
              placeholder="Enter Stock Name"
              value={state.name}
              onChange={(e) => setState({ ...state, name: e.target.value })}
            />
          </div>
          <div className="col-md-4 mb-4">
            <CSInput
              id="quantity"
              type="number"
              label="Quantity"
              min={1}
              value={state.quantity}
              onChange={(e) =>
                setState({ ...state, quantity: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="col-md-4 mb-4">
            <CSSelect
              label="Measure"
              value={state.measure}
              onChange={(e) => setState({ ...state, measure: e.target.value })}
            >
              <CSSelectOptions
                value=""
                label="Select Stock Measurement"
                disabled
              />
              {["single", "packs", "boxes", "cartons"].map((mea, i) => (
                <CSSelectOptions
                  key={i}
                  value={mea}
                  label={mea?.toUpperCase()}
                />
              ))}
            </CSSelect>
          </div>
          <div className="col-md-4 mb-4">
            <CSInput
              id="number"
              label="Number"
              type="number"
              value={state.number}
              onChange={(e) =>
                setState({ ...state, number: parseInt(e.target.value) })
              }
              disabled={state.measure === "single"}
            />
          </div>
          <div className="col-md-12 mb-4">
            <div className="panel">
              <div className="panel__header mb-3">
                <h3 className="cs__form-label">Attributes</h3>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <CSBox
                    label="In Stock"
                    id="in-stock"
                    value={state.inStock}
                    onChange={(e) =>
                      setState({ ...state, inStock: e.target.checked })
                    }
                    checked={state.inStock}
                  />
                </div>
                <div className="col-md-4">
                  <CSBox
                    label="Restockable"
                    id="restockable"
                    value={state.restockable}
                    onChange={(e) =>
                      setState({ ...state, restockable: e.target.checked })
                    }
                    checked={state.restockable}
                  />
                </div>
                <div className="col-md-4">
                  <CSBox
                    label="Request On Delivery"
                    id="request-on-delivery"
                    value={state.request_on_delivery}
                    onChange={(e) =>
                      setState({
                        ...state,
                        request_on_delivery: e.target.checked,
                      })
                    }
                    checked={state.request_on_delivery}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 mb-4">
            <div className="panel">
              <div className="panel__header mb-3">
                <h3 className="cs__form-label">Tags</h3>
              </div>
              <div className="row">
                {dependencies?.tags?.map((tag, i) => (
                  <div className="col-md-4" key={i}>
                    <CSBox
                      label={tag?.name}
                      id={tag?.name}
                      value={tag?.id}
                      onChange={(e) => handleTagged(e, tag)}
                      checked={state.tags?.includes(tag?.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <CSButton
              text={`${isUpdating ? "Update" : "Add"} Stock`}
              type="submit"
              variant="primary"
              icon="send"
              size="lg"
              isLoading={isLoading}
              block
              disabled={state.name === ""}
            />
          </div>
        </CSForm>
      </div>
    </>
  );
};

export default CUStocks;
