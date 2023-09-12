import { useEffect, useState } from "react";
import PageHeader from "../../../layouts/includes/PageHeader";
import { useLocation, useNavigate } from "react-router-dom";
import RequisitionItem from "../../../layouts/components/partials/RequisitionItem";
import CSButton from "../../../layouts/components/forms/CSButton";
import moment from "moment";
import Alert from "../../../services/alert";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import CSForm from "../../../layouts/components/forms/CSForm";

const ViewRequisition = () => {
  const [requisition, setRequisition] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [remark, setRemark] = useState("");
  const [remarks, setRemarks] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();

  const makeRemark = (e) => {
    e.preventDefault();

    const body = {
      remarkable_id: requisition?.id,
      description: remark,
    };

    try {
      setIsLoading(true);
      axios
        .post("remarks", body)
        .then((res) => {
          const response = res.data;

          const { remarks } = response.data?.attributes;

          setRemarks(remarks ?? []);
          setRequisition(response.data);
          Alert.success("Saved!!", response.message);
          setIsLoading(false);
          navigate("/operations/approve/requisitions");
        })
        .catch((err) => {
          console.error(err.message);
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const approve = () => {
    console.log(requisition);
    Alert.flash(
      "Are you sure?",
      "warning",
      "You will not be able to reverse this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);

        const body = {
          status: "registered",
        };

        try {
          axios
            .patch(`alter/requisitions/${requisition?.id}`, body)
            .then((res) => {
              const response = res.data;
              setRequisition(response.data);
              Alert.success("Approved!!", response.message);
              setIsLoading(false);
              navigate("/operations/approve/requisitions");
            })
            .catch((err) => {
              setIsLoading(false);
              console.error(err.message);
            });
        } catch (error) {
          console.error(error);
          setIsLoading(false);
        }
      }
    });
  };

  console.log(location);

  useEffect(() => {
    if (location.state !== null && location.state?.data) {
      const { data } = location.state;

      setRequisition(data);
      setItems(data?.attributes?.items ?? []);
      setRemarks(data?.attributes?.remarks ?? []);
    }
  }, [location]);

  return (
    <>
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
                  />
                ))}
              </div>
            </div>
            <div className="col-md-4">
              <div className="btn__container">
                <div className="manage__req">
                  <div className="btn__item">
                    <CSButton
                      text={`${
                        ["pending", "in-review"].includes(requisition?.status)
                          ? "Approve Requisition"
                          : "Approved"
                      }`}
                      variant="primary"
                      icon="verified"
                      size="lg"
                      isLoading={isLoading}
                      block
                      handleClick={() => approve()}
                      disabled={
                        remark !== "" ||
                        !["pending", "in-review"].includes(requisition?.status)
                      }
                    />
                  </div>
                </div>
                <div className="alter__req mt-4">
                  <CSForm lg={12} md={12} noHeader formSubmit={makeRemark}>
                    <CSTextarea
                      id="remark"
                      label="Remark"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      rows={5}
                      placeholder="Enter Remark Here"
                    />
                    <CSButton
                      text="Submit"
                      type="submit"
                      variant="primary"
                      icon="send"
                      size="lg"
                      isLoading={isLoading}
                      disabled={remark === ""}
                      block
                    />
                  </CSForm>

                  <div className="remarks mt-3">
                    <div id="remark__container">
                      {remarks?.length > 0 ? (
                        remarks?.map((remark) => (
                          <p key={remark?.id}>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewRequisition;
