import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AuthProvider";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";

const AddSchedule = () => {
  const [collection, setCollection] = useState([]);
  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth } = useAppContext();

  const columns = [
    {
      field: "code",
      header: "Budget Code",
      isSortable: true,
    },
    {
      field: "title",
      header: "Purpose",
      isSortable: true,
    },
    {
      field: "start",
      header: "Begin",
      isSortable: false,
    },
    {
      field: "finish",
      header: "End",
      isSortable: false,
    },
    {
      field: "status",
      header: "Status",
      isSortable: true,
    },
  ];

  const viewSchedule = (raw) => {
    navigate("/operations/handle/schedule/request", {
      state: {
        booking: raw,
      },
    });
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    try {
      axios
        .get("fetch/pending/schedules")
        .then((res) => {
          const response = res.data.data;

          setCollection(
            response.filter((booking) =>
              booking?.attributes?.task?.assignees?.includes(auth?.user?.id)
            )
          );
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
    <div className="row">
      <PageHeader
        text="Handle Meeting Requests"
        icon="event"
        btnIcon="arrow_back"
        btnText="Go Back"
        handleClick={() => navigate(-1)}
      />

      <div className="col-md-12">
        <CSDatatable
          columns={columns}
          cols={columns}
          data={collection}
          isSearchable
          manage={viewSchedule}
          exportable
        />
      </div>
    </div>
  );
};

export default AddSchedule;
