import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Modal from "../../../layouts/components/modals/Modal";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSButton from "../../../layouts/components/forms/CSButton";

const CUDepartment = ({
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
    department_type_id: 0,
    parentId: 0,
    name: "",
    code: "",
  };

  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [parents, setParents] = useState([]);
  const [deptTypes, setDeptTypes] = useState([]);

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
          .patch(`departments/${state.id}`, body)
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
          .post("departments", body)
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
        department_type_id: data?.department_type_id,
        parentId: data?.parentId,
        name: data?.name,
        code: data?.code,
      });
    }
  }, [data]);

  useEffect(() => {
    if (
      dependencies !== undefined &&
      dependencies?.departmentTypes &&
      dependencies?.depts
    ) {
      const { departmentTypes, depts } = dependencies;

      setParents(depts);
      setDeptTypes(departmentTypes);
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
            label="Department Type"
            id="department_type"
            value={state.department_type_id}
            onChange={(e) =>
              setState({ ...state, department_type_id: e.target.value })
            }
          >
            <CSSelectOptions
              value={0}
              label="Select Department Type"
              disabled
            />

            {deptTypes?.map((typ, i) => (
              <CSSelectOptions key={i} value={typ?.id} label={typ?.name} />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-12 mb-3">
          <CSSelect
            label="Parent Department"
            id="parentId"
            value={state.parentId}
            onChange={(e) => setState({ ...state, parentId: e.target.value })}
          >
            <CSSelectOptions value={0} label="None" />

            {parents?.map((par, i) => (
              <CSSelectOptions key={i} value={par?.id} label={par?.name} />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-8 mb-3">
          <CSInput
            id="name"
            label="Name"
            placeholder="Enter Module Name"
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

export default CUDepartment;
