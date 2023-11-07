import React, { useState } from "react";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSButton from "../../../layouts/components/forms/CSButton";
import CSDatatable from "../../../layouts/components/tables/CSDatatable";

const StockTypesSection = ({
  columns = [],
  collection = [],
  handleSubmit = undefined,
  stockCategories = [],
  loading = false,
}) => {
  const initialStockTypeState = {
    id: 0,
    name: "",
    stock_category_id: 0,
  };

  const [stockTypeState, setStockTypeState] = useState(initialStockTypeState);
  const [isLoading, setIsLoading] = useState(false);
  const [isStockUpdating, setIsStockUpdating] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...stockTypeState,
    };

    try {
      handleSubmit(
        "stockTypes",
        body,
        isStockUpdating ? "alter" : "store",
        stockTypeState.id
      );
      reset();
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const manage = (raw) => {
    setStockTypeState({
      ...stockTypeState,
      id: raw?.id,
      name: raw?.name,
      stock_category_id: raw?.stock_category_id,
    });

    setIsStockUpdating(true);
  };

  const reset = () => {
    setIsLoading(false);
    setIsStockUpdating(false);
    setStockTypeState(initialStockTypeState);
  };

  return (
    <div className="row">
      <div className="col-md-5">
        <CSForm
          txtHeader={`${isStockUpdating ? "Update" : "Add"} Stock Type`}
          lg={12}
          md={12}
          formSubmit={handleFormSubmit}
        >
          <div className="col-md-12 mb-3">
            <CSSelect
              label="Stock Category"
              id="stock_category_id"
              value={stockTypeState.stock_category_id}
              onChange={(e) =>
                setStockTypeState({
                  ...stockTypeState,
                  stock_category_id: e.target.value,
                })
              }
            >
              <CSSelectOptions value={0} label="Select Category" disabled />

              {stockCategories?.length > 0 &&
                stockCategories?.map((cat, i) => (
                  <CSSelectOptions key={i} value={cat?.id} label={cat?.name} />
                ))}
            </CSSelect>
          </div>

          <div className="col-md-12 mb-5">
            <CSInput
              id="name"
              label="Name"
              placeholder="Enter Category Name"
              value={stockTypeState.name}
              onChange={(e) =>
                setStockTypeState({
                  ...stockTypeState,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="col-md-12">
            <CSButton
              text={`${isStockUpdating ? "Update" : "Create"} Stock Type`}
              type="submit"
              variant={`${isStockUpdating ? "dark" : "primary"}`}
              icon="send"
              size="lg"
              isLoading={isLoading || loading}
              block
              disabled={
                stockTypeState.name === "" ||
                stockTypeState.stock_category_id === 0
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

export default StockTypesSection;
