import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useAppContext } from "../../../context/AuthProvider";
import Modal from "../../../layouts/components/modals/Modal";
import CSForm from "../../../layouts/components/forms/CSForm";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import CSButton from "../../../layouts/components/forms/CSButton";
import { formatSelectOptions } from "../../../services/helpers";
import Alert from "../../../services/alert";

const Escalate = ({
  title = "",
  show = false,
  lg = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
  dependencies = [],
  status = "",
}) => {
  const initialState = {
    auth_id: 0,
    task_id: 0,
    ticket_id: 0,
    user_id: 0,
    name: "",
    description: "",
    status: status,
  };

  const [state, setState] = useState(initialState);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const axios = useAxiosPrivate();
  const { auth } = useAppContext();
  const animated = makeAnimated();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...state,
      status,
    };

    // console.log(body);

    try {
      axios
        .post("manage/complaints", body)
        .then((res) => {
          const response = res.data;
          Alert.success("Request Updated!!", response.message);
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
    if (dependencies?.length > 0) {
      setStaff(formatSelectOptions(dependencies, "id", "name"));
    }
  }, [dependencies]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        name: `${data?.attributes?.issue?.name}${
          status === "escalated" ? "(Escalated!!)" : ""
        }`,
        task_id: data?.attributes?.task?.id,
        ticket_id: data?.id,
        auth_id: auth?.user?.id,
      });
    }
  }, [data]);

  //   console.log(dependencies, data);

  useEffect(() => {
    setState({
      ...state,
      user_id: user?.value ?? 0,
    });
  }, [user]);

  useEffect(() => {
    if (status !== "escalated") {
      setState({
        ...state,
        user_id: auth?.user?.id,
      });
    }
  }, [status]);

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
        {status === "escalated" && (
          <div className="col-md-12 mb-3">
            <label className="cs__form-label">Staff</label>
            <Select
              components={animated}
              options={staff}
              placeholder="Select Staff"
              value={user}
              onChange={setUser}
              isSearchable
            />
          </div>
        )}

        <div className="col-md-12 mb-3">
          <CSTextarea
            id="description"
            label="Description"
            rows={4}
            value={state.description}
            onChange={(e) =>
              setState({ ...state, description: e.target.value })
            }
            placeholder="Enter Description Here..."
          />
        </div>
        <div className="col-md-12">
          <CSButton
            text={status === "escalted" ? "Escalate Task" : "Add TODO"}
            type="submit"
            variant="primary"
            icon="plus"
            size="lg"
            isLoading={isLoading}
            block
            disabled={state.user_id < 1 || state.description === ""}
          />
        </div>
      </CSForm>
    </Modal>
  );
};

export default Escalate;
