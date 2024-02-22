import { useState } from "react";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";
import CUVehicleRequest from "./CUVehicleRequest";
import Alert from "../../../services/alert";
import {
  useFetchCollection,
  useFetchDependencies,
} from "../../../hooks/kernal";

const VehicleRequest = () => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const params = [
    { name: "users", url: "users" },
    { name: "stockTypes", url: "stockTypes" },
    { name: "locations", url: "locations" },
  ];

  const { iterable, updateIterable, destroySelectedData } =
    useFetchCollection("vehicleRequests");

  const dependencies = useFetchDependencies(params);

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setData(undefined);
  };

  const manage = (raw) => {
    setData(raw);
    setIsUpdating(true);
    setShow(true);
  };

  const destroy = (data) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You will not be able to reverse this!!"
    ).then(async (result) => {
      if (result.isConfirmed) {
        const response = await destroySelectedData(data?.id);
        updateIterable(data, "delete");
        Alert.success("Deleted!!", response.message);
      }
    });
  };

  //   console.log(iterable);

  const handleSubmit = (response) => {
    updateIterable(response?.data, response?.action);
    Alert.success(response?.status, response?.message);
    handleClose();
  };

  return (
    <>
      <CUVehicleRequest
        title="Create a New Request"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
        dependencies={dependencies}
      />
      <div className="row">
        <PageHeader
          text="Vehicle Requests"
          btnText="Create a New Request"
          handleClick={() => setShow(true)}
        />
        <div className="col-md-12">
          <CSDatatable
            columns={columns}
            data={iterable}
            isSearchable
            manage={manage}
            destroy={destroy}
          />
        </div>
      </div>
    </>
  );
};

export default VehicleRequest;
