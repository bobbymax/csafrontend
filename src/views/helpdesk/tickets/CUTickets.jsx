import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Modal from "../../../layouts/components/modals/Modal";
import CSForm from "../../../layouts/components/forms/CSForm";
import { useAppContext } from "../../../context/AuthProvider";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSButton from "../../../layouts/components/forms/CSButton";
import CSBox from "../../../layouts/components/forms/CSBox";

const CUTickets = ({
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
    issue_id: 0,
    location_id: 0,
    floor_id: 0,
    related_issue_id: 0,
    code: "",
    category: "support",
    description: "",
    additional_info: "",
    office_no: "",
  };

  const [state, setState] = useState(initialState);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [locations, setLocations] = useState([]);
  const [floors, setFloors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [forOthers, setForOthers] = useState(false);

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
    if (dependencies !== undefined && dependencies?.departments) {
      const { departments, issues, users, locations, floors } = dependencies;

      setDepartments(departments);
      setIssues(issues);
      setUsers(users);
      setLocations(locations);
      setFloors(floors);
    }
  }, [dependencies]);

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
        additional_info: data?.additional_info,
        office_no: data?.office_no,
        status: data?.status,
        closed: data?.closed,
      });
    }
  }, [data]);

  const hasFloors =
    locations.find((loc) => loc.id == state.location_id)?.hasFloors == 1;

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
          <div className="col-md-6 mb-3">
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

          <div className="col-md-6 mb-3">
            <CSSelect
              label="Location"
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
              type="number"
              step="1"
              id="officeId"
              label="Office Number"
              placeholder="Enter Office Number"
              value={state.office_no}
              onChange={(e) =>
                setState({ ...state, office_no: e.target.value })
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
              label="Issue"
              value={state.issue_id}
              onChange={(e) =>
                setState({ ...state, issue_id: parseInt(e.target.value) })
              }
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
              label="Description"
              placeholder="Enter Description"
              value={state.description}
              onChange={(e) =>
                setState({ ...state, description: e.target.value })
              }
            />
          </div>
          <div className="col-md-12 mb-3">
            <CSTextarea
              id="additional_info"
              label="Additional Information"
              placeholder="Enter Additional Information"
              value={state.additional_info}
              onChange={(e) =>
                setState({ ...state, additional_info: e.target.value })
              }
            />
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
              text="Submit"
              type="submit"
              variant="primary"
              icon="send"
              size="lg"
              isLoading={isLoading}
              block
              disabled={
                state.department_id === 0 ||
                state.location_id === 0 ||
                state.description === "" ||
                state.issue_id === 0
                // state.office_no === 0
              }
            />
          </div>
        </CSForm>
      </Modal>
    </>
  );
};

export default CUTickets;
