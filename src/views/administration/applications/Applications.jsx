import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";
import PageHeader from "../../../layouts/includes/PageHeader";
import Alert from "../../../services/alert";
import CUApplication from "./CUApplication";

const Applications = () => {
  const [collection, setCollection] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const axios = useAxiosPrivate();

  const columns = [
    {
      field: "name",
      header: "NAME",
      isSortable: true,
    },
    {
      field: "code",
      header: "ABV",
      isSortable: false,
    },
    {
      field: "path",
      header: "URL",
      isSortable: false,
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
    setData(raw);
    setIsUpdating(true);
    setShow(true);
  };

  // console.log(collection);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    try {
      axios
        .get("applications")
        .then((res) => {
          setCollection(res.data?.data);
        })
        .catch((er) => console.error(er.message));
    } catch (err) {
      console.error(err);
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <>
      <CUApplication
        title="Add Application"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
      />
      <div className="row">
        <PageHeader
          text="Applications"
          btnText="Create Application"
          handleClick={() => setShow(true)}
        />
        <div className="col-md-12">
          <CSDatatable
            columns={columns}
            cols={columns}
            data={collection}
            isSearchable
            manage={manage}
            exportable
          />
        </div>
      </div>
    </>
  );
};

export default Applications;
