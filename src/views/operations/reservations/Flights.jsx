import { useEffect, useState } from "react";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";
import PageHeader from "../../../layouts/includes/PageHeader";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Alert from "../../../services/alert";

const Flights = () => {
  const [collection, setCollection] = useState([]);
  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const columns = [
    {
      field: "take_off",
      header: "Take Off",
      isSortable: true,
    },
    {
      field: "destination",
      header: "Destination",
      isSortable: true,
    },
    {
      field: "begin",
      header: "Departure",
      isSortable: false,
    },
    {
      field: "elapse",
      header: "Return",
      isSortable: false,
    },
    {
      field: "flight_type",
      header: "Type",
      isSortable: true,
    },
    {
      field: "attributes.count",
      header: "Itineraries",
      isSortable: false,
    },
  ];

  const manage = (raw) => {
    if (raw.stage === "review" || raw.stage === "selected") {
      navigate("/requests/reservation/details", {
        state: {
          data: raw,
        },
      });
    } else {
      Alert.warning("Denied!!", "This booking has not been treated");
    }
  };

  useEffect(() => {
    try {
      axios
        .get("reservations")
        .then((res) => {
          const response = res.data.data;

          setCollection(response.filter((data) => data.type === "flight"));
        })
        .catch((err) => console.error(err.message));
    } catch (error) {
      console.error(error);
    }
  }, []);

  //   console.log(collection);

  return (
    <>
      <div className="row">
        <PageHeader text="Flight Reservations" icon="airlines" />

        <div className="col-md-12">
          <CSDatatable
            columns={columns}
            cols={columns}
            data={collection}
            isSearchable
            view={manage}
            exportable
          />
        </div>
      </div>
    </>
  );
};

export default Flights;
