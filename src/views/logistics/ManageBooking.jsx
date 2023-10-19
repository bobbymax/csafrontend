import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import PageHeader from "../../layouts/includes/PageHeader";
import logo from "../../assets/images/logo.png";
import moment from "moment";
import CSButton from "../../layouts/components/forms/CSButton";
import ReservationTicketCard from "../../layouts/components/cards/ReservationTicketCard";
import AddItinerary from "./AddItinerary";
import { useAppContext } from "../../context/AuthProvider";
import Alert from "../../services/alert";

const ManageBooking = () => {
  const axios = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();

  const { auth } = useAppContext();

  const [booking, setBooking] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [staff, setStaff] = useState(null);
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingReservation, setIsUpdatingReservation] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);

  const manage = (rawId) => {
    const raw = getReservation(rawId);

    setReservation(raw);
    setIsUpdating(true);
  };

  const addItinerary = (tId) => {
    const raw = getReservation(tId);
    setShow(true);
  };

  const updateLogisticsRequest = () => {
    const body = {
      status: "processing",
    };

    setIsLoading(true);

    try {
      axios
        .patch(`status/logisticsRequests/${booking?.id}`, body)
        .then((res) => {
          const response = res.data;
          Alert.success("Processing!!", response.message);
          navigate("/logistics/reservations");
        })
        .catch((err) => {
          setIsLoading(false);
          console.error(err.message);
        });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const submitForReview = () => {
    const body = {
      user_id: auth?.user?.id,
      reservation_id: reservation.id,
      itineraries,
    };

    setIsLoading(true);

    try {
      axios
        .post("reservations", body)
        .then((res) => {
          const response = res.data;
          setReservations(
            reservations.map((reserve) => {
              if (reserve.id === parseInt(response.data.id)) {
                return response.data;
              }

              return reserve;
            })
          );
          cancelSelection();
          setIsLoading(false);
          Alert.success("Confirmed!!", response.message);
        })
        .catch((err) => {
          setIsLoading(false);
          console.error(err.message);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getReservation = (tId) => {
    return reservations.filter(
      (reserve) => parseInt(reserve?.id) === parseInt(tId)
    )[0];
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setItineraries(
        itineraries.map((iti) => {
          if (
            parseInt(iti.id) === parseInt(response?.data?.id) &&
            parseInt(iti.reservation_id) === parseInt(reservation?.id)
          ) {
            return response?.data;
          }

          return iti;
        })
      );
    } else {
      setItineraries([response?.data, ...itineraries]);
    }
    handleClose();
  };

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
  };

  const removeItinerary = (iti) => {
    setItineraries(itineraries.filter((itine) => itine?.id !== iti?.id));
  };

  const cancelSelection = () => {
    setReservation(null);
    setItineraries([]);
    handleClose();
  };

  useEffect(() => {
    if (location && location?.state !== null && location?.state?.data) {
      const { data } = location?.state;
      setBooking(data);
    }
  }, [location]);

  useEffect(() => {
    if (booking !== null && booking?.attributes) {
      const { requisitor, reservations, task } = booking?.attributes;

      setReservations(reservations);
      setStaff(requisitor);
      setTask(task);
    }
  }, [booking]);

  useEffect(() => {
    if (reservations?.length > 0) {
      const pending = reservations.filter((re) => re.stage === "registered");

      setIsPending(pending.length > 0);
    }
  }, [reservations]);

  // console.log(booking);

  return (
    <>
      <AddItinerary
        title="Add Itinerary"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdatingReservation}
        data={data}
        dependencies={{ reservation, arrLength: itineraries.length }}
      />

      <div className="row">
        <PageHeader
          md={12}
          text="Manage Booking"
          icon="engineering"
          btnText="Go Back"
          btnIcon="arrow_back"
          handleClick={() => navigate(-1)}
        />

        <div className="col-md-8 mt-3">
          <div className="invoice__card">
            {/* Invoice Header */}
            <div className="invoice__header">
              <div className="logo">
                <img src={logo} alt="Invoice Template Logo" />
                <div className="invoice__header__title">
                  <h2>Reservation Receipt</h2>
                  <small>something here</small>
                </div>
              </div>
              <div className="documents">
                <button type="button" className="invoice__btn cs__bg__success">
                  <span className="material-icons-sharp">visibility</span>
                  <p>View Documents</p>
                </button>
              </div>
            </div>
            {/* End of Invoice Header */}

            <div className="invoice__content">
              <div className="top__level mb-4">
                <div className="row">
                  <div className="col-md-5">
                    <h3>{staff?.name}</h3>
                    <p>
                      This logistics request with code {booking?.code} was
                      raised {moment(booking?.created_at).format("LL")} by the
                      identified staff as shows. Please provide support for the
                      reservations as listed below:
                    </p>
                  </div>

                  <div className="col-md-7">
                    <h3 style={{ textAlign: "right" }}>Budget Head Code</h3>
                    <p style={{ textAlign: "right" }}>
                      This request will be funded from the{" "}
                      <strong>{booking?.budget_code}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="reserves__section mb-4">
                <h3>List of Reservations</h3>
                <div className="reserve__ticket__card">
                  <div className="row">
                    {reservations.map((ticket, i) => (
                      <ReservationTicketCard
                        key={i}
                        tId={ticket?.id}
                        type={ticket?.type}
                        staff={ticket?.name}
                        begin={ticket?.begin}
                        elapse={ticket?.elapse}
                        takeOff={ticket?.take_off}
                        destination={ticket?.destination}
                        instructions={ticket?.instructions}
                        isUpdating={isUpdating}
                        status={ticket?.status}
                        stage={ticket?.stage}
                        manage={manage}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="invoice__footer">
                <CSButton
                  text="Submit"
                  variant="primary"
                  icon="verified"
                  size="lg"
                  isLoading={isLoading}
                  block
                  disabled={
                    isPending ||
                    booking?.status === "canceled" ||
                    booking?.status === "confirmed"
                  }
                  handleClick={() => updateLogisticsRequest()}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mt-3">
          <div className="invoice__card">
            <div className="row">
              {reservation !== null ? (
                <>
                  <ReservationTicketCard
                    lg={12}
                    md={12}
                    tId={reservation?.id}
                    type={reservation?.type}
                    staff={reservation?.name}
                    begin={reservation?.begin}
                    elapse={reservation?.elapse}
                    takeOff={reservation?.take_off}
                    destination={reservation?.destination}
                    instructions={reservation?.instructions}
                    status={reservation?.status}
                    stage={reservation?.stage}
                    isUpdating={isUpdating}
                    inReview={true}
                    addReservationOption={addItinerary}
                  />
                </>
              ) : (
                <p>There are no updates!!</p>
              )}

              <div className="col-md-12 mt-4">
                <div className="itis">
                  <h3 className="mb-3">Itineraries</h3>
                  {itineraries?.length > 0 ? (
                    itineraries?.map((iti, i) => (
                      <div className="itis__item" key={i}>
                        <p>{iti?.description}</p>
                        <CSButton
                          variant="danger"
                          icon="close"
                          size="lg"
                          small
                          handleClick={() => removeItinerary(iti)}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="itis__item">
                      <p>No Itinerary Uploaded yet..</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-12 mt-3">
                <CSButton
                  variant="dark"
                  icon="send"
                  text="Submit"
                  size="lg"
                  small
                  block
                  disabled={itineraries?.length < 1}
                  handleClick={submitForReview}
                />
                <CSButton
                  variant="danger"
                  icon="undo"
                  text="Cancel"
                  size="lg"
                  small
                  block
                  disabled={reservation === null}
                  handleClick={cancelSelection}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageBooking;
