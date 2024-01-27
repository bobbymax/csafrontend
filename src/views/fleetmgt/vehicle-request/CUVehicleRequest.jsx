import { useEffect, useState } from "react";
import Modal from "../../../layouts/components/modals/Modal";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSButton from "../../../layouts/components/forms/CSButton";
import CSInput from "../../../layouts/components/forms/CSInput";
import { useAppContext } from "../../../context/AuthProvider";
import { useFetchCollection } from "../../../hooks/kernal";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import { handleReturnedResponse } from "../../../http/helpers/functions";

const CUVehicleRequest = ({
  title = "",
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
  dependencies = undefined,
}) => {
  const { auth } = useAppContext();

  const initialState = {
    id: 0,
    user_id: auth.user.id,
    stock_type_id: 0,
    location_id: 0,
    code: `VRQ${Date.now().toString().slice(6)}`,
    required_date: "",
    return_date: "",
    duration: 0,
    destination: "",
    description: "",
    budget_code: "",
    cost: 0,
    nature_of_trip: "personal",
    status: "pending",
    closed: false,
  };

  const [state, setState] = useState(initialState);
  const [dependenciess, setDependenciess] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { submitForm } = useFetchCollection("vehicleRequests");

  const dateDifference = (start, end) => {
    const required_date = new Date(start);
    const return_date = new Date(end);

    if (!isNaN(return_date) && !isNaN(required_date)) {
      const duration = Math.floor(
        (return_date - required_date) / (1000 * 60 * 60 * 24)
      );
      setState((prevState) => ({ ...prevState, duration: duration }));
    } else {
      setState((prevState) => ({ ...prevState, duration: 0 }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const body = {
      ...state,
    };

    const response = await submitForm(body, isUpdating);
    handleSubmit(handleReturnedResponse(response, isUpdating));
    reset();
  };

  const handleModalClose = () => {
    reset();
    handleClose();
  };

  const reset = () => {
    setIsLoading(false);
    setState(initialState);
  };

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        user_id: data?.user_id,
        stock_type_id: data?.stock_type_id,
        location_id: data?.location_id,
        code: data?.code,
        required_date: data?.required_date.slice(0, 10),
        return_date: data?.return_date.slice(0, 10),
        duration: data?.duration,
        destination: data?.destination,
        budget_code: data?.budget_code,
        description: data?.description,
        cost: data?.cost,
        nature_of_trip: data?.nature_of_trip,
        status: data?.status,
        closed: data?.closed,
      });
    }
  }, [data]);

  //   console.log(dependenciess?.stockTypes);

  useEffect(() => {
    if (dependencies !== undefined) {
      setDependenciess(dependencies);
    }
  }, [dependencies]);

  return (
    <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
      <CSForm
        txtHeader={title}
        lg={12}
        md={12}
        formSubmit={handleFormSubmit}
        noBorder
        noHeader
      >
        <div className="col-md-5 mb-3">
          <CSInput
            id="code"
            label="Enter Code"
            placeholder="Enter Code"
            value={state.code}
            // onChange={(e) => setState({ ...state, code: e.target.value })}
            readOnly
            disabled
          />
        </div>
        <div className="col-md-7 mb-3">
          <CSSelect
            label="Select Location"
            id="location_id"
            value={state.location_id}
            onChange={(e) =>
              setState({ ...state, location_id: +e.target.value })
            }
          >
            <CSSelectOptions value={0} label="Selection Location" disabled />

            {dependenciess?.locations?.map((typ, i) => (
              <CSSelectOptions key={i} value={typ?.id} label={typ?.name} />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-12 mb-3">
          <CSSelect
            label="Select User"
            id="user_id"
            value={state.user_id}
            onChange={(e) => setState({ ...state, user_id: +e.target.value })}
          >
            <CSSelectOptions value={0} label="Select Staff Name" disabled />

            {dependenciess?.users?.map((typ, i) => (
              <CSSelectOptions key={i} value={typ?.id} label={typ?.name} />
            ))}
          </CSSelect>
        </div>

        <div className="col-md-6 mb-3">
          <CSInput
            id="code"
            label="Budget Code"
            placeholder="Enter Budget Code"
            value={state.budget_code}
            onChange={(e) =>
              setState({ ...state, budget_code: e.target.value })
            }
          />
        </div>

        <div className="col-md-6 mb-3">
          <CSSelect
            label="Vehicle type"
            id="stock_type_id"
            value={state.stock_type_id}
            onChange={(e) =>
              setState({ ...state, stock_type_id: +e.target.value })
            }
          >
            <CSSelectOptions value={0} label="Select Vehicle Type" disabled />

            {dependenciess?.stockTypes?.map((typ, i) => (
              <CSSelectOptions key={i} value={typ?.id} label={typ?.name} />
            ))}
          </CSSelect>
        </div>

        <div className="col-md-12 mb-3">
          <CSInput
            id="destination"
            label="Destination"
            placeholder="Destination"
            value={state.destination}
            onChange={(e) =>
              setState({ ...state, destination: e.target.value })
            }
          />
        </div>
        <div className="col-md-6 mb-3">
          <CSInput
            id="required_date"
            label="Select Date Needed"
            placeholder="Enter Code"
            type="date"
            value={state.required_date}
            onChange={(e) => {
              setState({ ...state, required_date: e.target.value });
              dateDifference(e.target.value, state.return_date);
            }}
          />
        </div>
        <div className="col-md-6 mb-3">
          <CSInput
            id="return_date"
            label="Expected Return Date"
            placeholder="Enter Code"
            type="date"
            value={state.return_date}
            onChange={(e) => {
              setState({ ...state, return_date: e.target.value });
              dateDifference(state.required_date, e.target.value);
            }}
          />
        </div>
        <div className="col-md-12 mb-3">
          <CSTextarea
            id="description"
            label="Description"
            placeholder="Enter Event Description"
            value={state.description}
            onChange={(e) => {
              setState({ ...state, description: e.target.value });
            }}
            rows={5}
          />
        </div>

        <div className="col-md-3 mb-3">
          <CSInput
            id="duration"
            label="Number of Days"
            placeholder="Number of Days"
            value={state.duration}
            readOnly
            // onChange={(e) => setState({ ...state, duration: e.target.value })}
          />
        </div>

        <div className="col-md-6 mb-3">
          <CSSelect
            label="Nature of Trip"
            id="nature_of_trip"
            value={state.nature_of_trip}
            onChange={(e) =>
              setState({ ...state, nature_of_trip: e.target.value })
            }
          >
            <CSSelectOptions value={0} label="Select Nature of Trip" disabled />
            {["personal", "official"].map((typ, i) => (
              <CSSelectOptions key={i} value={typ} label={typ} />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-3 mb-3">
          <CSInput
            id="cost"
            label="Cost"
            placeholder="Enter Cost"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            value={state.cost}
            onChange={(e) => {
              setState({ ...state, cost: +e.target.value });
              dateDifference;
            }}
          />
        </div>
        <div className="col-md-12">
          <CSButton
            text="Submit"
            type="submit"
            variant="primary"
            icon="send"
            size="lg"
            isLoading={isLoading}
            block
            disabled={
              state.name === "" ||
              state.code === "" ||
              state.department_type_id === 0
            }
          />
        </div>
      </CSForm>
    </Modal>
  );
};

export default CUVehicleRequest;
