import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Modal from "../../../layouts/components/modals/Modal";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import CSBox from "../../../layouts/components/forms/CSBox";
import CSButton from "../../../layouts/components/forms/CSButton";
import CSForm from "../../../layouts/components/forms/CSForm";

const CUSType = ({
  title = "",
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
  dependencies = [],
}) => {
  const initialState = {
    id: 0,
    name: "",
    description: "",
    department_id: 0,
    isDeactivated: false,
  };

  const [state, setState] = useState(initialState);
  const [departments, setDepartments] = useState([]);
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
          .patch(`helpdeskTypes/${state.id}`, body)
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
          .post("helpdeskTypes", body)
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
    if (dependencies?.length > 0) {
      setDepartments(dependencies);
    }
  }, [dependencies]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        department_id: data?.department_id,
        name: data?.name,
        description: data?.description,
        isDeactivated: data?.isDeactivated,
      });
    }
  }, [data]);

  return (
    <>
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
              label="Department"
              value={state.department_id}
              onChange={(e) =>
                setState({
                  ...state,
                  department_id: parseInt(e.target.value),
                })
              }
            >
              <CSSelectOptions value={0} label="Select DDD" disabled />
              {departments.map((dept) => (
                <CSSelectOptions
                  key={dept?.id}
                  value={dept?.id}
                  label={dept?.name}
                />
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

          <div className="col-md-12 mb-3">
            <CSBox
              label="Deactivate Type"
              value={state.isDeactivated}
              onChange={(e) =>
                setState({ ...state, isDeactivated: e.target.checked })
              }
              checked={state.isDeactivated}
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
              disabled={state.department_id === 0 || state.name === ""}
            />
          </div>
        </CSForm>
      </Modal>
    </>
  );
};

export default CUSType;
