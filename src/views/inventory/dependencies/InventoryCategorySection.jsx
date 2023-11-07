import { useState } from "react";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSBox from "../../../layouts/components/forms/CSBox";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";
import CSButton from "../../../layouts/components/forms/CSButton";

const InventoryCategorySection = ({
  columns = [],
  collection = [],
  handleSubmit = undefined,
  departments = [],
  loading = false,
}) => {
  const initialInventoryCategoryState = {
    id: 0,
    name: "",
    departments: [],
  };

  const [inventoryCategoryState, setInventoryCategoryState] = useState(
    initialInventoryCategoryState
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryUpdating, setIsCategoryUpdating] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...inventoryCategoryState,
    };

    try {
      handleSubmit(
        "inventoryCategories",
        body,
        isCategoryUpdating ? "alter" : "store",
        inventoryCategoryState.id
      );
      reset();
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleChecked = (e, dept) => {
    let deps = [];
    const isChecked = e.target.checked;

    if (isChecked) {
      deps.push(dept?.id);

      setInventoryCategoryState({
        ...inventoryCategoryState,
        departments: [...deps, ...inventoryCategoryState.departments],
      });
    } else {
      if (inventoryCategoryState.departments.includes(dept?.id)) {
        setInventoryCategoryState({
          ...inventoryCategoryState,
          departments: inventoryCategoryState.departments?.filter(
            (deptID) => deptID !== dept?.id
          ),
        });
      }
    }
  };

  const manage = (raw) => {
    setInventoryCategoryState({
      ...inventoryCategoryState,
      id: raw?.id,
      name: raw?.name,
      departments: raw?.departments,
    });

    setIsCategoryUpdating(true);
  };

  const reset = () => {
    setIsLoading(false);
    setIsCategoryUpdating(false);
    setInventoryCategoryState(initialInventoryCategoryState);
  };

  return (
    <div className="row">
      <div className="col-md-5">
        <CSForm
          txtHeader={
            isCategoryUpdating
              ? "Update Inventory Category"
              : "Add Inventory Category"
          }
          lg={12}
          md={12}
          formSubmit={handleFormSubmit}
        >
          <div className="col-md-12 mb-5">
            <CSInput
              id="name"
              label="Name"
              placeholder="Enter Category Name"
              value={inventoryCategoryState.name}
              onChange={(e) =>
                setInventoryCategoryState({
                  ...inventoryCategoryState,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="col-md-12 mb-4">
            <div className="panel">
              <div className="row">
                {departments?.length > 0 &&
                  departments.map((dept) => (
                    <div className="col-md-4" key={dept?.id}>
                      <CSBox
                        label={dept?.code}
                        id={dept?.code}
                        value={dept?.id}
                        onChange={(e) => handleChecked(e, dept)}
                        checked={inventoryCategoryState.departments?.includes(
                          dept?.id
                        )}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <CSButton
              text={isCategoryUpdating ? "Update Category" : "Submit"}
              type="submit"
              variant="primary"
              icon="send"
              size="lg"
              isLoading={isLoading || loading}
              block
              disabled={inventoryCategoryState.name === ""}
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

export default InventoryCategorySection;
