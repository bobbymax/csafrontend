import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Modal from "../../../layouts/components/modals/Modal";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSButton from "../../../layouts/components/forms/CSButton";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";

const AssignTaskToStaff = ({
  title = "",
  show = false,
  lg = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
  dependencies = undefined,
  departmentId = 0,
}) => {
  const initialState = {
    user_id: 0,
    task_id: 0,
    description: "",
  };

  const [state, setState] = useState(initialState);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const axios = useAxiosPrivate();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...state,
    };

    try {
      setIsLoading(true);
      axios
        .post(`staff/assign/tasks/${state.task_id}`, body)
        .then((res) => {
          const response = res.data;
          handleSubmit({
            status: "Assigned!!",
            data: response.data,
            message: response.message,
            action: "alter",
          });
          //   Alert.success("Assigned!!", response.message);
          reset();
        })
        .catch((err) => console.error(err.message));
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
    if (dependencies !== undefined) {
      const { users } = dependencies;
      const members = users.filter(
        (staff) => parseInt(staff.department_id) === departmentId
      );
      setStaff(members ?? []);
    }
  }, [dependencies]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        task_id: data?.id,
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
          <CSSelect
            id="staff"
            label="staff"
            value={state.user_id}
            onChange={(e) =>
              setState({ ...state, user_id: parseInt(e.target.value) })
            }
          >
            <CSSelectOptions value={0} label="Select Staff" disabled />

            {staff.map((user, i) => (
              <CSSelectOptions key={i} label={user.name} value={user.id} />
            ))}
          </CSSelect>
        </div>

        <div className="col-md-12 mb-5">
          <CSTextarea
            id="description"
            label="Description"
            value={state.description}
            onChange={(e) =>
              setState({ ...state, description: e.target.value })
            }
            rows={5}
            placeholder="Enter Description"
          />
        </div>

        <div className="col-md-12">
          <CSButton
            text="Assign"
            type="submit"
            variant="primary"
            icon="person_add"
            size="lg"
            isLoading={isLoading}
            block
            disabled={state.user_id === 0}
          />
        </div>
      </CSForm>
    </Modal>
  );
};

export default AssignTaskToStaff;
