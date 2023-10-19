import moment from "moment";
import CSButton from "../forms/CSButton";

const ReservationTicketCard = ({
  tId = 0,
  type = "",
  staff = "",
  begin = "",
  elapse = "",
  takeOff = "",
  destination = "",
  instructions = "",
  lg = 6,
  md = 6,
  sm = 12,
  isUpdating = false,
  inReview = false,
  cancel = undefined,
  confirm = undefined,
  addReservationOption = undefined,
  manage = undefined,
  status = "",
  stage = "",
}) => {
  return (
    <div className={`col-lg-${lg} col-md-${md} col-sm-${sm}`}>
      <div className="ticket__card">
        <div className="ticket__card__header mb-2">
          <span className="material-icons-sharp">
            {type === "flight" ? "flight_takeoff" : "bed"}
          </span>
          <p>{type?.toUpperCase()}</p>
        </div>
        <div className="ticket__card__body">
          <h3>{staff}</h3>
          <small>
            {moment(begin).format("LL") + " - " + moment(elapse).format("LL")}
          </small>
        </div>
        <div className="ticket__card__details">
          <small>
            {type === "flight"
              ? "Flight Request Details"
              : "Booking Request Details"}
          </small>
          <h3>
            {type === "flight" ? `${takeOff} - ${destination}` : destination}
          </h3>
          <p>{instructions}</p>
        </div>
        <div className="ticket__card__footer">
          {inReview ? (
            <CSButton
              text={`Add ${type === "flight" ? "Flight" : "Booking"} Option`}
              variant="primary"
              icon={`${type === "flight" ? "flight" : "bed"}`}
              size="lg"
              handleClick={() => addReservationOption(tId)}
              small
              block
            />
          ) : (
            <CSButton
              text={`Update ${type === "flight" ? "Booking" : "Reservation"}`}
              variant="dark"
              icon="verified"
              size="lg"
              handleClick={() => manage(tId)}
              disabled={
                isUpdating || status !== "pending" || stage !== "registered"
              }
              small
              block
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationTicketCard;
