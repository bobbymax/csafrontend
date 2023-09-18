import { useEffect, useState } from "react";
import CSForm from "../../../layouts/components/forms/CSForm";
import { useAppContext } from "../../../context/AuthProvider";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import CSButton from "../../../layouts/components/forms/CSButton";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import Alert from "../../../services/alert";
import AddBooking from "./AddBooking";

const MakeReservation = () => {
  const initialState = {
    id: 0,
    user_id: 0,
    request_type: "staff",
    title: "",
    type: "",
    flight_type: "",
    name: "",
    mobile: "",
    take_off: "",
    destination: "",
    begin: "",
    elapse: "",
    start: "",
    finish: "",
    duration: 0,
    approval_memo: "",
    data_page: "",
    visa: "",
    code: "",
    budget_code: "",
    description: "",
    start_time: "",
    finish_time: "",
  };

  const [state, setState] = useState(initialState);
  const [rType, setRType] = useState("flights");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [show, setShow] = useState(false);
  const [dependencies, setDependencies] = useState({});

  const { auth } = useAppContext();
  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const handleReservation = (e) => {
    e.preventDefault();

    const body = {
      code: state.code,
      budget_code: state.budget_code,
      user_id: state.user_id,
      description: state.description,
      reservations: [
        {
          user_id: state.user_id,
          request_type: state.request_type,
          type: state.type,
          flight_type: state.flight_type === "" ? "local" : state.flight_type,
          name: state.name,
          mobile: state.mobile,
          take_off: state.take_off,
          destination: state.destination,
          begin: state.begin,
          elapse: state.elapse,
          duration: state.duration,
          approval_memo: state.approval_memo,
          data_page: state.data_page,
          visa: state.visa,
        },
      ],
    };

    // console.log(body);

    try {
      setIsLoading(true);

      axios
        .post("logisticsRequests", body)
        .then((res) => {
          const response = res.data;

          setState(initialState);
          setIsLoading(false);
          Alert.success("Confirmed!!", response.message);
          navigate("/operations/reservations");
        })
        .catch((err) => {
          console.error(err.message);
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = () => {};

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    if (auth?.user !== null) {
      const { user } = auth;

      const date = new Date();

      setState({
        ...state,
        user_id: user?.id,
        name: user?.firstname + " " + user?.surname,
        code: `RSV${date.getTime()}`,
        type: rType === "flights" ? "flight" : "hotel",
      });
    }
  }, [auth, rType]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      const urls = ["rooms", "seatings"];

      const requests = urls.map((url) => axios.get(url));

      Promise.all(requests)
        .then((responses) => {
          setDependencies({
            rooms: responses[0].data?.data,
            seatings: responses[1].data?.data,
          });
        })
        .catch((err) => console.error(err));
    } catch (error) {
      console.error(error);
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  //   console.log(dependencies);

  return (
    <>
      <AddBooking
        title="Add Detail"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        dependencies={{ ...dependencies, name: state.name }}
      />
      <div className="row justify-content-center">
        <div className="col-md-8 mb-2">
          <div className="cs__btn__tabs cs__btn__tabs__center">
            <button
              type="button"
              className={`cs__tabs__btn ${rType === "flights" && "cs__active"}`}
              onClick={() => setRType("flights")}
            >
              <span className="material-icons-sharp">airlines</span>
              <p>Flights</p>
            </button>
            <button
              type="button"
              className={`cs__tabs__btn ${rType === "hotels" && "cs__active"}`}
              onClick={() => setRType("hotels")}
            >
              <span className="material-icons-sharp">bed</span>
              <p>Hotel</p>
            </button>
            <button
              type="button"
              className={`cs__tabs__btn ${
                rType === "bookings" && "cs__active"
              }`}
              onClick={() => setRType("bookings")}
            >
              <span className="material-icons-sharp">meeting_room</span>
              <p>Meeting Room</p>
            </button>
          </div>
        </div>

        <div className="col-md-8 mt-2">
          <div className="form__area">
            {rType === "flights" && (
              <>
                <CSForm
                  lg={12}
                  md={12}
                  txtHeader="Book a Flight"
                  formSubmit={handleReservation}
                >
                  <div className="col-md-8 mb-4">
                    <CSInput
                      label="Staff Name"
                      value={state.name}
                      onChange={(e) =>
                        setState({ ...state, name: e.target.value })
                      }
                      readOnly
                    />
                  </div>
                  <div className="col-md-4 mb-4">
                    <CSSelect
                      label="Type"
                      value={state.flight_type}
                      onChange={(e) =>
                        setState({ ...state, flight_type: e.target.value })
                      }
                    >
                      <CSSelectOptions
                        label="Select Flight Type"
                        value=""
                        disabled
                      />

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
                  <div className="col-md-4 mb-4">
                    <CSInput
                      label="Take Off"
                      type="date"
                      value={state.begin}
                      onChange={(e) =>
                        setState({ ...state, begin: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-4 mb-4">
                    <CSInput
                      label="Return"
                      type="date"
                      value={state.elapse}
                      onChange={(e) =>
                        setState({ ...state, elapse: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-4 mb-4">
                    <CSInput
                      label="Budget Code"
                      value={state.budget_code}
                      onChange={(e) =>
                        setState({ ...state, budget_code: e.target.value })
                      }
                      placeholder="Enter Budget Code"
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <CSInput
                      label="From"
                      value={state.take_off}
                      onChange={(e) =>
                        setState({ ...state, take_off: e.target.value })
                      }
                      placeholder="Enter Desired Takeoff State"
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <CSInput
                      label="To"
                      value={state.destination}
                      onChange={(e) =>
                        setState({ ...state, destination: e.target.value })
                      }
                      placeholder="Enter Destination"
                    />
                  </div>
                  <div className="col-md-4 mb-4">
                    <CSInput
                      label="Approval Memo"
                      type="file"
                      value={state.approval_memo}
                      onChange={(e) =>
                        setState({ ...state, approval_memo: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-4 mb-4">
                    <CSInput
                      label="Data Page"
                      type="file"
                      value={state.data_page}
                      onChange={(e) =>
                        setState({ ...state, data_page: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-4 mb-4">
                    <CSInput
                      label="Visa Page"
                      type="file"
                      value={state.visa}
                      onChange={(e) =>
                        setState({ ...state, visa: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-12 mb-4">
                    <CSTextarea
                      label="Instructions"
                      value={state.description}
                      onChange={(e) =>
                        setState({ ...state, description: e.target.value })
                      }
                      rows={5}
                      placeholder="Enter additional Info Here"
                    />
                  </div>
                  <div className="col-md-12">
                    <CSButton
                      text="Make Request"
                      type="submit"
                      variant="primary"
                      icon="send"
                      size="lg"
                      isLoading={isLoading}
                      block
                      disabled={
                        state.name === "" ||
                        state.flight_type === "" ||
                        state.take_off === "" ||
                        state.destination === "" ||
                        state.begin === "" ||
                        state.elapse === ""
                      }
                    />
                  </div>
                </CSForm>
              </>
            )}

            {rType === "hotels" && (
              <>
                <CSForm
                  lg={12}
                  md={12}
                  txtHeader="Hotel Reservation"
                  formSubmit={handleReservation}
                >
                  <div className="col-md-12 mb-4">
                    <CSInput
                      label="Staff Name"
                      value={state.name}
                      onChange={(e) =>
                        setState({ ...state, name: e.target.value })
                      }
                      readOnly
                    />
                  </div>
                  <div className="col-md-4 mb-4">
                    <CSInput
                      label="Check In"
                      type="date"
                      value={state.begin}
                      onChange={(e) =>
                        setState({ ...state, begin: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-4 mb-4">
                    <CSInput
                      label="Check Out"
                      type="date"
                      value={state.elapse}
                      onChange={(e) =>
                        setState({ ...state, elapse: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-4 mb-4">
                    <CSInput
                      label="Budget Code"
                      value={state.budget_code}
                      onChange={(e) =>
                        setState({ ...state, budget_code: e.target.value })
                      }
                      placeholder="Enter Budget Code"
                    />
                  </div>
                  <div className="col-md-12 mb-4">
                    <CSInput
                      label="Destination"
                      value={state.destination}
                      onChange={(e) =>
                        setState({ ...state, destination: e.target.value })
                      }
                      placeholder="Enter Destination"
                    />
                  </div>
                  <div className="col-md-12 mb-4">
                    <CSTextarea
                      label="Instructions"
                      value={state.description}
                      onChange={(e) =>
                        setState({ ...state, description: e.target.value })
                      }
                      rows={5}
                      placeholder="Enter additional Info Here"
                    />
                  </div>
                  <div className="col-md-12">
                    <CSButton
                      text="Make Request"
                      type="submit"
                      variant="primary"
                      icon="send"
                      size="lg"
                      isLoading={isLoading}
                      block
                      disabled={
                        state.name === "" ||
                        state.begin === "" ||
                        state.elapse === ""
                      }
                    />
                  </div>
                </CSForm>
              </>
            )}

            {rType === "bookings" && (
              <>
                <CSForm lg={12} md={12} txtHeader="Reserve A Room">
                  <div className="col-md-8 mb-4">
                    <CSInput
                      label="Requisitor"
                      value={state.name}
                      onChange={(e) =>
                        setState({ ...state, name: e.target.value })
                      }
                      readOnly
                    />
                  </div>
                  <div className="col-md-4 mb-4">
                    <CSInput
                      label="Budget Code"
                      value={state.budget_code}
                      onChange={(e) =>
                        setState({ ...state, budget_code: e.target.value })
                      }
                      placeholder="Enter Budget Code"
                    />
                  </div>
                  <div className="col-md-12 mb-4">
                    <CSInput
                      label="Purpose of Meeting"
                      value={state.title}
                      onChange={(e) =>
                        setState({ ...state, title: e.target.value })
                      }
                      placeholder="Enter Purpose of Meeting"
                    />
                  </div>

                  <div className="col-md-4 mb-4">
                    <CSInput
                      label="Start"
                      type="date"
                      value={state.start}
                      onChange={(e) =>
                        setState({ ...state, start: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-2 mb-4">
                    <CSInput
                      label="Time"
                      type="time"
                      value={state.start_time}
                      onChange={(e) =>
                        setState({ ...state, start_time: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-4 mb-4">
                    <CSInput
                      label="End"
                      type="date"
                      value={state.finish}
                      onChange={(e) =>
                        setState({ ...state, finish: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-2 mb-4">
                    <CSInput
                      label="Time"
                      type="time"
                      value={state.finish_time}
                      onChange={(e) =>
                        setState({ ...state, finish_time: e.target.value })
                      }
                    />
                  </div>

                  <div className="cs__flex cs__justify__end mt-4">
                    <button
                      type="button"
                      className="cs__tabs__btn"
                      onClick={() => setShow(true)}
                    >
                      <span className="material-icons-sharp">add_box</span>
                      <p>Add Booking Detail</p>
                    </button>
                  </div>
                </CSForm>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MakeReservation;
