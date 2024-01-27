import { useNavigate } from "react-router-dom";
import Alert from "../../../services/alert";
import {
  useFetchCollection,
  useFetchDependencies,
} from "../../../hooks/kernal";
import CollectionPage from "../../../layouts/components/partials/CollectionPage";

const MakeRequisition = () => {
  const navigate = useNavigate();

  const { iterable, updateIterable, destroySelectedData } =
    useFetchCollection("requisitions");

  const params = [
    {
      name: "locations",
      url: "locations",
    },
    {
      name: "stocks",
      url: "stocks",
    },
    {
      name: "items",
      url: "items",
    },
  ];

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

  const dependencies = useFetchDependencies(params);

  const destroy = (data) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You will not be able to reverse this!!"
    ).then(async (result) => {
      if (result.isConfirmed) {
        const response = await destroySelectedData(data?.id);
        console.log(response);
        updateIterable(data, "delete");
        Alert.success("Deleted!!", response.message);
      }
    });
  };

  return (
    <CollectionPage
      name="Requisitions"
      btnText="Make Requisition"
      clicakble={() =>
        navigate("/requests/make/requisition", {
          state: {
            dependencies,
            data: undefined,
            action: "store",
          },
        })
      }
      columns={columns}
      data={iterable}
      isSearchable
      bodyTemplate={() =>
        navigate("/requests/update/requisition", {
          state: {
            dependencies,
            data: raw,
            action: "alter",
          },
        })
      }
      destroy={destroy}
    />
  );
};

export default MakeRequisition;
