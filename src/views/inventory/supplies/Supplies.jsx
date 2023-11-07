import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";
import { useNavigate } from "react-router-dom";

const Supplies = () => {
  const [invoices, setInvoices] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [vendors, setVendors] = useState([]);

  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const columns = [
    {
      field: "attributes.vendor.name",
      header: "Vendor",
      isSortable: true,
    },
    {
      field: "delivery_date",
      header: "Delivery Date",
      isSortable: false,
    },
    {
      field: "code",
      header: "MRV code",
      isSortable: false,
    },
    {
      field: "amount",
      header: "Amount",
      isSortable: false,
    },
    {
      field: "status",
      header: "Status",
      isSortable: true,
    },
  ];

  const generate = () => {
    navigate("/inventory/generate/mrv", {
      state: {
        stocks,
        vendors,
      },
    });
  };

  const printMrv = (raw) => {
    navigate("/inventory/mrv/print", {
      state: {
        supply: raw,
      },
    });
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      const urls = ["purchaseInvoices", "stocks", "companies"];

      const requests = urls.map((url) => axios.get(url));

      Promise.all(requests)
        .then((responses) => {
          setInvoices(responses[0].data?.data);
          setStocks(responses[1].data.data);
          setVendors(responses[2].data.data);
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
          text="Supplies"
          icon="article"
          btnIcon="print"
          btnText="Generate MRV"
          handleClick={generate}
        />

        <div className="col-md-12">
          <CSDatatable
            columns={columns}
            data={invoices}
            isSearchable
            print={printMrv}
          />
        </div>
      </div>
    </>
  );
};

export default Supplies;
