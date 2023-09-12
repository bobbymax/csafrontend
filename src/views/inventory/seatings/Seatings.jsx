import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";
import Alert from "../../../services/alert";
import CUSeatings from "./CUSeatings";

const Seatings = () => {
  const [collection, setCollection] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const axios = useAxiosPrivate();

  const columns = [
    {
      field: "name",
      header: "Name",
      isSortable: true,
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

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      axios
        .get("seatings")
        .then((res) => {
          setCollection(res.data?.data);
        })
        .catch((err) => console.error(err.message));
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
      <CUSeatings
        title="Add Seating Arrangement"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
      />
      <div className="row">
        <PageHeader
          icon="chair"
          text="Seating Arrangements"
          btnText="Create Seating Arrangement"
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

export default Seatings;
