import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";

const StockItems = () => {
  const [collection, setCollection] = useState([]);
  const [dependencies, setDependencies] = useState({});

  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const columns = [
    {
      field: "name",
      header: "Name",
      isSortable: true,
    },
    {
      field: "code",
      header: "Code",
    },
    {
      field: "brand",
      header: "Brand",
    },
    {
      field: "type",
      header: "Type",
      isSortable: true,
    },
    {
      field: "department",
      header: "Owner",
      isSortable: true,
    },
    {
      field: "quantity",
      header: "Quantity",
    },
  ];

  const manage = (raw) => {
    navigate("/inventory/stock/items/update", {
      state: {
        dependencies,
        data: raw,
        action: "alter",
      },
    });
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      const urls = ["items", "stocks", "locations", "companies"];

      const requests = urls.map((url) => axios.get(url));

      Promise.all(requests)
        .then((responses) => {
          setCollection(responses[0].data?.data);
          setDependencies({
            stocks: responses[1].data?.data,
            locations: responses[2].data?.data,
            vendors: responses[3].data?.data,
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

  return (
    <>
      <div className="row">
        <PageHeader
          text="Stock Items"
          btnText="Add Stock Item"
          handleClick={() =>
            navigate("/inventory/stock/items/add", {
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
            manage={manage}
          />
        </div>
      </div>
    </>
  );
};

export default StockItems;
