import { useEffect, useState } from "react";
import { formatSelectOptions } from "../../../services/helpers";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Modal from "../../../layouts/components/modals/Modal";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSButton from "../../../layouts/components/forms/CSButton";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const CUFurnitureItems = ({
  title = "",
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
  dependencies = undefined,
  count = 0,
}) => {
  const initialItemState = {
    id: 0,
    stock_id: 0,
    item_id: 0,
    quantity: 0,
    itemQuantity: 0,
    item: "",
  };

  const [itemState, setItemState] = useState(initialItemState);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState(null);
  const [stock, setStock] = useState(null);

  const animated = makeAnimated();
  const axios = useAxiosPrivate();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...itemState,
      id: isUpdating ? itemState.id : count + 1,
    };

    handleSubmit({
      data: body,
      method: isUpdating ? "alter" : "store",
      status: isUpdating ? "Updated!!" : "Created!!",
    });

    reset();

    console.log(body);
  };

  const handleModalClose = () => {
    reset();
    handleClose();
  };

  const reset = () => {
    setItemState(initialItemState);
    setStock(null);
    setItem(null);
  };

  useEffect(() => {
    if (stock !== null) {
      try {
        axios
          .get(`stocks/items/${stock?.value}`)
          .then((res) => {
            const response = res.data.data;
            setItems(formatSelectOptions(response, "id", "name"));
          })
          .catch((err) => console.error(err.message));
      } catch (error) {
        console.error(error);
      }
    }
  }, [stock]);

  useEffect(() => {
    if (item !== null) {
      setItemState({
        ...itemState,
        id: 0,
        stock_id: stock?.value,
        item_id: item?.value,
        item: item?.label,
        itemQuantity: item?.raw?.quantity,
      });
    }
  }, [item]);

  useEffect(() => {
    if (data !== undefined) {
      setItemState({
        ...itemState,
        stock_id: data?.stock_id,
        item_id: data?.item_id,
        quantity: data?.quantity,
      });

      setItem(
        items?.filter(
          (item) => parseInt(item?.value) === parseInt(data?.item_id)
        )[0]
      );
      setStock(
        products?.filter(
          (product) => parseInt(product.value) === parseInt(data?.stock_id)
        )[0]
      );
    }
  }, [data]);

  useEffect(() => {
    if (dependencies !== undefined && dependencies?.stocks?.length > 0) {
      const { stocks } = dependencies;
      setProducts(formatSelectOptions(stocks, "id", "name"));
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
          <label className="cs__form-label">Stock</label>
          <Select
            components={animated}
            options={products}
            placeholder="Select Stock"
            value={stock}
            onChange={setStock}
            isSearchable
          />
        </div>
        <div className="col-md-9 mb-3">
          <label className="cs__form-label">Item</label>
          <Select
            components={animated}
            options={items}
            placeholder="Select Stock Item"
            value={item}
            onChange={setItem}
            isSearchable
            isDisabled={stock === null || products?.length < 1}
          />
        </div>
        <div className="col-md-3 mb-3">
          <CSInput
            id="quantity"
            type="number"
            label="Quantity"
            value={itemState.quantity}
            onChange={(e) =>
              setItemState({ ...itemState, quantity: parseInt(e.target.value) })
            }
          />
        </div>

        <div className="col-md-12">
          <CSButton
            text="Add Item"
            type="submit"
            variant="dark"
            icon="send"
            size="lg"
            block
            disabled={stock === null || item === null || itemState.quantity < 1}
          />
        </div>
      </CSForm>
    </Modal>
  );
};

export default CUFurnitureItems;
