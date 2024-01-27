import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AuthProvider";
import { useEffect, useState } from "react";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const FurnitureRequests = () => {
  const { auth } = useAppContext();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();

  const [collection, setCollection] = useState([]);

  const columns = [
    {
      field: "code",
      header: "Code",
      isSortable: false,
    },
    {
      field: "attributes.staff.name",
      header: "Name",
      isSortable: true,
    },
    {
      field: "attributes.location",
      header: "Location",
      isSortable: true,
    },
    {
      field: "description",
      header: "Description",
      isSortable: false,
    },
    {
      field: "type",
      header: "Type",
      isSortable: true,
    },
    {
      field: "created_at",
      header: "Raised At",
      isSortable: true,
    },
    {
      field: "status",
      header: "Status",
      isSortable: true,
    },
  ];

  const manage = (raw) => {
    navigate("/inventory/manage/furniture/requests", {
      state: {
        furniture: raw,
      },
    });
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      axios
        .get("manage/furniture/requests")
        .then((res) => {
          const response = res.data.data;

          setCollection(
            response.filter((req) =>
              req?.attributes?.task?.assignees?.includes(auth?.user?.id)
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

  // console.log(collection);

  return (
    <>
      <div className="row">
        <PageHeader text="Furniture Request" icon="living" />

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

export default FurnitureRequests;
