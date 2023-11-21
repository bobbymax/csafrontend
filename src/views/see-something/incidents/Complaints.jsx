import { useEffect, useState } from "react";
import PageHeader from "../../../layouts/includes/PageHeader";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useAppContext } from "../../../context/AuthProvider";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";
import { useNavigate } from "react-router-dom";
import Alert from "../../../services/alert";

const Complaints = () => {
  const [collection, setCollection] = useState([]);

  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth } = useAppContext();

  const columns = [
    {
      field: "code",
      header: "Code",
      isSortable: false,
    },
    {
      field: "attributes.staff.name",
      header: "Staff",
      isSortable: false,
    },
    {
      field: "office_number",
      header: "Closet Landmark",
      isSortable: true,
    },
    {
      field: "attributes.location",
      header: "Location",
      isSortable: true,
    },
    {
      field: "attributes.issue.name",
      header: "Issue",
      isSortable: true,
    },
    {
      field: "description",
      header: "Description",
      isSortable: true,
    },
    {
      field: "status",
      header: "Status",
      isSortable: true,
    },
  ];

  const manage = (raw) => {
    console.log(raw);
    if (
      raw?.status === "escalated" &&
      parseInt(raw?.support_id) !== parseInt(auth?.user?.id)
    ) {
      Alert.warning("Denied!!", "You can no longer work on this task!!");
    } else {
      navigate("/helpdesk/manage/complaint", {
        state: {
          complaint: raw,
        },
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      const urls = ["complaints"];

      const requests = urls.map((url) => axios.get(url));

      Promise.all(requests)
        .then((responses) => {
          const incidents = responses[0].data?.data;
          setCollection(
            incidents.filter((incident) =>
              incident?.attributes?.task?.assignees?.includes(
                parseInt(auth?.user?.id)
              )
            )
          );
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
      <PageHeader text="Complaints" icon="support" />

      <div className="col-md-12">
        <CSDatatable
          columns={columns}
          data={collection}
          isSearchable
          manage={manage}
        />
      </div>
    </>
  );
};

export default Complaints;
