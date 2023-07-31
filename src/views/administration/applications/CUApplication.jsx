import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Modal from "../../../layouts/components/modals/Modal";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import CSButton from "../../../layouts/components/forms/CSButton";

const CUApplication = ({
  title = "",
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
}) => {
  const initialState = {
    id: 0,
    name: "",
    code: "",
    icon: "",
    path: "",
    description: "",
  };

  const [state, setState] = useState(initialState);
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
          .patch(`applications/${state.id}`, body)
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
          .catch((err) => {
            console.error(err.message);
            setIsLoading(false);
          });
      } else {
        axios
          .post("applications", body)
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
        code: data?.code,
        icon: data?.icon,
        path: data?.path,
        description: data?.description,
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
        <div className="col-md-8 mb-3">
          <CSInput
            id="name"
            label="Name"
            placeholder="Enter Application Name"
            value={state.name}
            onChange={(e) => setState({ ...state, name: e.target.value })}
          />
        </div>
        <div className="col-md-4 mb-3">
          <CSInput
            id="code"
            label="Code"
            placeholder="Enter Code"
            value={state.code}
            onChange={(e) => setState({ ...state, code: e.target.value })}
          />
        </div>
        <div className="col-md-5 mb-3">
          <CSInput
            id="icon"
            label="Icon"
            placeholder="Enter App Icon"
            value={state.icon}
            onChange={(e) => setState({ ...state, icon: e.target.value })}
          />
        </div>
        <div className="col-md-7 mb-3">
          <CSInput
            id="path"
            label="Path"
            placeholder="Enter Application URL"
            value={state.path}
            onChange={(e) => setState({ ...state, path: e.target.value })}
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
              state.icon === "" ||
              state.path === "" ||
              state.description === ""
            }
          />
        </div>
      </CSForm>
    </Modal>
  );
};

export default CUApplication;