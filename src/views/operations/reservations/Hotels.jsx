import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";

const Hotels = () => {
  const [collection, setCollection] = useState([]);
  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const columns = [
    {
      field: "destination",
      header: "Hotel Name",
      isSortable: true,
    },
    {
      field: "begin",
      header: "Check In",
      isSortable: false,
    },
    {
      field: "elapse",
      header: "Check Out",
      isSortable: false,
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

          setCollection(response.filter((data) => data.type === "hotel"));
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
        <PageHeader text="Hotel Bookings" icon="bed" />

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

export default Hotels;
