import { useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import * as XLSX from "xlsx";
import { getExtension, convertToJson } from "../../../services/helpers";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSButton from "../../../layouts/components/forms/CSButton";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";
import Alert from "../../../services/alert";

const Imports = () => {
  const initialState = {
    category: "",
    data: [],
  };

  const axios = useAxiosPrivate();

  const [state, setState] = useState(initialState);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileUpload, setFileUpload] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      category: state.category,
      data,
    };

    try {
      axios
        .post("imports", body)
        .then((res) => {
          const response = res.data;
          console.log(response.data);
          Alert.success("Imported!!", response.message);
          setState(initialState);
        })
        .catch((err) => {
          console.error(err.message);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];

    setFileUpload(e.target.value);

    const reader = new FileReader();

    reader.onload = (event) => {
      const bstr = event.target.result;
      const workBook = XLSX.read(bstr, { type: "binary" });

      // get first sheet
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];

      // convert to array
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      const headers = fileData[0];
      const heads = headers.map((head) => ({ header: head, field: head }));
      setColumns(heads);

      fileData.splice(0, 1);
      setData(convertToJson(headers, fileData));
    };

    if (file) {
      if (getExtension(file)) {
        reader.readAsBinaryString(file);
      } else {
        alert("Invalid file input, Select Excel or CSV file");
      }
    } else {
      setData([]);
      setColumns([]);
    }
  };

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <PageHeader text="Import Dependencies" />
          <CSForm lg={12} md={12} noHeader formSubmit={handleSubmit}>
            <div className="col-md-12 mb-3">
              <CSSelect
                name="category"
                label="Category"
                value={state.category}
                onChange={(e) =>
                  setState({ ...state, category: e.target.value })
                }
              >
                <CSSelectOptions label="Select Category" value="" disabled />

                {[
                  { key: "applications", label: "Applications" },
                  { key: "modules", label: "Modules" },
                  { key: "products", label: "Products" },
                ].map((cat, i) => (
                  <CSSelectOptions key={i} label={cat.label} value={cat.key} />
                ))}
              </CSSelect>
            </div>
            <div className="col-md-12 mb-4">
              <CSInput
                label="Upload Data"
                type="file"
                value={fileUpload}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-12">
              <CSButton
                text="Submit"
                type="submit"
                variant="primary"
                icon="send"
                size="lg"
                isLoading={isLoading}
                block
                disabled={state.category === "" || fileUpload === ""}
              />
            </div>
          </CSForm>
        </div>
      </div>

      {data?.length > 0 && (
        <div className="row">
          <div className="col-md-12 mt-4">
            <CSDatatable columns={columns} data={data} isSearchable />
          </div>
        </div>
      )}
    </>
  );
};

export default Imports;
