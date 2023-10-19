import { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AuthProvider";
import CSForm from "../../../layouts/components/forms/CSForm";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import AddReservation from "./AddReservation";
import moment from "moment";
import Alert from "../../../services/alert";
import CSButton from "../../../layouts/components/forms/CSButton";
import { unique } from "../../../services/helpers";
import { useNavigate } from "react-router-dom";

const MakeBooking = () => {
  const initialState = {
    id: 0,
    user_id: 0,
    code: "",
    budget_code: "",
    description: "",
    booking_type: "",
  };
  const { auth } = useAppContext();
  const [state, setState] = useState(initialState);
  const [requisitor, setRequisitor] = useState("");
  const [reservations, setReservations] = useState([]);
  const [staff, setStaff] = useState([]);
  const [data, setData] = useState(undefined);
  const [show, setShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const confirmBooking = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
      reservations,
    };

    // console.log(requests);
    setIsLoading(true);

    try {
      axios
        .post("logisticsRequests", requests)
        .then((res) => {
          const response = res.data;
          Alert.success("Confirmed!!", response.message);
          setIsLoading(false);
          setState(initialState);
          setReservations([]);
          handleClose();
          navigate("/requests/make/booking");
        })
        .catch((err) => {
          console.error(err.message);
          setIsLoading(false);
          Alert.error("Oops!!", err.response.data.message);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setReservations(
        reservations.map((reserve) => {
          if (reserve.id == response?.data?.id) {
            return response?.data;
          }

          return reserve;
        })
      );
    } else {
      setReservations([response?.data, ...reservations]);
    }

    // Alert.success(response?.status, response?.message);
    handleClose();
  };

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setData(undefined);
  };

  //   console.log(reservations);

  const handleForm = (typ) => {
    setState({
      ...state,
      booking_type: typ,
    });

    setShow(true);
  };

  const manage = (raw) => {
    // console.log(raw);
    setData(raw);
    setIsUpdating(true);
    setShow(true);
  };

  const removeReservation = (rawId) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You will not be able to reverse this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        setReservations(
          reservations.filter(
            (reserve) => parseInt(reserve?.id) === parseInt(rawId)
          )
        );
      }
    });
  };

  useEffect(() => {
    if (auth !== null && auth?.user) {
      const { user } = auth;

      setState({
        ...state,
        user_id: user?.id,
        code: "REV" + unique(),
      });

      setRequisitor(user?.name);
    }
  }, [auth]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    try {
      axios
        .get("department/staff")
        .then((res) => {
          setStaff(res.data?.data);
        })
        .catch((er) => console.error(er.message));
    } catch (err) {
      console.error(err);
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <>
      <AddReservation
        title={`Make ${
          state.booking_type === "flight" ? " Flight " : " Hotel "
        }Booking`}
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
        dependencies={{
          staff,
          type: state.booking_type,
          resLength: reservations?.length,
        }}
      />
      <div className="row">
        <PageHeader text="Make a Reservation" />

        <CSForm lg={8} md={8} noHeader formSubmit={confirmBooking}>
          <div className="col-md-12 mb-3">
            <CSTextarea
              label="Purpose for Reservation"
              value={state.description}
              onChange={(e) =>
                setState({ ...state, description: e.target.value })
              }
              placeholder="Enter Purpose for Reservation"
              rows={2}
            />
          </div>
          <div className="col-md-5 mb-3">
            <CSInput
              label="Request Code"
              value={state.code}
              onChange={(e) => setState({ ...state, code: e.target.value })}
              placeholder="Request Code"
              disabled
            />
          </div>
          <div className="col-md-7 mb-4">
            <CSInput
              label="Budget Head to Fund this Request"
              value={state.budget_code}
              onChange={(e) =>
                setState({ ...state, budget_code: e.target.value })
              }
              placeholder="Enter Budget Head Code"
            />
          </div>

          <div className="col-md-12 mb-4">
            <div className="add__section">
              <button
                className="add__section__btn"
                type="button"
                onClick={() => handleForm("flight")}
              >
                <span className="material-icons-sharp">flight</span>
                <p>Add Flight Booking</p>
              </button>
              <button
                className="add__section__btn"
                type="button"
                onClick={() => handleForm("hotel")}
              >
                <span className="material-icons-sharp">bed</span>
                <p>Add Hotel Reservation</p>
              </button>
            </div>
          </div>

          <div className="col-md-12 mb-4">
            <div className="reservation__section">
              <div className="row">
                {reservations?.length > 0 ? (
                  reservations?.map((reserve, i) => (
                    <div className="col-md-6" key={i}>
                      <div className="reservation__card">
                        <div className="h__category">
                          <span className="material-icons-sharp">
                            {reserve?.type === "flight"
                              ? "flight_takeoff"
                              : "bed"}
                          </span>
                          <p>{reserve?.type?.toUpperCase()}</p>
                        </div>
                        <div className="h__reserve">
                          <h3>{reserve?.name}</h3>
                          <small>
                            {reserve?.type === "flight"
                              ? `${reserve?.take_off} - ${reserve?.destination}`
                              : reserve?.destination}
                          </small>
                        </div>
                        <div className="h__body">
                          <p>{reserve?.instructions}</p>
                        </div>
                        <div className="h__footer">
                          <small>{`${moment(reserve?.begin).format(
                            "LL"
                          )} - ${moment(reserve?.elapse).format("LL")}`}</small>
                          <small>{reserve?.request_type}</small>
                        </div>

                        <div className="btn__footer">
                          <button
                            type="button"
                            className="reserve__btn cs__bg__success"
                            onClick={() => manage(reserve)}
                          >
                            <span className="material-icons-sharp">edit</span>
                            <p>Modify</p>
                          </button>
                          <button
                            type="button"
                            className="reserve__btn cs__bg__danger"
                            onClick={() => removeReservation(reserve?.id)}
                          >
                            <span className="material-icons-sharp">delete</span>
                            <p>Remove</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-md-12">
                    <p>There are no reservations yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <CSButton
              text="Confirm Booking"
              type="submit"
              variant="primary"
              icon="verified"
              size="lg"
              isLoading={isLoading}
              block
              disabled={
                state.code === "" ||
                state.user_id < 1 ||
                state.budget_code === "" ||
                state.description === "" ||
                reservations?.length < 1
              }
            />
          </div>
        </CSForm>

        <div className="col-md-4 col-lg-4 col-sm-12">
          <div className="reservation__summary">
            <div className="summary__header mb-3">
              <h3>Summary</h3>
            </div>
            <div className="summary__body">
              <table className="ticket__summary__table mb-3">
                <tbody>
                  <tr>
                    <td>PNR:</td>
                    <td>{state.code}</td>
                  </tr>
                  <tr>
                    <td>REQUISITOR:</td>
                    <td>{requisitor?.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td>BUDGET CODE:</td>
                    <td>{state.budget_code?.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td>PURPOSE:</td>
                    <td>{state.description?.toUpperCase()}</td>
                  </tr>
                </tbody>
              </table>

              <div className="reservations">
                {reservations?.map((reserve, i) => (
                  <div className="reservation__items" key={i}>
                    <div className="reserve__left">
                      <span className="material-icons-sharp">
                        {reserve?.type === "flight" ? "flight_takeoff" : "bed"}
                      </span>
                    </div>
                    <div className="reserve__right">
                      <h3>{reserve?.name}</h3>
                      <small>
                        {moment(reserve?.begin).format("LL") +
                          " - " +
                          moment(reserve?.elapse).format("LL")}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MakeBooking;
