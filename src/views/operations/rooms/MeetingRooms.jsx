import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";

const MeetingRooms = () => {
  const [collection, setCollection] = useState([]);
  const axios = useAxiosPrivate();
  const navigate = useNavigate();

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
    navigate("/view/meeting/schedule", {
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
        .get("bookings")
        .then((res) => {
          const response = res.data.data;
          setCollection(response);
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
      <div className="row">
        <PageHeader
          text="Meeting Rooms"
          icon="meeting_room"
          btnIcon="event_note"
          btnText="Schedule A Meeting"
          handleClick={() => navigate("/requests/schedule/meeting")}
        />

        <div className="col-md-12">
          <CSDatatable
            columns={columns}
            cols={columns}
            data={collection}
            isSearchable
            view={viewSchedule}
            exportable
          />
        </div>
      </div>
    </>
  );
};

export default MeetingRooms;
