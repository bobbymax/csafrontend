import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import PageHeader from "../../layouts/includes/PageHeader";
import CSDatatable from "../../layouts/components/tables/CSDatatable";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AuthProvider";
import Alert from "../../services/alert";

const Reservations = () => {
  const [collection, setCollection] = useState([]);
  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth } = useAppContext();

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

  const manage = (raw) => {
    navigate("/logistics/manage/reservations", {
      state: {
        data: raw,
      },
    });
  };

  const confirmAndClose = (raw) => {
    const body = {
      status: "confirmed",
    };

    Alert.flash(
      "Confirm Booking?",
      "info",
      "You will not be able to reverse this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          axios
            .patch(`status/logisticsRequests/${raw?.id}`, body)
            .then((res) => {
              const response = res.data;

              setCollection(
                collection.map((collect) => {
                  if (collect.id === response.data.id) {
                    return response.data;
                  }

                  return collect;
                })
              );

              Alert.success("Comfirmed!!", response.message);
            })
            .catch((err) => console.error(err.message));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  useEffect(() => {
    if (auth !== null) {
      let isMounted = true;
      const controller = new AbortController();
      try {
        axios
          .get("pending/reservations")
          .then((res) => {
            const response = res.data.data;
            setCollection(
              response.filter((req) =>
                req?.attributes?.task?.assignees?.includes(
                  parseInt(auth?.user?.id)
                )
              )
            );
          })
          .catch((er) => console.error(er.message));
      } catch (err) {
        console.error(err);
      }
      return () => {
        isMounted = false;
        controller.abort();
      };
    }
  }, [auth]);

  return (
    <>
      <div className="row">
        <PageHeader text="Flight & Hotel Booking Requests" />

        <div className="col-md-12">
          <CSDatatable
            columns={columns}
            cols={columns}
            data={collection}
            isSearchable
            manage={manage}
            confirmBooking={confirmAndClose}
            exportable
          />
        </div>
      </div>
    </>
  );
};

export default Reservations;
