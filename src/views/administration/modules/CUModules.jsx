import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Modal from "../../../layouts/components/modals/Modal";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSButton from "../../../layouts/components/forms/CSButton";
import CSBox from "../../../layouts/components/forms/CSBox";

const CUModules = ({
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
    application_id: 0,
    name: "",
    code: "",
    icon: "",
    path: "",
    description: "",
  };

  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);

  const [sGroups, setSGroups] = useState([]);
  const [sDepartments, setSDepartments] = useState([]);

  const axios = useAxiosPrivate();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...state,
      departments: sDepartments,
      groups: sGroups,
    };

    try {
      setIsLoading(true);
      if (isUpdating) {
        axios
          .patch(`modules/${state.id}`, body)
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
          .post("modules", body)
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

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    const value = parseInt(e.target.value);

    if (isChecked) {
      // add to array
      setSDepartments([...sDepartments, value]);
    } else {
      // remove from array
      setSDepartments(sDepartments.filter((dept) => dept !== value));
    }
  };

  const handleCheckboxGroupChange = (e) => {
    const isChecked = e.target.checked;
    const value = parseInt(e.target.value);

    if (isChecked) {
      // add to array
      setSGroups([...sGroups, value]);
    } else {
      // remove from array
      setSGroups(sGroups.filter((group) => group !== value));
    }
  };

  const reset = () => {
    setIsLoading(false);
    setState(initialState);
    setSDepartments([]);
    setSGroups([]);
  };

  useEffect(() => {
    if (data !== undefined) {
      let grps = [];
      let depts = [];

      setState({
        ...state,
        id: data?.id,
        application_id: data?.application_id,
        name: data?.name,
        code: data?.code,
        icon: data?.icon,
        path: data?.path,
        description: data?.description,
      });

      data?.attributes?.groups?.map((group) => grps.push(parseInt(group?.id)));
      data?.attributes?.departments?.map((dept) =>
        depts.push(parseInt(dept?.id))
      );

      setSGroups(grps);
      setSDepartments(depts);
    }
  }, [data]);

  useEffect(() => {
    if (
      dependencies !== undefined &&
      dependencies?.apps &&
      dependencies?.departments &&
      dependencies?.groups
    ) {
      const { apps, departments, groups } = dependencies;

      setApplications(apps);
      setDepartments(departments);
      setGroups(groups);
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
            label="Application"
            id="application_id"
            value={state.application_id}
            onChange={(e) =>
              setState({ ...state, application_id: e.target.value })
            }
          >
            <CSSelectOptions value={0} label="Select Application" disabled />

            {applications?.map((app, i) => (
              <CSSelectOptions key={i} value={app?.id} label={app?.name} />
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
        <div className="col-md-5 mb-3">
          <CSInput
            id="icon"
            label="Icon"
            placeholder="Enter Module Icon"
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
            rows={5}
          />
        </div>

        <div className="col-md-12 mb-3">
          <p className="cs__form-label">Departments</p>
          <div className="panel">
            <div className="row">
              {departments?.map((department, i) => (
                <div key={i} className="col-3 col-sm-4 col-lg-3">
                  <CSBox
                    id={department?.id}
                    label={department?.code}
                    value={department?.id}
                    onChange={handleCheckboxChange}
                    checked={sDepartments.includes(parseInt(department?.id))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-12 mb-4">
          <p className="cs__form-label">Groups</p>
          <div className="panel">
            <div className="row">
              {groups?.map((group, i) => (
                <div key={i} className="col-3 col-sm-4 col-lg-3">
                  <CSBox
                    id={group?.id}
                    label={group?.name}
                    value={group?.id}
                    onChange={handleCheckboxGroupChange}
                    checked={sGroups.includes(parseInt(group?.id))}
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
            disabled={
              state.name === "" ||
              state.code === "" ||
              state.icon === "" ||
              state.path === "" ||
              state.description === "" ||
              state.application_id === 0 ||
              sDepartments?.length < 1 ||
              sGroups?.length < 1
            }
          />
        </div>
      </CSForm>
    </Modal>
  );
};

export default CUModules;
