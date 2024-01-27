import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSForm from "../../../layouts/components/forms/CSForm";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import CSButton from "../../../layouts/components/forms/CSButton";
import CUFurnitureItems from "./CUFurnitureItems";
import Alert from "../../../services/alert";
import { unique } from "../../../services/helpers";
import { useAppContext } from "../../../context/AuthProvider";

const CUFurniture = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const { auth } = useAppContext();
  const initialState = {
    id: 0,
    user_id: 0,
    location_id: 0,
    description: "",
    type: "",
  };

  const [state, setState] = useState(initialState);
  const [locations, setLocations] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const makeRequest = (e) => {
    e.preventDefault();

    const body = {
      ...state,
      user_id: auth?.user?.id,
      code: unique("FRQ"),
      furniture: furnitureItems,
    };

    try {
      axios
        .post("furnitureRequests", body)
        .then((res) => {
          Alert.success("Logged!!", res.data.message);
          navigate("/requests/furnitures");
        })
        .catch((err) => console.error(err.message));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setFurnitureItems(
        furnitureItems.map((furniture) => {
          if (furniture.id == response?.data?.id) {
            return response?.data;
          }

          return furniture;
        })
      );
    } else {
      setFurnitureItems([response?.data, ...furnitureItems]);
    }

    Alert.success(response?.status, response?.message);
    handleClose();
  };

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setData(undefined);
  };

  const manage = (raw) => {
    setData(raw);
    setIsUpdating(true);
    setShow(true);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      const urls = ["locations", "stocks"];

      const requests = urls.map((url) => axios.get(url));

      Promise.all(requests)
        .then((responses) => {
          setLocations(responses[0].data?.data);
          setStocks(responses[1].data?.data);
        })
        .catch((err) => console.error(err));
    } catch (error) {
      console.error(error);
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (
      location &&
      location.state !== null &&
      location.state?.furniture !== null &&
      location.state?.method === "alter"
    ) {
      const { furniture } = location.state;

      setState({
        ...state,
        id: furniture?.id,
        user_id: furniture?.user_id,
        location_id: furniture?.location_id,
        description: furniture?.description,
        type: furniture?.type,
      });

      setIsUpdating(true);
    }
  }, [location]);

  // console.log(furnitureItems);

  return (
    <>
      <CUFurnitureItems
        title="Add Furniture Item"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
        dependencies={{ stocks }}
        count={furnitureItems.length}
      />

      <div className="row justify-content-center">
        <PageHeader
          md={10}
          text={`${isUpdating ? "Update" : "Make"} Furniture Request`}
          btnText="Go Back"
          btnIcon="arrow_back"
          handleClick={() => navigate(-1)}
          variant="danger"
        />

        <CSForm
          lg={10}
          md={10}
          sm={12}
          noHeader
          noBorder
          formSubmit={makeRequest}
        >
          <div className="col-md-6 mb-3">
            <CSSelect
              label="Location"
              id="location_id"
              value={state.location_id}
              onChange={(e) =>
                setState({ ...state, location_id: e.target.value })
              }
            >
              <CSSelectOptions value={0} label="Select Location" disabled />

              {locations?.map((location, i) => (
                <CSSelectOptions
                  key={i}
                  value={location?.id}
                  label={location?.name}
                />
              ))}
            </CSSelect>
          </div>
          <div className="col-md-6 mb-3">
            <CSSelect
              label="Request Type"
              id="type"
              value={state.type}
              onChange={(e) => setState({ ...state, type: e.target.value })}
            >
              <CSSelectOptions value="" label="Select Request Type" disabled />

              {[
                { key: "new", label: "New" },
                { key: "repair", label: "Repairs" },
                { key: "replacement", label: "Replacement" },
                { key: "move", label: "Move" },
              ].map((type, i) => (
                <CSSelectOptions
                  key={i}
                  value={type?.key}
                  label={type?.label}
                />
              ))}
            </CSSelect>
          </div>
          <div className="col-md-12 mb-3">
            <CSTextarea
              id="description"
              label="Description"
              placeholder="Enter Description"
              value={state.description}
              onChange={(e) =>
                setState({ ...state, description: e.target.value })
              }
              rows={5}
            />
          </div>
          <div className="col-md-12 mb-4">
            <CSButton
              text="Add Item"
              variant="dark"
              icon="add"
              handleClick={() => setShow(true)}
            />
          </div>

          <div className="col-md-12 mb-4">
            <table className="table table-striped table-hovered table-bordered">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
                {furnitureItems?.length > 0 ? (
                  furnitureItems.map((furt, i) => (
                    <tr key={i}>
                      <td>{furt?.item}</td>
                      <td>{furt?.quantity}</td>
                      <td>
                        <div className="btn__side">
                          <button type="button" className="cs__table__btn">
                            <span className="material-icons-sharp">edit</span>
                          </button>
                          <button type="button" className="cs__table__btn">
                            <span className="material-icons-sharp">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-danger">
                      No Item Data Added!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="col-md-12">
            <CSButton
              text="Make Request"
              type="submit"
              variant="primary"
              icon="send"
              size="lg"
              isLoading={isLoading}
              disabled={
                furnitureItems?.length < 1 ||
                state.location_id < 1 ||
                state.type === "" ||
                state.description === ""
              }
              block
            />
          </div>
        </CSForm>
      </div>
    </>
  );
};

export default CUFurniture;
