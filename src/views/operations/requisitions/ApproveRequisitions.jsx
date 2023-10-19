import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";
import Alert from "../../../services/alert";

const ApproveRequisitions = () => {
  const [collection, setCollection] = useState([]);

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

  const approve = (raw) => {
    const body = {
      status: "registered",
    };

    try {
      axios
        .patch(`alter/requisitions/${raw?.id}`, body)
        .then((res) => {
          const response = res.data;
          setRequisition(response.data);
          Alert.success("Updated!!", response.message);
          handleClose();
        })
        .catch((err) => {
          handleClose();
          console.error(err.message);
        });
    } catch (error) {
      console.error(error);
    }
    Alert.success("Done!!", "done");
  };

  const viewReq = (req) => {
    console.log(req);

    navigate("/requests/view/requisition", {
      state: {
        data: req,
      },
    });

    // /requests/view/requisition
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      axios
        .get("approve/requisitions")
        .then((res) => {
          setCollection(res.data.data);
        })
        .catch((err) => {
          console.error(err.message);
        });
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
        <PageHeader text="Pending Requisitions" />
        <div className="col-md-12">
          <CSDatatable
            columns={columns}
            data={collection}
            isSearchable
            view={viewReq}
          />
        </div>
      </div>
    </>
  );
};

export default ApproveRequisitions;
