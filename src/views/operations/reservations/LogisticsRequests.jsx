import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import PageHeader from "../../../layouts/includes/PageHeader";
import { useNavigate } from "react-router-dom";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";

const LogisticsRequests = () => {
  const [collection, setCollection] = useState([]);

  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const columns = [
    {
      field: "code",
      header: "CODE",
      isSortable: false,
    },
    {
      field: "attributes.requisitor.name",
      header: "REQUISITOR",
      isSortable: true,
    },
    {
      field: "budget_code",
      header: "BUDGET",
      isSortable: false,
    },
    {
      field: "description",
      header: "PURPOSE",
      isSortable: true,
    },
    {
      field: "status",
      header: "STATUS",
      isSortable: false,
    },
  ];

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    try {
      axios
        .get("logisticsRequests")
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

  //   console.log(collection);

  return (
    <>
      <div className="row">
        <PageHeader
          text="Reservations"
          btnText="Make a Reservation"
          handleClick={() => navigate("/requests/reserve/booking")}
        />

        <div className="col-md-12">
          <CSDatatable
            columns={columns}
            cols={columns}
            data={collection}
            isSearchable
            exportable
          />
        </div>
      </div>
    </>
  );
};

export default LogisticsRequests;
