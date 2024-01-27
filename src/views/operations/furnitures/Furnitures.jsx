import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";
import Alert from "../../../services/alert";

const Furnitures = () => {
  const [collection, setCollection] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const columns = [
    {
      field: "code",
      header: "Code",
      isSortable: false,
    },
    {
      field: "type",
      header: "Type",
      isSortable: true,
    },
    {
      field: "attributes.location",
      header: "Location",
      isSortable: true,
    },
    {
      field: "created_at",
      header: "Raised At",
      isSortable: false,
    },
    {
      field: "status",
      header: "Status",
      isSortable: false,
    },
  ];

  const manage = (raw) => {
    console.log(raw);

    if (raw?.status === "resolved") {
      Alert.warning("Already Closed", "You have closed this request already");
    } else {
      Alert.flash(
        "Are you sure?",
        "info",
        "You are about to close this request"
      ).then((result) => {
        if (result.isConfirmed) {
          const body = {
            user_id: raw?.user_id,
            location_id: raw?.location_id,
            description: raw?.description,
            type: raw?.type,
            status: "resolved",
          };

          try {
            setIsLoading(true);

            axios
              .patch(`furnitureRequests/${raw?.id}`, body)
              .then((res) => {
                const response = res.data;

                setCollection(
                  collection.map((furniture) => {
                    if (furniture.id === response.data.id) {
                      return response.data.id;
                    }
                    return furniture;
                  })
                );

                Alert.success("Closed!!", response.message);
              })
              .catch((err) => comsole.error(err.message));

            setIsLoading(false);
          } catch (error) {
            console.error(error);
          }
        }
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      const urls = ["furnitureRequests"];

      const requests = urls.map((url) => axios.get(url));

      Promise.all(requests)
        .then((responses) => {
          setCollection(responses[0].data?.data);
        })
        .catch((err) => console.error(err));
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
          text="Furniture Requests"
          icon="bed"
          btnText="Make Furniture Request"
          handleClick={() => navigate("/requests/furnitures/manage")}
        />

        <div className="col-md-12">
          <CSDatatable
            columns={columns}
            cols={columns}
            data={collection}
            isSearchable
            close={manage}
            exportable
          />
        </div>
      </div>
    </>
  );
};

export default Furnitures;
