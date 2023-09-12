import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../layouts/includes/PageHeader";
import moment from "moment";
import RequisitionItem from "../../../layouts/components/partials/RequisitionItem";
import CSButton from "../../../layouts/components/forms/CSButton";
import { useStateContext } from "../../../context/ContextProvider";
import AssignTask from "./AssignTask";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Alert from "../../../services/alert";

const AssignRequisition = () => {
  const location = useLocation();
  const { groups } = useStateContext();
  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const [requisition, setRequisition] = useState(undefined);
  const [dependencies, setDependencies] = useState(undefined);
  const [grps, setGrps] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [stage, setStage] = useState("");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [task, setTask] = useState(undefined);

  const manage = (raw) => {
    console.log(raw);
  };

  const destroy = (raw) => {
    console.log(raw);
  };

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setIsLoading(false);
  };

  const handleSubmit = (response) => {
    setTask(response);
    handleClose();
  };

  const handleUpdate = () => {
    const body = {
      status: "in-progress",
    };

    try {
      axios
        .patch(`alter/requisitions/${requisition?.id}`, body)
        .then((res) => {
          const response = res.data;
          setRequisition(response.data);
          Alert.success("Updated!!", response.message);
          handleClose();
          navigate("/inventory/requisitions");
        })
        .catch((err) => {
          handleClose();
          console.error(err.message);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (groups?.length > 0) {
      let grps = [];
      groups.map((grp) => grps.push(grp.label));

      setGrps(grps);
    }
  }, [groups]);

  useEffect(() => {
    if (requisition !== undefined) {
      const { items, task } = requisition?.attributes;

      setItems(items);
      setTask(task);
    }
  }, [requisition]);

  useEffect(() => {
    if (
      location?.state !== null &&
      location?.state?.data &&
      location?.state?.dependencies
    ) {
      const { data, dependencies, stage } = location.state;

      setRequisition(data);
      setDependencies(dependencies);
      setStage(stage);
    }
  }, [location]);

  //   console.log(requisition);

  return (
    <>
      <AssignTask
        title="Assign Task"
        show={show}
        lg={false}
        isUpdating={isUpdating}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        dependencies={{ users: dependencies?.users }}
        data={requisition}
      />
      <div className="row">
        <PageHeader text="Requisition Details" />

        <div className="col-md-12">
          <div className="row">
            <div className="col-md-8">
              <div className="requisition__details">
                <div className="info">
                  <div className="left-info">
                    <p>
                      {requisition?.type === "quota"
                        ? "Quota Requisition"
                        : "Request Requisition"}
                    </p>
                    <h2>{requisition?.requisitor}</h2>
                    <small>{requisition?.code}</small>
                  </div>
                  <div className="right-info">
                    <span className="material-icons-sharp">assignment</span>
                  </div>
                </div>
                <div className="requisition__mid">
                  <p>
                    - Request made on the{" "}
                    {moment(requisition?.created_at).format("LL")} -
                  </p>
                </div>
              </div>
              <div className="requisition__body">
                {items?.map((item, i) => (
                  <RequisitionItem
                    key={i}
                    item={item}
                    title={item?.item?.name}
                    quantity={item?.quantity_expected}
                    description={item?.item?.description}
                    manage={manage}
                    destroy={destroy}
                    editable={isUpdating}
                  />
                ))}
              </div>
            </div>
            <div className="col-md-4">
              <div className="btn__container">
                <div className="manage__req">
                  <div className="btn__item">
                    <CSButton
                      text="Assign Task"
                      variant="dark"
                      icon="assignment"
                      size="lg"
                      isLoading={isLoading}
                      block
                      disabled={stage !== "assign" || task !== null}
                      handleClick={() => setShow(true)}
                    />
                  </div>
                  <div className="btn__item">
                    <CSButton
                      text="Update Requisition"
                      variant="warning"
                      icon="verified"
                      size="lg"
                      isLoading={isLoading}
                      block
                      disabled={
                        stage !== "assign" ||
                        task === null ||
                        requisition?.status !== "registered"
                      }
                      handleClick={() => handleUpdate()}
                    />
                  </div>
                  {/* <div className="btn__item">
                    <CSButton
                      text="Approve Request"
                      variant="primary"
                      icon="verified"
                      size="lg"
                      isLoading={isLoading}
                      block
                      disabled={stage !== "approval"}
                    />
                  </div>
                  <div className="btn__item">
                    <CSButton
                      text="Deny Request"
                      variant="danger"
                      icon="verified"
                      size="lg"
                      isLoading={isLoading}
                      block
                      disabled={stage !== "approval"}
                    />
                  </div>
                  {grps.some((group) =>
                    ["administrators", "supervisor"].includes(group)
                  ) && (
                    <div className="btn__item">
                      <CSButton
                        text="Confirm Requisition"
                        variant="warning"
                        icon="done"
                        size="lg"
                        isLoading={isLoading}
                        block
                        disabled={stage !== "register"}
                      />
                    </div>
                  )} */}
                </div>
                <div className="alter__req"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignRequisition;
