import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../layouts/includes/PageHeader";
import moment from "moment";
import CSButton from "../../../layouts/components/forms/CSButton";
import MeetingRoomCard from "../../../layouts/components/cards/MeetingRoomCard";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Alert from "../../../services/alert";

const ViewMeetingSchedule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();

  const [booking, setBooking] = useState(null);
  const [details, setDetails] = useState([]);
  const [task, setTask] = useState(null);

  const deleteRequest = () => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You will not be able to reverse this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          axios
            .delete(`bookings/${booking?.id}`)
            .then((res) => {
              const response = res.data;
              Alert.success("Deleted!!", response.message);
              navigate("/requests/meeting/rooms");
            })
            .catch((err) => {
              Alert.error("Oops!!", "Something went wrong");
              console.error(err.message);
            });
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  useEffect(() => {
    if (location && location.state !== null) {
      const { booking } = location.state;
      setBooking(booking);
      setDetails(booking?.attributes?.details);
      setTask(booking?.attributes?.task);
    }
  }, [location]);

  return (
    <>
      <div className="row">
        <PageHeader
          text="Meeting Schedule"
          icon="event"
          btnIcon="arrow_back"
          btnText="Go Back"
          handleClick={() => navigate(-1)}
        />

        <div className="col-md-12 mb-4">
          <div className="schedule__card">
            <div className="ttp mb-3">
              <div className="writing">
                <small>{booking?.code}</small>
                <h2>{booking?.title}</h2>
              </div>
              <div className="status__text">
                <span>{booking?.status}</span>
              </div>
            </div>

            <div className="schedule__mid__sec">
              <p className="mb-3">{booking?.description}</p>
              <h3 className="mb-2">
                Budget Code: {booking?.budget_code ?? "N/A"}
              </h3>
              <div className="event__head">
                <span className="material-icons-sharp">event</span>
                <p>
                  Start: {moment(`${booking?.start}`).format("MMM Do, h:mm a")}
                </p>
              </div>
              <div className="event__head mb-4">
                <span className="material-icons-sharp">event</span>
                <p>
                  Finish:{" "}
                  {moment(`${booking?.finish}`).format("MMM Do, h:mm a")}
                </p>
              </div>

              <CSButton
                text="Delete Booking Request"
                icon="close"
                variant="danger"
                disabled={
                  task?.assignees?.length > 0 || booking?.status !== "pending"
                }
                small
                handleClick={() => deleteRequest()}
              />
            </div>
          </div>
        </div>

        {details.map((detail, i) => (
          <div className="col-md-4" key={i}>
            <MeetingRoomCard detail={detail} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ViewMeetingSchedule;
