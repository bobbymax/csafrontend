import { useEffect, useState } from "react";
import PageHeader from "../../../layouts/includes/PageHeader";
import { useLocation, useNavigate } from "react-router-dom";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSInput from "../../../layouts/components/forms/CSInput";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  formatCurrency,
  formatSelectOptions,
  unique,
} from "../../../services/helpers";
import InvoiceItem from "./InvoiceItem";
import Alert from "../../../services/alert";
import CSButton from "../../../layouts/components/forms/CSButton";
import moment from "moment";
import { useAppContext } from "../../../context/AuthProvider";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const GenerateMRV = () => {
  const initialState = {
    id: 0,
    user_id: 0,
    company_id: 0,
    code: "",
    amount: 0,
    delivery_date: "",
  };

  const [state, setState] = useState(initialState);
  const [stocks, setStocks] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendor, setVendor] = useState(null);
  const [show, setShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { auth } = useAppContext();
  const location = useLocation();
  const animated = makeAnimated();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setData(undefined);
  };

  const generate = (e) => {
    e.preventDefault();

    const body = {
      ...state,
      items: invoiceItems,
    };

    console.log(body);

    try {
      axios
        .post("purchaseInvoices", body)
        .then((res) => {
          const response = res.data;

          Alert.success("Generated!!", response.message);
          setState(initialState);
          navigate("/inventory/supplies");
        })
        .catch((err) => {
          Alert.error("Oops", "Something went wrong");
          console.error(err.message);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (response) => {
    const { data, message, status, action } = response;

    if (action === "alter") {
      setInvoiceItems(
        invoiceItems.map((item) => {
          if (item.id === data.id) {
            return data;
          }

          return item;
        })
      );
    } else {
      setInvoiceItems([data, ...invoiceItems]);
    }

    Alert.success(status, message);
    handleClose();
  };

  useEffect(() => {
    if (vendor !== null) {
      setState({
        ...state,
        company_id: vendor.value,
      });
    }
  }, [vendor]);

  useEffect(() => {
    if (
      location.state !== null &&
      location.state?.stocks?.length > 0 &&
      location.state?.vendors?.length > 0 &&
      auth !== null
    ) {
      const { stocks, vendors } = location.state;

      setStocks(stocks.filter((stock) => stock.restockable));
      setVendors(vendors);
      setState({
        ...state,
        code: unique("MRV"),
        user_id: auth?.user?.id,
      });
    }
  }, [location, auth]);

  //   console.log(invoiceItems);

  return (
    <>
      <InvoiceItem
        title="Add Invoice Item"
        show={show}
        lg
        isUpdating={isUpdating}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        data={data}
        itemsLength={invoiceItems.length}
        stocks={formatSelectOptions(stocks, "id", "name", "items")}
      />
      <div className="row">
        <PageHeader
          text="Generate MRV"
          icon="article"
          btnIcon="receipt"
          btnText="Add Invoice Item"
          handleClick={() => setShow(true)}
        />

        <div className="col-md-12">
          <div className="row">
            <CSForm
              txtHeader="Add Details"
              lg={9}
              md={12}
              formSubmit={generate}
            >
              <div className="row">
                <div className="col-md-3 mb-4">
                  <CSInput
                    label="Purchase Order No."
                    value={state.code}
                    onChange={(e) =>
                      setState({ ...state, code: e.target.value })
                    }
                    placeholder="Code Here"
                    readOnly
                  />
                </div>
                <div className="col-md-5 mb-4">
                  <CSInput
                    label="Amount"
                    value={state.amount}
                    onChange={(e) =>
                      setState({ ...state, amount: parseFloat(e.target.value) })
                    }
                    placeholder="Enter Total Amount here"
                  />
                </div>
                <div className="col-md-4 mb-4">
                  <CSInput
                    label="Delivery Date"
                    type="date"
                    value={state.delivery_date}
                    onChange={(e) =>
                      setState({ ...state, delivery_date: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-12 mb-4">
                  <label className="cs__form-label">Vendor</label>
                  <Select
                    components={animated}
                    options={formatSelectOptions(vendors, "id", "name")}
                    placeholder="Select Vendor"
                    value={vendor}
                    onChange={setVendor}
                    isSearchable
                  />
                </div>
                <div className="col-md-12 mb-4">
                  <div className="panel">
                    <div className="row">
                      {invoiceItems?.length > 0 ? (
                        invoiceItems?.map((item, i) => (
                          <div className="col-md-4" key={i}>
                            <div className="mrv__invoice__item">
                              <p>{item.quantity + " " + item.item_name}</p>
                              <h2>{formatCurrency(item.amount, true)}</h2>
                              <small>
                                Expires: {moment(item.expiry_date).format("LL")}
                              </small>
                            </div>
                          </div>
                        ))
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <CSButton
                    text="Generate"
                    type="submit"
                    variant="dark"
                    icon="send"
                    size="lg"
                    block
                    isLoading={isLoading}
                    disabled={
                      invoiceItems?.length < 1 ||
                      state.code === "" ||
                      vendor === null
                    }
                  />
                </div>
              </div>
            </CSForm>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateMRV;
