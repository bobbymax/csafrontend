import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";

const Requisitions = () => {
  const [collection, setCollection] = useState([]);
  const [dependencies, setDependencies] = useState({});

  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const columns = [
    {
      field: "code",
      header: "Request Code",
      isSortable: true,
    },
    {
      field: "type",
      header: "Type",
    },
    {
      field: "department_name",
      header: "Department",
    },
    {
      field: "request_type",
      header: "Request Type",
    },
    {
      field: "status",
      header: "Status",
    },
  ];

  const viewRequest = (data) => {
    // console.log(data);

    navigate("/inventory/assign/requisition", {
      state: {
        dependencies,
        data,
        stage: "assign",
      },
    });
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      const urls = ["pending/requisitions", "department/staff"];

      const requests = urls.map((url) => axios.get(url));

      Promise.all(requests)
        .then((responses) => {
          setCollection(responses[0].data?.data);
          setDependencies({
            users: responses[1].data?.data,
          });
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
      <div className="row">
        <PageHeader text="Registered Requisitions" />
        <div className="col-md-12">
          <CSDatatable
            columns={columns}
            data={collection}
            isSearchable
            assign={viewRequest}
          />
        </div>
      </div>
    </>
  );
};

export default Requisitions;
