import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useAppContext } from "../../../context/AuthProvider";
import Modal from "../../../layouts/components/modals/Modal";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import CSBox from "../../../layouts/components/forms/CSBox";
import CSButton from "../../../layouts/components/forms/CSButton";
import { unique } from "../../../services/helpers";

const CUIncident = ({
  title = "",
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
  dependencies = undefined,
}) => {
  const { auth } = useAppContext();

  const initialState = {
    id: 0,
    user_id: 0,
    department_id: 0,
    owner_id: 0,
    issue_id: 0,
    location_id: 0,
    helpdesk_type_id: 0,
    floor_id: 0,
    related_issue_id: 0,
    code: "",
    description: "",
    category: "incident",
    landmark: "",
    office_number: "",
    attachment: "",
    priority: "",
    type: "",
  };

  const [state, setState] = useState(initialState);
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [floors, setFloors] = useState([]);
  const [supports, setSupports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [forOthers, setForOthers] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);

  const axios = useAxiosPrivate();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...state,
      code: unique("INC"),
      department_id: auth?.user?.department_id,
      user_id: state.user_id < 1 ? auth?.user?.id : state.user_id,
    };

    try {
      setIsLoading(true);
      if (isUpdating) {
        axios
          .patch(`tickets/${state.id}`, body)
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
          .post("tickets", body)
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
    if (
      dependencies !== undefined &&
      dependencies?.issues &&
      dependencies?.users &&
      dependencies?.locations &&
      dependencies?.floors
    ) {
      const { users, locations, floors, departments, supportTypes } =
        dependencies;

      // setIssues(issues);
      setUsers(users);
      setLocations(locations);
      setFloors(floors);
      setDepartments(departments);
      setSupports(supportTypes);
    }
  }, [dependencies]);

  useEffect(() => {
    if (state.helpdesk_type_id > 0) {
      const type = supports.filter(
        (sup) => parseInt(sup.id) === state.helpdesk_type_id
      )[0];

      setState({
        ...state,
        owner_id: type?.department_id ?? 0,
      });
      setIssues(type?.issues ?? []);
    }
  }, [state.helpdesk_type_id]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        user_id: data?.user_id,
        department_id: data?.department_id,
        location_id: data?.location_id,
        floor_id: data?.floor_id,
        issue_id: data?.issue_id,
        description: data?.description,
        office_number: data?.office_number,
      });
    }
  }, [data]);

  const hasFloors =
    locations.find((loc) => loc.id == state.location_id)?.hasFloors == 1;

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
        <div className="col-md-4 mb-3">
          <CSSelect
            label="Incident Type"
            value={state.helpdesk_type_id}
            onChange={(e) =>
              setState({ ...state, helpdesk_type_id: parseInt(e.target.value) })
            }
          >
            <CSSelectOptions value={0} label="Select Type" disabled />
            {supports.map((loc) => (
              <CSSelectOptions
                key={loc?.id}
                value={loc?.id}
                label={loc?.name}
              />
            ))}
          </CSSelect>
        </div>

        <div className="col-md-8 mb-3">
          <CSSelect
            label="Where did you see this Incident?"
            value={state.location_id}
            onChange={(e) =>
              setState({ ...state, location_id: parseInt(e.target.value) })
            }
          >
            <CSSelectOptions value={0} label="Select Location" disabled />
            {locations.map((loc) => (
              <CSSelectOptions
                key={loc?.id}
                value={loc?.id}
                label={loc?.name}
              />
            ))}
          </CSSelect>
        </div>

        <div className={`col-md-${hasFloors ? "7" : "12"} mb-3`}>
          <CSInput
            id="officeId"
            label="Landmark Close to Incident"
            placeholder="Enter Closest Location"
            value={state.office_number}
            onChange={(e) =>
              setState({ ...state, office_number: e.target.value })
            }
          />
        </div>

        {hasFloors ? (
          <div className="col-md-5 mb-3">
            <CSSelect
              label="Floor"
              value={state.floor_id}
              onChange={(e) =>
                setState({ ...state, floor_id: parseInt(e.target.value) })
              }
            >
              <CSSelectOptions value={0} label="Select Floor" disabled />
              {floors.map((floor) => (
                <CSSelectOptions
                  key={floor?.id}
                  value={floor?.id}
                  label={floor?.name}
                />
              ))}
            </CSSelect>
          </div>
        ) : (
          <></>
        )}

        <div className="col-md-12 mb-3">
          <CSSelect
            label="What complaint category does it fall other?"
            value={state.issue_id}
            onChange={(e) =>
              setState({ ...state, issue_id: parseInt(e.target.value) })
            }
            disabled={issues?.length < 1}
          >
            <CSSelectOptions value={0} label="Select Issue" disabled />
            {issues.map((floor) => (
              <CSSelectOptions
                key={floor?.id}
                value={floor?.id}
                label={floor?.name}
              />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-12 mb-3">
          <CSTextarea
            id="description"
            label="Elaborate what you saw"
            placeholder="Enter Description"
            value={state.description}
            onChange={(e) =>
              setState({ ...state, description: e.target.value })
            }
            rows={6}
          />
        </div>
        <div className="col-md-12 mb-4">
          <CSInput
            id="upload"
            type="file"
            label="Upload if you took a picture"
            value={state.attachment}
            onChange={(e) => setState({ ...state, attachment: e.target.value })}
          />
        </div>
        <div className="col-md-12 mb-3">
          <CSSelect
            label="Priority"
            value={state.priority}
            onChange={(e) => setState({ ...state, priority: e.target.value })}
          >
            <CSSelectOptions value="" label="Select Severity" disabled />
            {[
              { key: "low", label: "Low" },
              { key: "medium", label: "Medium" },
              { key: "high", label: "High" },
            ].map((priority, i) => (
              <CSSelectOptions
                key={i}
                value={priority.key}
                label={priority.label}
              />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-12 mb-3">
          <CSBox
            label="Reporting on behalf of someone?"
            value={forOthers}
            onChange={() => setForOthers((prev) => !prev)}
          />

          {forOthers ? (
            <CSSelect
              label="User"
              value={state.user_id}
              onChange={(e) =>
                setState({ ...state, user_id: parseInt(e.target.value) })
              }
            >
              <CSSelectOptions value={0} label="Select User" disabled />
              {users.map((user) => (
                <CSSelectOptions
                  key={user?.id}
                  value={user?.id}
                  label={user?.name}
                />
              ))}
            </CSSelect>
          ) : (
            <></>
          )}
        </div>

        <div className="col-md-12">
          <CSButton
            text="Say Something"
            type="submit"
            variant="danger"
            icon="mic"
            size="lg"
            isLoading={isLoading}
            block
            disabled={
              state.location_id === 0 ||
              state.description === "" ||
              state.issue_id === 0
            }
          />
        </div>
      </CSForm>
    </Modal>
  );
};

export default CUIncident;
