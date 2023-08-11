import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CreateEmployee from "./CreateEmployee";
import Alert from "../../../services/alert";
import PageHeader from "../../../layouts/includes/PageHeader";

const ManageEmployee = () => {
  const [employee, setEmployee] = useState(undefined);
  const [dependencies, setDependencies] = useState(undefined);
  const [show, setShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const location = useLocation();

  const handleSubmit = (response) => {
    setEmployee(response?.data);
    Alert.success(response?.status, response?.message);
    handleClose();
  };

  const handleClose = () => {
    setShow(false);
    // setIsUpdating(false);
    // setData(undefined);
  };

  useEffect(() => {
    if (
      location.state !== null &&
      location.state?.staff &&
      location.state?.dependencies
    ) {
      const { staff, dependencies } = location.state;

      setEmployee(staff);
      setDependencies(dependencies);
      setIsUpdating(true);
    }
  }, [location]);

  // console.log(employee);

  return (
    <>
      <CreateEmployee
        title="Update Staff Record"
        show={show}
        lg={false}
        isUpdating={isUpdating}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        data={employee}
        dependencies={{
          ...dependencies,
        }}
      />
      <div className="row">
        <PageHeader
          text="Staff"
          btnText="Disable Staff"
          handleClick={() => setShow(true)}
          variant="danger"
          btnIcon="visibility_off"
        />
      </div>
    </>
  );
};

export default ManageEmployee;
