import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Modal from "../../../layouts/components/modals/Modal";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSButton from "../../../layouts/components/forms/CSButton";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";

const CURooms = ({
  title = "",
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
  dependencies = undefined,
}) => {
  const initialState = {
    id: 0,
    name: "",
    hall_category_id: 0,
    wing_id: 0,
    floor_id: 0,
    max_sitting_capacity: 0,
  };

  const [state, setState] = useState(initialState);
  const [hallCategories, setHallCategories] = useState([]);
  const [floors, setFloors] = useState([]);
  const [wings, setWings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const axios = useAxiosPrivate();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...state,
    };

    try {
      setIsLoading(true);
      if (isUpdating) {
        axios
          .patch(`rooms/${state.id}`, body)
          .then((res) => {
            const response = res.data;
            handleSubmit({
              status: "Updated!!",
              data: response.data,
              message: response.message,
              action: "alter",
            });
            reset();
          })
          .catch((err) => console.error(err.message));
      } else {
        axios
          .post("rooms", body)
          .then((res) => {
            const response = res.data;
            handleSubmit({
              status: "Created!!",
              data: response.data,
              message: response.message,
              action: "store",
            });
            reset();
          })
          .catch((err) => console.error(err.message));
      }
    } catch (error) {
      console.error(error);
    }
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
        name: data?.name,
        hall_category_id: data?.hall_category_id,
        wing_id: data?.wing_id,
        floor_id: data?.floor_id,
        max_sitting_capacity: data?.max_sitting_capacity,
      });
    }
  }, [data]);

  useEffect(() => {
    if (
      dependencies !== undefined &&
      dependencies?.floors?.length > 0 &&
      dependencies?.hallCategories?.length > 0 &&
      dependencies?.wings?.length > 0
    ) {
      const { floors, wings, hallCategories } = dependencies;
      setFloors(floors);
      setWings(wings);
      setHallCategories(hallCategories);
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
        <div className="col-md-12 mb-3">
          <CSSelect
            id="hall"
            label="Hall Category"
            value={state.hall_category_id}
            onChange={(e) =>
              setState({ ...state, hall_category_id: parseInt(e.target.value) })
            }
          >
            <CSSelectOptions value={0} label="Select Hall Category" disabled />

            {hallCategories.map((hall, i) => (
              <CSSelectOptions key={i} label={hall.name} value={hall.id} />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-12 mb-3">
          <CSSelect
            id="floor"
            label="Floor"
            value={state.floor_id}
            onChange={(e) =>
              setState({ ...state, floor_id: parseInt(e.target.value) })
            }
          >
            <CSSelectOptions value={0} label="Select Floor" disabled />

            {floors.map((floor, i) => (
              <CSSelectOptions key={i} label={floor.name} value={floor.id} />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-12 mb-3">
          <CSSelect
            id="wings"
            label="Wing"
            value={state.wing_id}
            onChange={(e) =>
              setState({ ...state, wing_id: parseInt(e.target.value) })
            }
          >
            <CSSelectOptions value={0} label="Select Wing" disabled />

            {wings.map((wing, i) => (
              <CSSelectOptions key={i} label={wing.name} value={wing.id} />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-12 mb-3">
          <CSInput
            id="name"
            label="Name"
            placeholder="Enter Name"
            value={state.name}
            onChange={(e) => setState({ ...state, name: e.target.value })}
          />
        </div>
        <div className="col-md-12 mb-5">
          <CSInput
            id="seating"
            type="number"
            label="Max Seating Capacity"
            value={state.max_sitting_capacity}
            onChange={(e) =>
              setState({ ...state, max_sitting_capacity: e.target.value })
            }
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
            disabled={state.name === ""}
          />
        </div>
      </CSForm>
    </Modal>
  );
};

export default CURooms;
