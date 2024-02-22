import { useEffect, useState } from "react";
import { useFetchCollection } from "../../../hooks/kernal";
import { useAppContext } from "../../../context/AuthProvider";
import PageHeader from "../../../layouts/includes/PageHeader";

const VehicleRequestsReceived = () => {
  const { iterable, updateIterable } = useFetchCollection("vehicleRequests");
  const { auth } = useAppContext();

  const [collection, setCollection] = useState([]);

  const columns = [
    {
      field: "attributes.staff.name",
      header: "User",
      isSortable: true,
    },
    {
      field: "destination",
      header: "Destination",
      isSortable: true,
    },
    {
      field: "attributes.stock_type",
      header: "Product Type",
      isSortable: true,
    },
    {
      field: "required_date",
      header: "Date Required",
      isSortable: true,
    },
    {
      field: "return_date",
      header: "Return Date",
      isSortable: true,
    },
    {
      field: "duration",
      header: "No of Days",
      // isSortable: true,
    },
  ];

  useEffect(() => {
    if (iterable?.length > 0) {
      const filtered = iterable.filter((req) => {
        const isAssignedToAuth = !req?.attributes?.task?.assignees?.includes(
          auth?.user?.id
        );
        return isAssignedToAuth;
      });
      setCollection(filtered);
    }
  }, [iterable]);

  console.log(collection);

  return (
    <>
      <div className="row">
        <PageHeader text="Pending Vehicle Requests" />

        <div className="col-md-12">
          <div className="row">
            <div className="col-md-4">
              <div className="vehicle-request__cards">
                <article></article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleRequestsReceived;
