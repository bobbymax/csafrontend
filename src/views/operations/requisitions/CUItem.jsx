import { useEffect, useState } from "react";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSButton from "../../../layouts/components/forms/CSButton";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { formatSelectOptions } from "../../../services/helpers";
import Modal from "../../../layouts/components/modals/Modal";

const CUItem = ({
  title = "",
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
  dependencies = undefined,
}) => {
  const initialState = {
    id: 0,
    stock_id: 0,
    item_id: 0,
    quantity_expected: 0,
    description: "",
    priority: "",
    title: "",
  };

  const [itemState, setItemState] = useState(initialState);
  const [stock, setStock] = useState(undefined);
  const [single, setSingle] = useState(undefined);
  const [items, setItems] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const animated = makeAnimated();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...itemState,
      action: isUpdating ? "alter" : "store",
      product_name: stock?.label,
    };

    handleSubmit(body);
    reset();
  };

  const handleModalClose = () => {
    reset();
    handleClose();
  };

  const reset = () => {
    setItemState(initialState);
    setIsLoading(false);
    setStock(undefined);
    setSingle(undefined);
    setSelectedItems([]);
  };

  useEffect(() => {
    if (single !== undefined && single?.raw) {
      const { raw } = single;

      setItemState({
        ...itemState,
        description: raw?.description,
        stock_id: stock?.value,
        item_id: single?.value,
      });
    }
  }, [single, stock]);

  useEffect(() => {
    if (stock !== undefined && items?.length > 0) {
      setSelectedItems(
        items?.filter((item) => item?.stock_id === parseInt(stock?.value))
      );
    }
  }, [stock, items]);

  useEffect(() => {
    if (data !== undefined && stocks?.length > 0 && items?.length > 0) {
      setItemState({
        ...itemState,
        stock_id: data.stock_id,
        item_id: data.item_id,
        quantity_expected: data.quantity_expected,
        priority: data.priority,
        description: data.description,
        title: data.title,
      });

      const stos = formatSelectOptions(stocks, "id", "name");
      const its = formatSelectOptions(items, "id", "name");

      setStock(
        stos.filter((st) => parseInt(st.value) === parseInt(data.stock_id))[0]
      );

      setSingle(
        its.filter((ite) => parseInt(ite.value) === parseInt(data.item_id))[0]
      );
    }
  }, [data, stocks, items]);

  useEffect(() => {
    if (
      dependencies !== undefined &&
      dependencies?.stocks &&
      dependencies?.items
    ) {
      //   setDepends(dependencies);
      setItems(dependencies?.items);
      setStocks(dependencies?.stocks);
    }
  }, [dependencies]);

  return (
    <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
      <CSForm
        txtHeader={title}
        lg={12}
        md={12}
        formSubmit={handleFormSubmit}
        noBorder
        noHeader
      >
        <div className="col-md-12 mb-3">
          <label className="cs__form-label">Stocks</label>
          <Select
            components={animated}
            options={formatSelectOptions(stocks, "id", "name")}
            placeholder="Select Stock"
            value={stock}
            onChange={setStock}
            isSearchable
          />
        </div>
        <div className="col-md-12 mb-3">
          <label className="cs__form-label">Items</label>
          <Select
            components={animated}
            options={formatSelectOptions(selectedItems, "id", "name")}
            placeholder="Select Item"
            value={single}
            onChange={setSingle}
            isDisabled={stock === undefined}
            isSearchable
          />
        </div>
        <div className="col-md-12 mb-3">
          <CSInput
            id="quantity"
            label="Quantity"
            type="number"
            value={itemState.quantity_expected}
            onChange={(e) =>
              setItemState({
                ...itemState,
                quantity_expected: parseInt(e.target.value),
              })
            }
          />
        </div>
        <div className="col-md-12 mb-3">
          <CSTextarea
            id="description"
            label="Description"
            rows={4}
            value={itemState.description}
            onChange={(e) =>
              setItemState({ ...itemState, description: e.target.value })
            }
            placeholder="Enter Item Description Here..."
            readOnly
          />
        </div>
        <div className="col-md-12 mb-5">
          <CSSelect
            label="Priority"
            id="priority"
            value={itemState.priority}
            onChange={(e) =>
              setItemState({ ...itemState, priority: e.target.value })
            }
          >
            <CSSelectOptions value="" label="Select Priority" disabled />

            {["low", "medium", "high"].map((prior, i) => (
              <CSSelectOptions
                key={i}
                value={prior}
                label={prior?.toUpperCase()}
              />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-12">
          <CSButton
            text="Add Item"
            type="submit"
            variant="primary"
            icon="plus"
            size="lg"
            isLoading={isLoading}
            block
            disabled={
              itemState.quantity_expected === 0 ||
              itemState.priority === "" ||
              stock === undefined ||
              single === undefined
            }
          />
        </div>
      </CSForm>
    </Modal>
  );
};

export default CUItem;
