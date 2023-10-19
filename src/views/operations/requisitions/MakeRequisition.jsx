import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";
import Alert from "../../../services/alert";

const MakeRequisition = () => {
  const [collection, setCollection] = useState([]);
  const [dependencies, setDependencies] = useState({});

  const axios = useAxiosPrivate();
  const navigate = useNavigate();

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
      field: "request_type",
      header: "Request Type",
    },
    {
      field: "status",
      header: "Status",
    },
  ];

  const viewRequisition = (raw) => {
    navigate("/requests/update/requisition", {
      state: {
        dependencies,
        data: raw,
        action: "alter",
      },
    });
  };

  const destroy = (data) => {
    //
    Alert.flash(
      "Are you sure?",
      "warning",
      "You will not be able to reverse this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          axios
            .delete(`requisitions/${data?.id}`)
            .then((res) => {
              const response = res.data;
              setCollection(collection.filter((coll) => coll.id !== data.id));
              Alert.success("Deleted!!", response.message);
            })
            .catch((err) => {
              Alert.error("Oops!!", "Something went wrong");
              console.error(err.message);
            });
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      const urls = ["requisitions", "locations", "stocks", "items"];

      const requests = urls.map((url) => axios.get(url));

      Promise.all(requests)
        .then((responses) => {
          setCollection(responses[0].data?.data);
          setDependencies({
            locations: responses[1].data?.data,
            stocks: responses[2].data?.data,
            items: responses[3].data?.data,
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

  // console.log(collection);

  return (
    <>
      <div className="row">
        <PageHeader
          text="Requisitions"
          btnText="Make Requisition"
          handleClick={() =>
            navigate("/requests/make/requisition", {
              state: {
                dependencies,
                data: undefined,
                action: "store",
              },
            })
          }
        />
        <div className="col-md-12">
          <CSDatatable
            columns={columns}
            data={collection}
            isSearchable
            view={viewRequisition}
            destroy={destroy}
          />
        </div>
      </div>
    </>
  );
};

export default MakeRequisition;
