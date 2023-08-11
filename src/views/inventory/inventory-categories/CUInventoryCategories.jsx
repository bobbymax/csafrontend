import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Modal from "../../../layouts/components/modals/Modal";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSButton from "../../../layouts/components/forms/CSButton";
import CSBox from "../../../layouts/components/forms/CSBox";

const CUInventoryCategories = ({
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
    departments: [],
  };

  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

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
          .patch(`inventoryCategories/${state.id}`, body)
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
          .post("inventoryCategories", body)
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

  const handleChecked = (e, dept) => {
    let deps = [];
    const isChecked = e.target.checked;

    if (isChecked) {
      deps.push(dept?.id);

      setState({
        ...state,
        departments: [...deps, ...state.departments],
      });
    } else {
      if (state.departments.includes(dept?.id)) {
        setState({
          ...state,
          departments: state.departments?.filter(
            (deptID) => deptID !== dept?.id
          ),
        });
      }
    }
  };

  useEffect(() => {
    if (dependencies !== undefined && dependencies?.departments) {
      const { departments } = dependencies;
      setDepartments(departments);
    }
  }, [dependencies]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        name: data?.name,
        departments: data?.departments,
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
          <CSInput
            id="name"
            label="Name"
            placeholder="Enter Category Name"
            value={state.name}
            onChange={(e) => setState({ ...state, name: e.target.value })}
          />
        </div>

        <div className="col-md-12 mb-4">
          <div className="panel">
            <div className="row">
              {departments.map((dept) => (
                <div className="col-md-4" key={dept?.id}>
                  <CSBox
                    label={dept?.code}
                    id={dept?.code}
                    value={dept?.id}
                    onChange={(e) => handleChecked(e, dept)}
                    checked={state.departments?.includes(dept?.id)}
                  />
                </div>
              ))}
            </div>
          </div>
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

export default CUInventoryCategories;
