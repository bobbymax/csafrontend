import { useState } from "react";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";
import CSButton from "../../../layouts/components/forms/CSButton";

const StockCategoriesSection = ({
  columns = [],
  collection = [],
  handleSubmit = undefined,
  inventoryCategories = [],
  loading = false,
}) => {
  const initialStockCategoriesState = {
    id: 0,
    name: "",
    inventory_category_id: 0,
  };

  const [stockCategoriesState, setStockCategoriesState] = useState(
    initialStockCategoriesState
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryUpdating, setIsCategoryUpdating] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...stockCategoriesState,
    };

    try {
      handleSubmit(
        "stockCategories",
        body,
        isCategoryUpdating ? "alter" : "store",
        stockCategoriesState.id
      );
      reset();
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const manage = (raw) => {
    setStockCategoriesState({
      ...stockCategoriesState,
      id: raw?.id,
      name: raw?.name,
      inventory_category_id: raw?.inventory_category_id,
    });

    setIsCategoryUpdating(true);
  };

  const reset = () => {
    setIsLoading(false);
    setIsCategoryUpdating(false);
    setStockCategoriesState(initialStockCategoriesState);
  };

  return (
    <div className="row">
      <div className="col-md-5">
        <CSForm
          txtHeader={`${isCategoryUpdating ? "Update" : "Add"} Stock Category`}
          lg={12}
          md={12}
          formSubmit={handleFormSubmit}
        >
          <div className="col-md-12 mb-3">
            <CSSelect
              label="Inventory Category"
              id="inventory_category_id"
              value={stockCategoriesState.inventory_category_id}
              onChange={(e) =>
                setStockCategoriesState({
                  ...stockCategoriesState,
                  inventory_category_id: e.target.value,
                })
              }
            >
              <CSSelectOptions value={0} label="Select Parent" disabled />

              {inventoryCategories?.length > 0 &&
                inventoryCategories?.map((cat, i) => (
                  <CSSelectOptions key={i} value={cat?.id} label={cat?.name} />
                ))}
            </CSSelect>
          </div>

          <div className="col-md-12 mb-5">
            <CSInput
              id="name"
              label="Name"
              placeholder="Enter Category Name"
              value={stockCategoriesState.name}
              onChange={(e) =>
                setStockCategoriesState({
                  ...stockCategoriesState,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="col-md-12">
            <CSButton
              text={`${isCategoryUpdating ? "Update" : "Create"} Category`}
              type="submit"
              variant={`${isCategoryUpdating ? "dark" : "primary"}`}
              icon="send"
              size="lg"
              isLoading={isLoading || loading}
              block
              disabled={
                stockCategoriesState.name === "" ||
                stockCategoriesState.inventory_category_id === 0
              }
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

export default StockCategoriesSection;
