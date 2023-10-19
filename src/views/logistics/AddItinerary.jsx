import { useEffect, useState } from "react";
import Modal from "../../layouts/components/modals/Modal";
import CSForm from "../../layouts/components/forms/CSForm";
import CSInput from "../../layouts/components/forms/CSInput";
import CSTextarea from "../../layouts/components/forms/CSTextarea";
import CSButton from "../../layouts/components/forms/CSButton";
// import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const AddItinerary = ({
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
    reservation_id: 0,
    itinerary: "",
    description: "",
    count: 0,
  };

  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  //   const axios = useAxiosPrivate();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...state,
      id: isUpdating ? state.count : state.count + 1,
    };

    console.log(body);

    try {
      setIsLoading(true);
      handleSubmit({
        data: body,
        action: isUpdating ? "alter" : "store",
        message: isUpdating ? "Itinerary Updated!!" : "Itinerary Added!!",
        status: isUpdating ? "Updated!!" : "Added!!",
      });
      setIsLoading(false);
      setState(initialState);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
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
        reservation_id: data?.reservation_id ?? 0,
        itinerary: data?.itinerary ?? "",
        description: data?.description ?? "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (dependencies !== undefined && dependencies?.reservation) {
      const { reservation, arrLength } = dependencies;

      setState({
        ...state,
        reservation_id: reservation?.id,
        count: parseInt(arrLength),
      });
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
          <CSInput
            id="itinerary"
            label="Upload Itinerary"
            type="file"
            value={state.itinerary}
            onChange={(e) => setState({ ...state, itinerary: e.target.value })}
          />
        </div>
        <div className="col-md-12 mb-3">
          <CSTextarea
            id="description"
            label="Description"
            placeholder="Enter Description"
            rows={5}
            value={state.description}
            onChange={(e) =>
              setState({ ...state, description: e.target.value })
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
            disabled={state.reservation_id === "" || state.description === ""}
          />
        </div>
      </CSForm>
    </Modal>
  );
};

export default AddItinerary;
