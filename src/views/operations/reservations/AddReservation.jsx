import { useEffect, useState } from "react";
import Modal from "../../../layouts/components/modals/Modal";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSButton from "../../../layouts/components/forms/CSButton";
import airports from "../../../assets/data/airports.json";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const AddReservation = ({
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
    rId: 0,
    beneficiary_id: 0,
    request_type: "staff",
    flight_type: "",
    type: "",
    name: "",
    take_off: "",
    destination: "",
    begin: "",
    elapse: "",
    duration: 0,
    approval_memo: "",
    data_page: "",
    visa: "",
    instructions: "",
  };

  const animated = makeAnimated();

  const paramsState = {
    selectGrid: "",
    leadOne: "",
    leadTwo: "",
    subTwo: "",
    subGrid: "",
  };

  const [resState, setResState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [reqType, setReqType] = useState("");
  const [params, setParams] = useState(paramsState);
  const [places, setPlaces] = useState([]);
  const [destination, setDestination] = useState(null);
  const [place, setPlace] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...resState,
      take_off: place?.value ?? "",
      destination:
        resState.type === "flight" ? destination?.value : resState.destination,
      rId: resState.rId < 1 ? count + 1 : resState.rId,
    };

    // console.log(body);

    handleSubmit({
      status: isUpdating ? "Updated!!" : "Added!!",
      data: body,
      message: isUpdating ? "Booking Updated" : "Booking Added",
      action: isUpdating ? "alter" : "store",
    });

    reset();
  };

  const handleModalClose = () => {
    reset();
    handleClose();
  };

  const reset = () => {
    setIsLoading(false);
    setResState(initialState);
    setCount(0);
    setParams(paramsState);
    setReqType("");
    setDestination(null);
    setPlace(null);
  };

  useEffect(() => {
    if (resState.beneficiary_id > 0) {
      const staff = users.filter(
        (user) => parseInt(user?.id) === resState.beneficiary_id
      )[0];

      //   console.log(staff);

      setResState({
        ...resState,
        name: staff?.name,
      });
    }
  }, [resState.beneficiary_id]);

  useEffect(() => {
    let dogs = [];

    airports.map((airport) =>
      dogs.push({
        value: `${airport.iata_code} - ${airport.name} ${airport.city}, ${airport.country}`,
        label: `${airport.iata_code} - ${airport.name} ${airport.city}, ${airport.country}`,
      })
    );

    setPlaces(dogs);
  }, [airports]);

  // console.log(airports);

  useEffect(() => {
    if (
      dependencies !== undefined &&
      dependencies?.staff &&
      dependencies?.type
    ) {
      const { staff, type, resLength } = dependencies;

      setUsers(staff);
      setCount(resLength);
      setReqType(type);
      setResState({
        ...resState,
        type,
      });

      setParams({
        ...params,
        selectGrid: type === "flight" ? "8" : "12",
        leadOne: type === "flight" ? "Take Off" : "Check In",
        leadTwo: type === "flight" ? "Return" : "Check Out",
        subTwo: type === "flight" ? "To" : "Hotel and Location",
        subGrid: type === "flight" ? "6" : "12",
      });
    }
  }, [dependencies]);

  useEffect(() => {
    if (data !== undefined) {
      //   console.log(data);
      setResState({
        ...resState,
        rId: data?.rId,
        beneficiary_id: data?.beneficiary_id,
        request_type: data?.request_type ?? "",
        flight_type: data?.flight_type ?? "",
        type: data?.type ?? "",
        name: data?.name ?? "",
        take_off: data?.take_off ?? "",
        destination: data?.destination ?? "",
        begin: data?.begin ?? "",
        elapse: data?.elapse ?? "",
        duration: parseInt(data?.duration),
        approval_memo: data?.approval_memo ?? "",
        data_page: data?.data_page ?? "",
        visa: data?.visa ?? "",
        instructions: data?.instructions ?? "",
      });

      if (data?.type === "flight") {
        setPlace(places.filter((pla) => pla.value === data?.take_off)[0]);
        setDestination(
          places.filter((pla) => pla.value === data?.destination)[0]
        );
      }
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
        <div className={`col-md-${params.selectGrid} mb-3`}>
          <CSSelect
            label="Staff"
            id="user_id"
            value={resState.beneficiary_id}
            onChange={(e) =>
              setResState({
                ...resState,
                beneficiary_id: parseInt(e.target.value),
              })
            }
          >
            <CSSelectOptions value={0} label="Select Staff" disabled />

            {users?.map((staff, i) => (
              <CSSelectOptions key={i} value={staff?.id} label={staff?.name} />
            ))}
          </CSSelect>
        </div>

        {resState.type === "flight" && (
          <div className="col-md-4 mb-4">
            <CSSelect
              label="Type"
              value={resState.flight_type}
              onChange={(e) =>
                setResState({ ...resState, flight_type: e.target.value })
              }
            >
              <CSSelectOptions label="Select Flight Type" value="" disabled />

              {[
                { key: "international", label: "International" },
                { key: "local", label: "Local" },
              ].map((flight, i) => (
                <CSSelectOptions
                  key={i}
                  value={flight.key}
                  label={flight.label}
                />
              ))}
            </CSSelect>
          </div>
        )}

        <div className="col-md-6 mb-4">
          <CSInput
            label={params.leadOne}
            type="date"
            value={resState.begin}
            onChange={(e) =>
              setResState({ ...resState, begin: e.target.value })
            }
          />
        </div>
        <div className="col-md-6 mb-4">
          <CSInput
            label={params.leadTwo}
            type="date"
            value={resState.elapse}
            onChange={(e) =>
              setResState({ ...resState, elapse: e.target.value })
            }
          />
        </div>
        {reqType === "flight" && (
          <div className="col-md-6 mb-4">
            <label className="cs__form-label">From</label>
            <Select
              components={animated}
              options={places}
              placeholder="Select Location"
              value={place}
              onChange={setPlace}
              isSearchable
            />
          </div>
        )}

        {reqType === "flight" ? (
          <div className="col-md-6 mb-4">
            <label className="cs__form-label">To</label>
            <Select
              components={animated}
              options={places}
              placeholder="Select Location"
              value={destination}
              onChange={setDestination}
              isSearchable
            />
          </div>
        ) : (
          <div className={`col-md-${params.subGrid} mb-3`}>
            <CSInput
              label={params.subTwo}
              value={resState.destination}
              onChange={(e) =>
                setResState({ ...resState, destination: e.target.value })
              }
              placeholder="Enter Destination"
            />
          </div>
        )}

        {reqType === "flight" && (
          <>
            <div className="col-md-4 mb-4">
              <CSInput
                label="Approval Memo"
                type="file"
                value={resState.approval_memo}
                onChange={(e) =>
                  setResState({ ...resState, approval_memo: e.target.value })
                }
              />
            </div>
            <div className="col-md-4 mb-4">
              <CSInput
                label="Data Page"
                type="file"
                value={resState.data_page}
                onChange={(e) =>
                  setResState({ ...resState, data_page: e.target.value })
                }
              />
            </div>
            <div className="col-md-4 mb-4">
              <CSInput
                label="Visa Page"
                type="file"
                value={resState.visa}
                onChange={(e) =>
                  setResState({ ...resState, visa: e.target.value })
                }
              />
            </div>
          </>
        )}
        <div className="col-md-12 mb-4">
          <CSTextarea
            label="Instructions"
            value={resState.instructions}
            onChange={(e) =>
              setResState({ ...resState, instructions: e.target.value })
            }
            rows={5}
            placeholder="Enter additional Info Here"
          />
        </div>

        <div className="col-md-12">
          <CSButton
            text={
              reqType === "flight"
                ? "Reserve Flight Booking"
                : "Confirm Booking"
            }
            type="submit"
            variant="primary"
            icon="send"
            size="lg"
            isLoading={isLoading}
            block
            disabled={
              resState.name === "" ||
              resState.begin === "" ||
              resState.elapse === ""
            }
          />
        </div>
      </CSForm>
    </Modal>
  );
};

export default AddReservation;
