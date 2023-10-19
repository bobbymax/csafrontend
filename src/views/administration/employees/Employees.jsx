import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";
import CreateEmployee from "./CreateEmployee";
import Alert from "../../../services/alert";
import { useNavigate } from "react-router-dom";

const Employees = () => {
  const [collection, setCollection] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [staffTypes, setStaffTypes] = useState([]);
  const [levels, setLevels] = useState([]);
  const [status, setStatus] = useState([]);
  const [locations, setLocations] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [groups, setGroups] = useState([]);

  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const columns = [
    {
      field: "name",
      header: "Name",
      isSortable: true,
    },
    {
      field: "email",
      header: "Email",
    },
    {
      field: "staff_no",
      header: "Staff Number",
    },
    {
      field: "department",
      header: "Department",
    },
    {
      field: "grade_level",
      header: "Grade Level",
    },
    {
      field: "status",
      header: "Status",
    },
  ];

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setCollection(
        collection.map((collects) => {
          if (collects.id == response?.data?.id) {
            return response?.data;
          }

          return collects;
        })
      );
    } else {
      setCollection([response?.data, ...collection]);
    }

    Alert.success(response?.status, response?.message);
    handleClose();
  };

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setData(undefined);
  };

  const manage = (raw) => {
    navigate("/administration/manage/staff", {
      state: {
        staff: raw,
        dependencies: {
          departments,
          staffTypes,
          locations,
          levels,
          status,
          vendors,
        },
      },
    });
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      const urls = [
        "users",
        "departments",
        "staffTypes",
        "gradeLevels",
        "availabilities",
        "locations",
        "companies",
        "groups",
      ];

      const requests = urls.map((url) => axios.get(url));

      Promise.all(requests)
        .then((res) => {
          setCollection(res[0].data.data);
          setDepartments(res[1].data.data);
          setStaffTypes(res[2].data.data);
          setLevels(res[3].data.data);
          setStatus(res[4].data.data);
          setLocations(res[5].data.data);
          setVendors(res[6].data.data);
          setGroups(res[7].data?.data);
        })
        .catch((err) => console.error(err));
    } catch (error) {
      console.error(error);
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <>
      <CreateEmployee
        title="Add Staff"
        show={show}
        lg={false}
        isUpdating={isUpdating}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        data={data}
        dependencies={{
          departments,
          staffTypes,
          levels,
          status,
          locations,
          vendors,
          groups,
        }}
      />
      <div className="row">
        <PageHeader
          text="Staff"
          btnText="Add Staff"
          handleClick={() => setShow(true)}
        />
        <div className="col-md-12">
          <CSDatatable
            columns={columns}
            data={collection}
            isSearchable
            manage={manage}
          />
        </div>
      </div>
    </>
  );
};

export default Employees;
