import moment from "moment";
import { useEffect, useState } from "react";
import Modal from "../../../layouts/components/modals/Modal";
import CSForm from "../../../layouts/components/forms/CSForm";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { formatSelectOptions } from "../../../services/helpers";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import CSButton from "../../../layouts/components/forms/CSButton";

const InvoiceItem = ({
  title = "",
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
  itemsLength = 0,
  stocks = [],
}) => {
  const initialItemState = {
    id: 0,
    item_id: 0,
    quantity: 0,
    amount: 0,
    expiry_date: "",
    description: "",
    item_name: "",
  };

  const [itemState, setItemState] = useState(initialItemState);
  const [stock, setStock] = useState(null);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState(null);

  const animated = makeAnimated();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...itemState,
      stock,
      id: isUpdating ? itemState.id : itemsLength + 1,
    };

    handleSubmit({
      data: body,
      status: isUpdating ? "Updated" : "Added",
      action: isUpdating ? "alter" : "store",
      message: `Invoice Item has been ${
        isUpdating ? "updated" : "added"
      } successfully!`,
    });

    reset();
  };

  const handleModalClose = () => {
    reset();
    handleClose();
  };

  const reset = () => {
    setItemState(initialItemState);
    setStock(null);
    setItems([]);
    setItem(null);
  };

  useEffect(() => {
    if (stock !== null) {
      setItems(stock?.arr);
    }
  }, [stock]);

  useEffect(() => {
    if (item !== null) {
      setItemState({
        ...itemState,
        item_id: item.value,
        item_name: item.label,
        description: item?.raw?.description,
      });
    }
  }, [item]);

  //   console.log(stocks);

  useEffect(() => {
    if (data !== undefined) {
      setItemState({
        ...itemState,
        id: data.item_id,
        item_id: data.item_id,
        quantity: data.quantity,
        amount: data.amount,
        expiry_date: moment(data.expiry_date).format("YYYY-MM-DD"),
        description: data.description,
      });
    }
  }, [data]);

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
        <div className="col-md-12 mb-4">
          <label className="cs__form-label">Product</label>
          <Select
            components={animated}
            options={stocks}
            placeholder="Select Product"
            value={stock}
            onChange={setStock}
            isSearchable
          />
        </div>

        <div className="col-md-12 mb-4">
          <label className="cs__form-label">Item</label>
          <Select
            components={animated}
            options={formatSelectOptions(items, "id", "name")}
            placeholder="Select Item"
            value={item}
            isDisabled={items?.length < 1}
            onChange={setItem}
            isSearchable
          />
        </div>

        <div className="col-md-3 mb-4">
          <CSInput
            type="number"
            step="1"
            id="quantity"
            label="Quantity"
            placeholder="Enter Quantity"
            value={itemState.quantity}
            onChange={(e) =>
              setItemState({ ...itemState, quantity: parseInt(e.target.value) })
            }
          />
        </div>

        <div className="col-md-5 mb-4">
          <CSInput
            id="amount"
            label="Item Amount"
            placeholder="Enter Amount"
            value={itemState.amount}
            onChange={(e) =>
              setItemState({ ...itemState, amount: e.target.value })
            }
          />
        </div>
        <div className="col-md-4 mb-4">
          <CSInput
            id="expiry_date"
            type="date"
            label="Expiry Date"
            value={itemState.expiry_date}
            onChange={(e) =>
              setItemState({ ...itemState, expiry_date: e.target.value })
            }
          />
        </div>
        <div className="col-md-12 mb-4">
          <CSTextarea
            id="description"
            label="Description"
            placeholder="Enter Description"
            value={itemState.description}
            onChange={(e) =>
              setItemState({ ...itemState, description: e.target.value })
            }
            rows={6}
            readOnly
          />
        </div>

        <div className="col-md-12">
          <CSButton
            text="Add Item"
            type="submit"
            variant="primary"
            icon="send"
            size="lg"
            block
            disabled={itemState.item_id < 1 || itemState.description === ""}
          />
        </div>
      </CSForm>
    </Modal>
  );
};

export default InvoiceItem;
