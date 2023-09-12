import { useEffect, useState } from "react";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSButton from "../../../layouts/components/forms/CSButton";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { formatSelectOptions } from "../../../services/helpers";
import Modal from "../../../layouts/components/modals/Modal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Alert from "../../../services/alert";

const AssignTask = ({
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
    taskable_id: 0,
    assignee_id: 0,
    department_id: 0,
    activity: "requisition",
    description: "",
    // status: "ongoing",
    type: "staff",
  };

  const animated = makeAnimated();
  const axios = useAxiosPrivate();

  const [state, setState] = useState(initialState);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...state,
    };

    try {
      axios
        .post("tasks", body)
        .then((res) => {
          const response = res.data;
          Alert.success("Assigned", response.message);
          reset();
          handleSubmit(response.data);
        })
        .catch((err) => {
          console.error(err.message);
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalClose = () => {
    reset();
    handleClose();
  };

  const reset = () => {
    setState(initialState);
    setIsLoading(false);
    setUser(undefined);
  };

  useEffect(() => {
    if (user !== undefined) {
      setState({
        ...state,
        assignee_id: user?.value,
        department_id: user?.raw?.department_id,
      });
    }
  }, [user]);

  useEffect(() => {
    if (dependencies !== undefined && dependencies?.users?.length > 0) {
      setUsers(formatSelectOptions(dependencies?.users, "id", "name"));
    }
  }, [dependencies]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        taskable_id: data?.id,
      });
    }
  }, [data]);

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
          <label className="cs__form-label">Staff</label>
          <Select
            components={animated}
            options={users}
            placeholder="Select Staff"
            value={user}
            onChange={setUser}
            isSearchable
          />
        </div>
        <div className="col-md-12 mb-3">
          <CSTextarea
            id="description"
            label="Description"
            rows={4}
            value={state.description}
            onChange={(e) =>
              setState({ ...state, description: e.target.value })
            }
            placeholder="Enter Item Description Here..."
          />
        </div>
        <div className="col-md-12">
          <CSButton
            text="Assign Request To Staff"
            type="submit"
            variant="primary"
            icon="plus"
            size="lg"
            isLoading={isLoading}
            block
            disabled={state.assignee_id < 1 || state.description === ""}
          />
        </div>
      </CSForm>
    </Modal>
  );
};

export default AssignTask;
