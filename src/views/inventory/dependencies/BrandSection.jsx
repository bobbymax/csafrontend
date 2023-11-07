import { useState } from "react";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSButton from "../../../layouts/components/forms/CSButton";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";

const BrandSection = ({
  columns = [],
  collection = [],
  handleSubmit = undefined,
  loading = false,
}) => {
  const brandInitialState = {
    id: 0,
    name: "",
  };

  const [brandState, setBrandState] = useState(brandInitialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...brandState,
    };

    try {
      handleSubmit(
        "brands",
        body,
        isUpdating ? "alter" : "store",
        brandState.id
      );
      reset();
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const manage = (raw) => {
    setBrandState({
      ...brandState,
      id: raw?.id,
      name: raw?.name,
    });

    setIsUpdating(true);
  };

  const reset = () => {
    setIsLoading(false);
    setIsUpdating(false);
    setBrandState(brandInitialState);
  };

  return (
    <div className="row">
      <div className="col-md-5">
        <CSForm
          txtHeader={isUpdating ? "Update Brand" : "Add Brand"}
          lg={12}
          md={12}
          formSubmit={handleFormSubmit}
        >
          <div className="col-md-12 mb-5">
            <CSInput
              id="name"
              label="Name"
              placeholder="Enter Brand Name"
              value={brandState.name}
              onChange={(e) =>
                setBrandState({ ...brandState, name: e.target.value })
              }
            />
          </div>

          <div className="col-md-12">
            <CSButton
              text={isUpdating ? "Update Brand" : "Submit"}
              type="submit"
              variant="primary"
              icon="send"
              size="lg"
              isLoading={isLoading || loading}
              block
              disabled={brandState.name === ""}
            />
          </div>
        </CSForm>
      </div>
      <div className="col-md-7">
        <CSDatatable
          columns={columns}
          data={collection}
          isSearchable
          manage={manage}
          rowsPerPage={2}
        />
      </div>
    </div>
  );
};

export default BrandSection;
