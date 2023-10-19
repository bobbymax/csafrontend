import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSButton from "../../../layouts/components/forms/CSButton";
import MeetingRoomCard from "../../../layouts/components/cards/MeetingRoomCard";
import moment from "moment";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import Alert from "../../../services/alert";

const HandleMeetingSchedule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();

  const [booking, setBooking] = useState(null);
  const [details, setDetails] = useState([]);
  const [task, setTask] = useState(null);
  const [description, setDescription] = useState("");

  const handleAnswer = (item, status) => {
    const action = status === "approved" ? "Confirm" : "Deny";

    Alert.flash(
      "A Second Look!!",
      "warning",
      "You will not be able to reverse this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        const body = {
          status,
          remark: description,
        };
        try {
          axios
            .patch(`bookings/${item?.id}`, body)
            .then((res) => {
              const response = res.data;
              Alert.success(action, response.message);
              navigate("/operations/schedule/meeting");
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
          text="Handle Meeting Schedule"
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

              <CSTextarea
                label="Remark"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Enter Remark Here"
                disabled={booking?.status !== "pending"}
              />

              <CSButton
                text="Confirm Booking and Add to Calender"
                icon="event"
                variant="primary"
                disabled={booking?.status !== "pending"}
                small
                handleClick={() => handleAnswer(booking, "approved")}
              />
              <CSButton
                text="Deny Booking Request"
                icon="block"
                variant="danger"
                disabled={description === ""}
                small
                handleClick={() => handleAnswer(booking, "denied")}
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

export default HandleMeetingSchedule;
