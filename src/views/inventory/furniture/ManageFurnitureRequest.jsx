import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSButton from "../../../layouts/components/forms/CSButton";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Alert from "../../../services/alert";

const ManageFurnitureRequest = () => {
  const initialState = {
    name: "",
    item_id: 0,
    quantity: 0,
    quantity_issued: 0,
    item_quantity: 0,
    remark: "",
    status: "",
  };
  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();

  const [state, setState] = useState(initialState);
  const [furniture, setFurniture] = useState(null);
  const [task, setTask] = useState(null);
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);
  const [staff, setStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleModification = (e) => {
    e.preventDefault();

    const body = {
      quantity_issued: state.quantity_issued,
      remark: state.remark,
      status: state.status === "denied" ? "canceled" : "resolved",
    };

    try {
      axios
        .patch(`furnitureRequestItems/${state.item_id}`, body)
        .then((res) => {
          const response = res.data;

          setItems(
            items.map((item) => {
              if (parseInt(item.id) === parseInt(response.data?.id)) {
                return response.data;
              }

              return item;
            })
          );

          setItem(null);
          setState(initialState);
          Alert.success("Modified!!", response.message);
        })
        .catch((err) => {
          console.error(err.message);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const completeTask = (status) => {
    const body = {
      status,
    };

    Alert.flash(
      "Are you sure?",
      "warning",
      `You are about to ${
        status === "denied" ? "deny" : "approve"
      } this request!!`
    ).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          axios
            .patch(`close/furnitureRequests/${furniture?.id}`, body)
            .then((res) => {
              const response = res.data;
              Alert.success(
                `${status === "denied" ? "Denied" : "Approved"}`,
                response.message
              );
              setIsLoading(false);
              navigate("/inventory/furniture/requests");
            })
            .catch((err) => {
              console.error(err.message);
              setIsLoading(false);
            });
        } catch (error) {
          console.error(error);
        }

        setIsLoading(false);
      }
    });
  };

  const modifyRequest = (raw) => {
    setItem(raw);
    setState({
      ...state,
      item_id: raw.id,
      name: raw?.item?.name,
      quantity: raw?.quantity,
      status: raw?.status,
      item_quantity: raw?.item?.quantity,
    });
  };

  useEffect(() => {
    if (state.item_quantity < state.quantity) {
      alert("Quantity exceeded available items");
    } else if (state.quantity_issued > state.item_quantity) {
      alert("Issue Quantity cannot be greater than Available Items");
      setState({
        ...state,
        quantity_issued: 0,
      });
    }
  }, [state.quantity_issued, state.quantity]);

  useEffect(() => {
    if (location && location.state && location.state?.furniture !== null) {
      const { furniture } = location.state;
      setFurniture(furniture);
      setTask(furniture?.attributes?.task);
      setItems(furniture?.attributes?.items);
      setStaff(furniture?.attributes?.staff);
    }
  }, [location]);

  // console.log(items);

  return (
    <>
      <div className="row">
        <PageHeader
          text="Manage Furniture Request"
          icon="living"
          btnIcon="arrow_back"
          btnText="Go Back"
          variant="danger"
          handleClick={() => navigate(-1)}
        />

        <div className="col-md-7">
          <div className="complaint__details">
            <h3 className="mb-3">Request</h3>
            <p className="mb-4">
              {`${staff?.name} from ${staff?.department} has requested for some items needed. see list below:`}
            </p>

            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Issued</th>
                  <th>Status</th>
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item, i) => (
                  <tr key={i}>
                    <td>{item?.item?.name}</td>
                    <td>{item?.quantity}</td>
                    <td>{item?.quantity_issued}</td>
                    <td>{item?.status}</td>
                    <td>
                      <CSButton
                        borderRadius
                        text="Modify"
                        icon="edit"
                        handleClick={() => modifyRequest(item)}
                        variant="dark"
                        small
                        block
                        disabled={
                          state.item_id > 0 || item?.status !== "pending"
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-5">
          <div className="complaint__details mb-4">
            <h3 className="mb-3">Task</h3>
            <p className="mb-4">{task?.description}</p>
            <div className="row">
              <div className="col-md-6">
                <CSButton
                  text="Deny Request"
                  variant="danger"
                  icon="close"
                  handleClick={() => completeTask("denied")}
                  disabled={
                    items.filter((item) => item.status !== "pending").length >
                      0 || isLoading
                  }
                  small
                  block
                />
              </div>
              <div className="col-md-6">
                <CSButton
                  text="Complete Request"
                  variant="primary"
                  icon="verified"
                  handleClick={() => completeTask("approved")}
                  disabled={
                    items.filter((item) => item.status === "pending").length >
                      0 ||
                    isLoading ||
                    furniture?.status !== "pending"
                  }
                  small
                  block
                />
              </div>
            </div>
          </div>

          <CSForm
            txtHeader="Modify Item"
            lg={12}
            md={12}
            formSubmit={handleModification}
          >
            <div className="row">
              <div className="col-md-12 mb-4">
                <CSButton
                  small
                  text="Deny Item Request"
                  variant="danger"
                  icon="close"
                  handleClick={() => setState({ ...state, status: "denied" })}
                  disabled={state.quantity_issued > 1 || item === null}
                />
              </div>
              <div className="col-md-12 mb-3">
                <CSInput
                  label="Item"
                  value={state.name}
                  onChange={(e) => setState({ ...state, name: e.target.value })}
                  placeholder="Enter item name..."
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <CSInput
                  label="Quantity Requested"
                  type="number"
                  value={state.quantity}
                  onChange={(e) =>
                    setState({ ...state, quantity: e.target.value })
                  }
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <CSInput
                  label="Quantity Issued"
                  type="number"
                  value={state.quantity_issued}
                  onChange={(e) =>
                    setState({ ...state, quantity_issued: e.target.value })
                  }
                  disabled={item === null || state.status === "denied"}
                />
              </div>
              <div className="col-md-12 mb-4">
                <CSTextarea
                  label="Remark"
                  rows={4}
                  value={state.remark}
                  onChange={(e) =>
                    setState({ ...state, remark: e.target.value })
                  }
                  disabled={state.status !== "denied"}
                  placeholder="Enter remark here..."
                />
              </div>
              <div className="col-md-12">
                <CSButton
                  block
                  text="Approve Request"
                  type="submit"
                  variant="dark"
                  icon="mail"
                  disabled={
                    (state.status === "denied" && state.remark === "") ||
                    (state.quantity_issued < 1 && state.status !== "denied")
                  }
                />
              </div>
            </div>
          </CSForm>
        </div>
      </div>
    </>
  );
};

export default ManageFurnitureRequest;
