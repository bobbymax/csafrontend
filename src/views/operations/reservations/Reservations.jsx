import { useEffect, useState } from "react";
import PageHeader from "../../../layouts/includes/PageHeader";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";
import { useNavigate } from "react-router-dom";

const Reservations = () => {
  const [collection, setCollection] = useState([]);
  const [cols, setCols] = useState([]);
  const [type, setType] = useState("flights");
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);

  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const columns = {
    bookings: [
      {
        field: "code",
        header: "CODE",
        isSortable: false,
      },
      {
        field: "staff",
        header: "REQUISITOR",
        isSortable: true,
      },
      {
        field: "budget_code",
        header: "BUDGET",
        isSortable: false,
      },
      {
        field: "start",
        header: "BEGIN",
        isSortable: true,
      },
      {
        field: "finish",
        header: "END",
        isSortable: true,
      },
      {
        field: "status",
        header: "STATUS",
        isSortable: false,
      },
    ],
    reservations: [
      {
        field: "code",
        header: "CODE",
        isSortable: false,
      },
      {
        field: "staff",
        header: "REQUISITOR",
        isSortable: false,
      },
      {
        field: "request_type",
        header: "TYPE",
        isSortable: false,
      },
      {
        field: "begin",
        header: "BEGIN",
        isSortable: true,
      },
      {
        field: "elapse",
        header: "END",
        isSortable: true,
      },
      {
        field: "status",
        header: "STATUS",
        isSortable: false,
      },
    ],
  };

  const handleAction = () => {
    navigate("/operations/make/reservation");
  };

  const manage = (item) => {
    console.log(item);
  };

  useEffect(() => {
    switch (type) {
      case "bookings":
        setCollection(bookings);
        setCols(columns.bookings);
        break;

      case "hotels":
        setCollection(hotels);
        setCols(columns.reservations);
        break;

      default:
        setCollection(flights);
        setCols(columns.reservations);
        break;
    }
  }, [type]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      axios
        .get("operations")
        .then((res) => {
          const response = res.data.data;
          const { bookings, flights, hotels } = response;
          setBookings(bookings);
          setFlights(flights);
          setHotels(hotels);
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

  // console.log(collection);

  return (
    <>
      <div className="row">
        <PageHeader
          text="Reservations"
          btnText="Make Reservation"
          handleClick={handleAction}
        />

        <div className="col-md-12 mt-1 mb-2">
          <div className="cs__btn__tabs">
            <button
              type="button"
              className={`cs__tabs__btn ${type === "flights" && "cs__active"}`}
              onClick={() => setType("flights")}
            >
              <span className="material-icons-sharp">airlines</span>
              <p>Flights</p>
            </button>
            <button
              type="button"
              className={`cs__tabs__btn ${type === "hotels" && "cs__active"}`}
              onClick={() => setType("hotels")}
            >
              <span className="material-icons-sharp">bed</span>
              <p>Hotel</p>
            </button>
            <button
              type="button"
              className={`cs__tabs__btn ${type === "bookings" && "cs__active"}`}
              onClick={() => setType("bookings")}
            >
              <span className="material-icons-sharp">meeting_room</span>
              <p>Meeting Room</p>
            </button>
          </div>
        </div>

        <div className="col-md-12">
          <CSDatatable
            columns={cols}
            data={collection}
            isSearchable
            manage={manage}
            exportable
            cols={cols}
          />
        </div>
      </div>
    </>
  );
};

export default Reservations;
