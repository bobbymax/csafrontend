import { useEffect, useState } from "react";
import PageHeader from "../../../layouts/includes/PageHeader";
import { useLocation, useNavigate } from "react-router-dom";
import CSButton from "../../../layouts/components/forms/CSButton";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Alert from "../../../services/alert";

const Reservation = () => {
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [display, setDisplay] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const confirmItinerary = (itinerary) => {
    const url =
      booking?.type === "flight"
        ? "/requests/flight/reservations"
        : "/requests/hotel/bookings";

    const body = {
      status: "accepted",
      reservation_id: booking?.id,
      itineraries: itineraries.filter((iti) => iti?.id !== itinerary?.id),
    };

    Alert.flash(
      "Are you sure?",
      "warning",
      "You are about to confirm this booking!!"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          axios
            .patch(`consonances/${itinerary?.id}`, body)
            .then((res) => {
              const response = res.data;
              Alert.success("Confirmed!!", response.message);
              navigate(url);
            })
            .catch((err) => {
              console.error(err.message);
              setIsLoading(false);
            });
        } catch (error) {
          console.error(error);
          setIsLoading(false);
        }
      }
    });
  };

  useEffect(() => {
    if (location && location.state !== null && location.state?.data) {
      const { data } = location.state;

      const dis =
        data?.type === "flight"
          ? `${data?.take_off} - ${data?.destination}`
          : data?.destination;

      setBooking(data);
      setItineraries(data?.attributes?.itineraries);
      setDisplay(dis);
    }
  }, [location]);

  return (
    <>
      <div className="row">
        <PageHeader
          text="Reservation Details"
          icon={booking && booking?.type === "flight" ? "airlines" : "bed"}
          btnText="Go Back"
          handleClick={() => navigate(-1)}
          btnIcon="arrow_back"
        />

        <div className="col-md-5 mb-4">
          <div className="reservation__details">
            <div className="details__body mt-4">
              <div className="itinerary">
                <span className="material-icons-sharp">
                  {booking && booking?.type === "flight" ? "airlines" : "bed"}
                </span>
                <h2>{display}</h2>
              </div>
              <div className="itinerary__details">
                <div className="row">
                  <div className="col-md-6">
                    <small>
                      {booking?.type === "flight" ? "Takeoff" : "Check In"}
                    </small>
                    <p>{booking?.begin}</p>
                  </div>
                  <div className="col-md-6">
                    <small>
                      {booking?.type === "flight" ? "Destination" : "Check Out"}
                    </small>
                    <p>{booking?.begin}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="booking__options">
            <div className="row">
              {itineraries.map((iti, i) => (
                <div className="col-md-4" key={i}>
                  <div className="iti__dets">
                    <p className="desc">{iti?.description}</p>

                    <CSButton
                      text="Accept"
                      variant="dark"
                      icon="mail"
                      isLoading={isLoading}
                      handleClick={() => confirmItinerary(iti)}
                      disabled={iti.status !== "pending"}
                      block
                      small
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reservation;
