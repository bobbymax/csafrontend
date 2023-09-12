import { useEffect, useState } from "react";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSInput from "../../../layouts/components/forms/CSInput";
import { useLocation, useNavigate } from "react-router-dom";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSButton from "../../../layouts/components/forms/CSButton";
import RequisitionItem from "../../../layouts/components/partials/RequisitionItem";
import CUItem from "./CUItem";
import Alert from "../../../services/alert";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useAppContext } from "../../../context/AuthProvider";

const RequisitionItems = () => {
  const initialState = {
    id: 0,
    location_id: 0,
    code: "",
    type: "",
    request_type: "",
    status: "",
  };

  const [state, setState] = useState(initialState);
  const [items, setItems] = useState([]);
  const [requisition, setRequisition] = useState(undefined);
  const [show, setShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingItem, setIsUpdatingItem] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dependencies, setDependencies] = useState(undefined);
  const [data, setData] = useState(undefined);
  const [action, setAction] = useState("");
  const [remarks, setRemarks] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const { auth } = useAppContext();

  const manage = (item) => {
    setData(item);
    setShow(true);
    setIsUpdatingItem(true);
  };

  const destroy = (item) => {
    setItems(items.filter((ite) => ite?.id !== item?.id));
    Alert.success("Removed!!", "Item Deleted");
  };

  const handleClose = () => {
    setShow(false);
    setIsLoading(false);
    setIsUpdatingItem(false);
  };

  const handleSubmit = (response) => {
    console.log(response);
    const { action } = response;

    if (action === "alter") {
      setItems(
        items?.map((item) => {
          if (item.item_id === response.item_id) {
            return response;
          }

          return item;
        })
      );
    } else {
      const exists =
        items.filter((item) => item.item_id === response.item_id)[0] ?? null;
      if (exists !== null) {
        setItems(
          items.map((item) => {
            if (item.item_id === exists.item_id) {
              return {
                ...item,
                quantity: parseInt(response.quantity) + parseInt(item.quantity),
              };
            }

            return item;
          })
        );
      } else {
        setItems([
          {
            ...response,
            id: items?.length + 1,
          },
          ...items,
        ]);
      }
    }

    handleClose();
  };

  const reset = () => {
    setState(initialState);
    setItems([]);
    setRequisition(undefined);
    setIsLoading(false);
  };

  const makeRequisition = (e) => {
    e.preventDefault();

    const body = {
      ...state,
      user_id: auth?.user?.id,
      department_id: auth?.user?.department_id,
      status: "pending",
      items,
    };

    try {
      if (isUpdating) {
        axios
          .patch(`requisitions/${state.id}`, body)
          .then((res) => {
            const response = res.data;
            Alert.success("Updated!!", response.message);
            reset();
            navigate("/operations/requisitions");
          })
          .catch((err) => {
            setIsLoading(false);
            console.error(err.message);
          });
      } else {
        axios
          .post("requisitions", body)
          .then((res) => {
            const response = res.data;
            Alert.success("Done!!", response.message);
            reset();
            navigate("/operations/requisitions");
          })
          .catch((err) => {
            setIsLoading(false);
            console.error(err.message);
          });
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (requisition !== undefined) {
      const { items, remarks } = requisition?.attributes;

      setState({
        ...state,
        id: requisition?.id,
        location_id: requisition?.location_id,
        type: requisition?.type,
        code: requisition?.code,
        request_type: requisition?.request_type,
        status: requisition?.status,
      });

      setItems(items ?? []);
      setRemarks(remarks ?? []);
    }
  }, [requisition]);

  useEffect(() => {
    if (location.state !== null && location.state?.dependencies) {
      const { dependencies, data, action } = location.state;
      setDependencies(dependencies);
      setAction(action);

      if (action !== "store" && data !== undefined) {
        setRequisition(data);
        if (["pending", "in-review"].includes(data?.status)) {
          setIsUpdating(true);
        } else {
          setReadOnly(true);
        }
      } else {
        const date = new Date();

        setState({
          ...state,
          code: `RQ${date.getTime()}`,
        });
      }
    }
  }, [location]);

  return (
    <>
      <PageHeader
        icon="post_add"
        text={`${
          isUpdating ? "Alter" : readOnly ? "View" : "Make"
        } Requisition`}
        btnIcon="add_shopping_cart"
        btnText="Add Item"
        variant="primary"
        handleClick={() => setShow(true)}
        disabled={readOnly}
      />

      <CUItem
        title="Add Item"
        show={show}
        lg={false}
        isUpdating={isUpdatingItem}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        dependencies={{ ...dependencies }}
        data={data}
      />

      <div className="row">
        <CSForm lg={8} md={12} noHeader formSubmit={makeRequisition}>
          <div className="col-md-5 mb-3">
            <CSInput
              id="code"
              label="Request Code"
              placeholder="Request Code"
              value={state.code}
              onChange={(e) => setState({ ...state, code: e.target.value })}
              disabled
            />
          </div>
          <div className="col-md-7 mb-3">
            <CSSelect
              label="Location"
              value={state.location_id}
              onChange={(e) =>
                setState({ ...state, location_id: parseInt(e.target.value) })
              }
              disabled={readOnly}
            >
              <CSSelectOptions value={0} label="Select Location" disabled />
              {dependencies?.locations?.map((location) => (
                <CSSelectOptions
                  key={location?.id}
                  value={location?.id}
                  label={location?.name}
                />
              ))}
            </CSSelect>
          </div>
          <div className="col-md-6 mb-3">
            <CSSelect
              label="Type"
              value={state.type}
              onChange={(e) => setState({ ...state, type: e.target.value })}
              disabled={readOnly}
            >
              <CSSelectOptions
                value=""
                label="Select Requisition Type"
                disabled
              />
              {["quota", "request"].map((typ, i) => (
                <CSSelectOptions
                  key={i}
                  value={typ}
                  label={typ?.toUpperCase()}
                />
              ))}
            </CSSelect>
          </div>
          <div className="col-md-6 mb-4">
            <CSSelect
              label="Request Type"
              value={state.request_type}
              onChange={(e) =>
                setState({ ...state, request_type: e.target.value })
              }
              disabled={readOnly}
            >
              <CSSelectOptions value="" label="Select Request Type" disabled />
              {[
                { key: "self", label: "Self" },
                { key: "third-party", label: "Third Party" },
              ].map((typ, i) => (
                <CSSelectOptions key={i} value={typ.key} label={typ.label} />
              ))}
            </CSSelect>
          </div>
          {!readOnly && (
            <div className="col-md-12">
              <CSButton
                text={`${isUpdating ? "Update" : "Make"} Requisition`}
                type="submit"
                variant="primary"
                icon="send"
                size="lg"
                isLoading={isLoading}
                block
                disabled={
                  state.location_id === 0 ||
                  state.code === "" ||
                  state.type === "" ||
                  state.request_type === "" ||
                  items.length < 1
                }
              />
            </div>
          )}
        </CSForm>

        <div className="col-md-4 col-sm-12">
          <div className="col-md-12 mb-4">
            <div className="panel">
              <div className="panel__header mb-3">
                <h3 className="cs__form-label">Items</h3>
              </div>
              <div className="panel__body">
                {items?.length > 0 ? (
                  items?.map((ite, i) => (
                    <RequisitionItem
                      key={i}
                      item={ite}
                      title={ite.product_name}
                      quantity={ite.quantity_expected}
                      description={ite.description}
                      editable={isUpdating || action === "store"}
                      manage={manage}
                      destroy={destroy}
                      view={readOnly}
                    />
                  ))
                ) : (
                  <p className="text-danger">No Item has been added</p>
                )}
              </div>
            </div>

            <div className="remarks mt-3">
              <div id="remark__container">
                {remarks?.length > 0 ? (
                  remarks?.map((remark) => (
                    <p key={remark?.id} className="text-success">
                      <span className="material-icons-sharp">chat</span>
                      <span>{remark.description}</span>
                    </p>
                  ))
                ) : (
                  <p className="text-danger">
                    <span className="material-icons-sharp">chat</span>
                    <span>
                      No remark has been made for this requisition at the
                      moment...
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequisitionItems;
