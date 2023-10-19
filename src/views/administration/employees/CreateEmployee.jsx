import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Modal from "../../../layouts/components/modals/Modal";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSButton from "../../../layouts/components/forms/CSButton";
import CSBox from "../../../layouts/components/forms/CSBox";

const CreateEmployee = ({
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
    firstname: "",
    middlename: "",
    surname: "",
    grade_level_id: 0,
    department_id: 0,
    staff_type_id: 0,
    availability_id: 0,
    location_id: 0,
    company_id: 0,
    staff_no: "",
    email: "",
  };

  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [dependants, setDependants] = useState({});
  const [sGroups, setSGroups] = useState([]);

  const axios = useAxiosPrivate();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...state,
      groups: sGroups,
    };

    try {
      setIsLoading(true);
      if (isUpdating) {
        axios
          .patch(`users/${state.id}`, body)
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
          .post("users", body)
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

  const handleModalClose = () => {
    reset();
    handleClose();
  };

  const reset = () => {
    setIsLoading(false);
    setState(initialState);
    setSGroups([]);
  };

  useEffect(() => {
    if (dependencies !== undefined) {
      setDependants(dependencies);
    }
  }, [dependencies]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        firstname: data?.firstname,
        middlename: data?.middlename ?? "",
        surname: data?.surname,
        grade_level_id: data?.grade_level_id,
        department_id: data?.department_id,
        staff_type_id: data?.staff_type_id,
        availability_id: data?.availability_id,
        location_id: data?.location_id,
        company_id: data?.company_id,
        staff_no: data?.staff_no,
        email: data?.email,
      });
    }
  }, [data]);

  //   console.log(dependants);

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
            label="Company"
            id="company_id"
            value={state.company_id}
            onChange={(e) => setState({ ...state, company_id: e.target.value })}
          >
            <CSSelectOptions value={0} label="Select Company" disabled />

            {dependants?.vendors?.map((vendor, i) => (
              <CSSelectOptions
                key={i}
                value={vendor?.id}
                label={vendor?.name}
              />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-4 mb-3">
          <CSInput
            id="firstname"
            label="Firstname"
            placeholder="Enter Firstname"
            value={state.firstname}
            onChange={(e) => setState({ ...state, firstname: e.target.value })}
          />
        </div>
        <div className="col-md-4 mb-3">
          <CSInput
            id="middlename"
            label="Middlename"
            placeholder="Enter Middlename"
            value={state.middlename}
            onChange={(e) => setState({ ...state, middlename: e.target.value })}
          />
        </div>
        <div className="col-md-4 mb-3">
          <CSInput
            id="surname"
            label="Surname"
            placeholder="Enter Surname"
            value={state.surname}
            onChange={(e) => setState({ ...state, surname: e.target.value })}
          />
        </div>
        <div className="col-md-7 mb-3">
          <CSInput
            id="email"
            label="Email Address"
            placeholder="Enter Email Address"
            value={state.email}
            onChange={(e) => setState({ ...state, email: e.target.value })}
          />
        </div>
        <div className="col-md-5 mb-3">
          <CSInput
            id="staff_no"
            label="Staff Number"
            placeholder="Enter Staff Number"
            value={state.staff_no}
            onChange={(e) => setState({ ...state, staff_no: e.target.value })}
          />
        </div>
        <div className="col-md-5 mb-3">
          <CSSelect
            label="Department"
            id="department_id"
            value={state.department_id}
            onChange={(e) =>
              setState({ ...state, department_id: e.target.value })
            }
          >
            <CSSelectOptions value={0} label="Select Department" disabled />

            {dependants?.departments?.map((dept, i) => (
              <CSSelectOptions key={i} value={dept?.id} label={dept?.code} />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-7 mb-3">
          <CSSelect
            label="Location"
            id="location_id"
            value={state.location_id}
            onChange={(e) =>
              setState({ ...state, location_id: e.target.value })
            }
          >
            <CSSelectOptions value={0} label="Select Location" disabled />

            {dependants?.locations?.map((location, i) => (
              <CSSelectOptions
                key={i}
                value={location?.id}
                label={location?.name}
              />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-4 mb-5">
          <CSSelect
            label="Grade Level"
            id="grade_level_id"
            value={state.grade_level_id}
            onChange={(e) =>
              setState({ ...state, grade_level_id: e.target.value })
            }
          >
            <CSSelectOptions value={0} label="Select Grade Level" disabled />

            {dependants?.levels?.map((level, i) => (
              <CSSelectOptions key={i} value={level?.id} label={level?.key} />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-4 mb-5">
          <CSSelect
            label="Staff Type"
            id="staff_type_id"
            value={state.staff_type_id}
            onChange={(e) =>
              setState({ ...state, staff_type_id: e.target.value })
            }
          >
            <CSSelectOptions value={0} label="Select Staff Type" disabled />

            {dependants?.staffTypes?.map((typ, i) => (
              <CSSelectOptions key={i} value={typ?.id} label={typ?.name} />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-4 mb-5">
          <CSSelect
            label="Staff Status"
            id="availability_id"
            value={state.availability_id}
            onChange={(e) =>
              setState({ ...state, availability_id: e.target.value })
            }
          >
            <CSSelectOptions value={0} label="Select Staff Status" disabled />

            {dependants?.status?.map((stat, i) => (
              <CSSelectOptions key={i} value={stat?.id} label={stat?.name} />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-12 mb-5">
          <p className="cs__form-label">Groups</p>
          <div className="panel">
            <div className="row">
              {dependants?.groups?.map((group, i) => (
                <div key={i} className="col-6 col-sm-6 col-lg-6 mb-2">
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
              state.firstname === "" ||
              state.surname === "" ||
              state.staff_no === "" ||
              state.email === "" ||
              state.department_id === 0 ||
              state.availability_id === 0 ||
              state.department_id === 0 ||
              state.staff_type_id === 0 ||
              state.location_id === 0 ||
              state.company_id === 0 ||
              state.grade_level_id === 0
            }
          />
        </div>
      </CSForm>
    </Modal>
  );
};

export default CreateEmployee;
