import { useState } from "react";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";
import PageHeader from "../../../layouts/includes/PageHeader";
import Alert from "../../../services/alert";
import CUModules from "./CUModules";
import {
  useFetchCollection,
  useFetchDependencies,
} from "../../../hooks/kernal";

const Modules = () => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const { iterable, updateIterable } = useFetchCollection("modules");

  const params = [
    {
      name: "applications",
      url: "applications",
    },
    {
      name: "departments",
      url: "departments",
    },
    {
      name: "groups",
      url: "groups",
    },
  ];

  const dependencies = useFetchDependencies(params);

  const columns = [
    {
      field: "name",
      header: "NAME",
      isSortable: true,
    },
    {
      field: "code",
      header: "ABV",
      isSortable: false,
    },
    {
      field: "path",
      header: "URL",
      isSortable: false,
    },
  ];

  const cols = [
    ...columns,
    {
      field: "application",
      header: "Application",
    },
    {
      field: "icon",
      header: "Icon",
    },
  ];

  const handleSubmit = (response) => {
    updateIterable(response?.data, response?.action);
    Alert.success(response?.status, response?.message);
    handleClose();
  };

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

  return (
    <>
      <CUModules
        title="Add Module"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
        dependencies={{ ...dependencies }}
      />
      <div className="row">
        <PageHeader
          text="Modules"
          btnText="Create Module"
          handleClick={() => setShow(true)}
        />
        <div className="col-md-12">
          <CSDatatable
            columns={columns}
            cols={cols}
            data={iterable}
            isSearchable
            manage={manage}
            exportable
          />
        </div>
      </div>
    </>
  );
};

export default Modules;
