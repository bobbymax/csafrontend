import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Modal from "../../../layouts/components/modals/Modal";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSButton from "../../../layouts/components/forms/CSButton";

const CUVendor = ({
  title = "",
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
}) => {
  const initialState = {
    id: 0,
    name: "",
    acronym: "",
    rc_no: "",
    tin_no: "",
    email: "",
    mobile: "",
    payment_code: "",
    type: "",
  };

  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const axios = useAxiosPrivate();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...state,
    };

    try {
      setIsLoading(true);
      if (isUpdating) {
        axios
          .patch(`companies/${state.id}`, body)
          .then((res) => {
            const response = res.data;
            handleSubmit({
              status: "Updated!!",
              data: response.data,
              message: response.message,
              action: "alter",
            });
            reset();
          })
          .catch((err) => console.error(err.message));
      } else {
        axios
          .post("companies", body)
          .then((res) => {
            const response = res.data;
            handleSubmit({
              status: "Created!!",
              data: response.data,
              message: response.message,
              action: "store",
            });
            reset();
          })
          .catch((err) => console.error(err.message));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalClose = () => {
    reset();
    handleClose();
  };

  const reset = () => {
    setIsLoading(false);
    setState(initialState);
  };

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        name: data?.name,
        acronym: data?.acronym,
        rc_no: data?.rc_no ?? "",
        tin_no: data?.tin_no ?? "",
        email: data?.email ?? "",
        mobile: data?.mobile ?? "",
        payment_code: data?.payment_code ?? "",
        type: data?.type,
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
        <div className="col-md-12 mb-3">
          <CSSelect
            label="Vendor Type"
            id="type"
            value={state.type}
            onChange={(e) => setState({ ...state, type: e.target.value })}
          >
            <CSSelectOptions value="" label="Select Vendor Type" disabled />

            {[
              { key: "owner", label: "Owner" },
              { key: "support", label: "Support" },
              { key: "vendor", label: "Contractor" },
              { key: "jv", label: "Joint Venture" },
              { key: "other", label: "Other" },
            ].map((typ, i) => (
              <CSSelectOptions key={i} value={typ?.key} label={typ?.label} />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-9 mb-3">
          <CSInput
            id="name"
            label="Vendor Name"
            placeholder="Enter Vendor Name"
            value={state.name}
            onChange={(e) => setState({ ...state, name: e.target.value })}
          />
        </div>
        <div className="col-md-3 mb-3">
          <CSInput
            id="acronym"
            label="Acronym"
            placeholder="Enter Acronym"
            value={state.acronym}
            onChange={(e) => setState({ ...state, acronym: e.target.value })}
          />
        </div>
        <div className="col-md-6 mb-3">
          <CSInput
            id="rc_no"
            label="RC Number"
            placeholder="Enter RC Number"
            value={state.rc_no}
            onChange={(e) => setState({ ...state, rc_no: e.target.value })}
          />
        </div>
        <div className="col-md-6 mb-3">
          <CSInput
            id="tin_no"
            label="Tin Number"
            placeholder="Enter Tin Number"
            value={state.tin_no}
            onChange={(e) => setState({ ...state, tin_no: e.target.value })}
          />
        </div>
        <div className="col-md-5 mb-3">
          <CSInput
            id="mobile"
            label="Mobile"
            placeholder="Enter Mobile"
            value={state.mobile}
            onChange={(e) => setState({ ...state, mobile: e.target.value })}
          />
        </div>
        <div className="col-md-7 mb-3">
          <CSInput
            id="email"
            label="Email Address"
            placeholder="Enter Email Address"
            value={state.email}
            onChange={(e) => setState({ ...state, email: e.target.value })}
          />
        </div>
        <div className="col-md-12 mb-3">
          <CSInput
            id="payment_code"
            label="Payment Code"
            placeholder="Enter Payment Code"
            value={state.payment_code}
            onChange={(e) =>
              setState({ ...state, payment_code: e.target.value })
            }
          />
        </div>
        <div className="col-md-12">
          <CSButton
            text="Submit"
            type="submit"
            variant="primary"
            icon="send"
            size="lg"
            isLoading={isLoading}
            block
            disabled={state.name === "" || state.key === ""}
          />
        </div>
      </CSForm>
    </Modal>
  );
};

export default CUVendor;
