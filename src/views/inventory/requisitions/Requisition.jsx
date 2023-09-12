import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../layouts/includes/PageHeader";
import RequisitionItem from "../../../layouts/components/partials/RequisitionItem";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import CSButton from "../../../layouts/components/forms/CSButton";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Alert from "../../../services/alert";

const Requisition = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const axios = useAxiosPrivate();

  const initiaState = {
    id: 0,
    quantity_expected: 0,
    quantity_received: 0,
    description: "",
    status: "",
    quantity: 0,
  };

  const [state, setState] = useState(initiaState);
  const [data, setData] = useState(null);
  const [reqItems, setReqItems] = useState([]);
  const [treated, setTreated] = useState([]);
  const [isEditable, setIsEditable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const verify = () => {
    Alert.flash(
      "Are you sure?",
      "info",
      "You are about to confirm the Requisition!"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const body = {
            status: "approved",
          };
          axios
            .patch(`alter/requisitions/${data?.id}`, body)
            .then((res) => {
              const response = res.data;
              setData(response.data);
              Alert.success("Confirmed!!", response.message);
              setIsLoading(false);
              navigate("/inventory/treat/requisitions");
            })
            .catch((err) => {
              Alert.error("Oops!!", "Something went wrong");
              console.error(err.message);
              setIsLoading(false);
            });
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  const manage = (item) => {
    setState({
      ...state,
      id: item?.id,
      quantity_expected: item?.quantity_expected,
      quantity: item?.item?.quantity,
    });
    setIsEditable(false);
  };

  const destroy = (item) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You are about to make this item as Unavailable"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const body = {
            status: "unavailable",
          };
          axios
            .patch(`update/status/requisitionItems/${item?.id}`, body)
            .then((res) => {
              const response = res.data;
              Alert.success("Confirmed!!", response.message);
              setIsLoading(false);
              setReqItems(
                reqItems.map((it) => {
                  if (it.id === parseInt(response.data?.id)) {
                    return response.data;
                  }

                  return it;
                })
              );
            })
            .catch((err) => {
              Alert.error("Oops!!", "Something went wrong");
              console.error(err.message);
              setIsLoading(false);
            });
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      quantity_received: state.quantity_received,
      description: state.description,
      status: "issued",
    };

    setIsLoading(true);

    try {
      axios
        .patch(`treat/requisitionItems/${state.id}`, body)
        .then((res) => {
          const response = res.data;

          setReqItems(
            reqItems.map((it) => {
              if (it.id === parseInt(response.data?.id)) {
                return response.data;
              }

              return it;
            })
          );

          Alert.success("Completed!!", response.message);
          setIsEditable(true);
          setState(initiaState);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          setIsEditable(false);
          Alert.error(err.message);
          console.log(err.message);
        });
    } catch (error) {
      console.error(error);
      Alert.error("Oops!!", "Something went wrong!!");
    }
  };

  const closeRequisition = () => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You are about to close this Requisition!"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const body = {
            status: "denied",
          };
          axios
            .patch(`alter/requisitions/${data?.id}`, body)
            .then((res) => {
              const response = res.data;
              setData(response.data);
              Alert.success("Closed!!", response.message);
              setIsLoading(false);
              navigate("/inventory/treat/requisitions");
            })
            .catch((err) => {
              Alert.error("Oops!!", "Something went wrong");
              console.error(err.message);
              setIsLoading(false);
            });
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  useEffect(() => {
    setTreated(reqItems.filter((req) => req.status === "issued"));
  }, [reqItems]);

  useEffect(() => {
    const diff = state.quantity - state.quantity_received;

    if (diff < 0) {
      setState({
        ...state,
        quantity_received: 0,
      });

      Alert.error(
        "Not Permitted!!",
        "Cannot exceed the available quantity for this item."
      );
    }
  }, [state.quantity_received]);

  useEffect(() => {
    if (data !== null && data?.attributes && data?.attributes?.items) {
      const { items } = data?.attributes;

      setReqItems(items.filter((item) => item?.status !== "unavailable"));
    }
  }, [data]);

  useEffect(() => {
    if (
      location.state !== null &&
      location.state?.items?.length > 0 &&
      location.state?.data !== null
    ) {
      const { data } = location.state;

      setData(data);
    }
  }, [location]);

  // console.log(treated);

  return (
    <>
      <div className="row">
        <PageHeader
          icon="fingerprint"
          text="Handle Request"
          btnText="Confirm Request"
          btnIcon="verified"
          handleClick={() => verify()}
          disabled={reqItems.length !== treated.length || reqItems.length < 1}
        />

        <div className="col-md-8">
          <div className="row">
            {reqItems.length > 0 &&
              reqItems.map((item, i) => (
                <div className="col-md-6" key={i}>
                  <RequisitionItem
                    item={item}
                    title={item.product_name}
                    quantity={item.quantity_expected}
                    description={item?.item?.description}
                    manage={manage}
                    destroy={destroy}
                    editable={isEditable && item?.status === "pending"}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="col-md-4">
          <CSForm
            lg={12}
            md={12}
            txtHeader="Treat Requested Item"
            formSubmit={handleSubmit}
          >
            <CSInput
              label="Quantity Requested"
              type="number"
              value={state.quantity_expected}
              onChange={(e) =>
                setState({
                  ...state,
                  quantity_expected: parseInt(e.target.value),
                })
              }
              disabled
            />
            <CSInput
              label="Quantity Available"
              type="number"
              value={state.quantity}
              onChange={(e) =>
                setState({
                  ...state,
                  quantity: parseInt(e.target.value),
                })
              }
              disabled
            />
            <CSInput
              label="Quantity Issued"
              type="number"
              value={state.quantity_received}
              onChange={(e) =>
                setState({
                  ...state,
                  quantity_received: parseInt(e.target.value),
                })
              }
            />
            <CSTextarea
              label="Remark"
              placeholder="Make Remark (Optional)"
              value={state.description}
              onChange={(e) =>
                setState({ ...state, description: e.target.value })
              }
              rows={5}
            />
            <CSButton
              text="Approve Item"
              type="submit"
              variant="primary"
              icon="mail"
              size="lg"
              isLoading={isLoading}
              block
              disabled={state.quantity_received < 1}
            />
          </CSForm>
        </div>

        <div className="col-md-3">
          <CSButton
            text="Close Requisition"
            variant="danger"
            icon="close"
            size="lg"
            isLoading={isLoading}
            handleClick={closeRequisition}
            block
            disabled={treated.length > 0}
          />
        </div>
      </div>
    </>
  );
};

export default Requisition;
