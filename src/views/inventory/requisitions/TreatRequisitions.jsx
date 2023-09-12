import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useAppContext } from "../../../context/AuthProvider";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";

const TreatRequisitions = () => {
  const [collection, setCollection] = useState([]);
  const [dependencies, setDependencies] = useState({});

  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth } = useAppContext();

  const columns = [
    {
      field: "code",
      header: "Request Code",
      isSortable: true,
    },
    {
      field: "type",
      header: "Type",
    },
    {
      field: "department_name",
      header: "Department",
    },
    {
      field: "request_type",
      header: "Request Type",
    },
    {
      field: "status",
      header: "Status",
    },
  ];

  const manage = (raw) => {
    navigate(`/inventory/treat/requisition/${raw.code}`, {
      state: {
        data: raw,
        items: dependencies?.items,
      },
    });
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      const urls = ["handle/requisitions", "items"];

      const requests = urls.map((url) => axios.get(url));

      Promise.all(requests)
        .then((responses) => {
          const reqs = responses[0].data?.data;

          setCollection(
            reqs.filter((req) =>
              req?.attributes?.task?.assignees?.includes(
                parseInt(auth?.user?.id)
              )
            )
          );

          setDependencies({
            items: responses[1].data?.data,
          });
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

  // console.log(`Items:`, dependencies);

  return (
    <>
      <div className="row">
        <PageHeader text="Treat Requisitions" />
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

export default TreatRequisitions;
