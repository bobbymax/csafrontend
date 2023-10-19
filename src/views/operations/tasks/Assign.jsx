import { useEffect, useState } from "react";
import PageHeader from "../../../layouts/includes/PageHeader";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";
import AssignTaskToStaff from "./AssignTaskToStaff";
import Alert from "../../../services/alert";

const Assign = () => {
  const axios = useAxiosPrivate();

  const [collection, setCollection] = useState([]);
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);

  const columns = [
    {
      field: "owner.code",
      header: "ABV",
      isSortable: false,
    },
    {
      field: "activity",
      header: "Request Type",
      isSortable: true,
    },
    {
      field: "status",
      header: "Status",
      isSortable: false,
    },
    {
      field: "raised_at",
      header: "Raised",
      isSortable: false,
    },
  ];

  const handleSubmit = (response) => {
    setCollection(
      collection.map((collects) => {
        if (collects.id == response?.data?.id) {
          return response?.data;
        }

        return collects;
      })
    );

    Alert.success(response?.status, response?.message);
    handleClose();
  };

  const handleClose = () => {
    setShow(false);
    setData(undefined);
  };

  const assign = (task) => {
    setData(task);
    setShow(true);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      const urls = ["fetch/tasks", "users"];
      const requests = urls.map((url) => axios.get(url));

      Promise.all(requests)
        .then((responses) => {
          setCollection(responses[0].data?.data);
          setUsers(responses[1].data?.data);
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  //   console.log(collection, users);

  return (
    <>
      <AssignTaskToStaff
        title="Assign Task to Staff"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        data={data}
        dependencies={{ users }}
      />

      <PageHeader text="Assign Tasks" icon="assignment" />

      <div className="row">
        <div className="col-md-12">
          <CSDatatable
            columns={columns}
            cols={columns}
            data={collection}
            isSearchable
            task={assign}
            exportable
          />
        </div>
      </div>
    </>
  );
};

export default Assign;
