import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../layouts/includes/PageHeader";
import CSForm from "../../../layouts/components/forms/CSForm";
import { useAppContext } from "../../../context/AuthProvider";
import { formatSelectOptions, unique } from "../../../services/helpers";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import CSButton from "../../../layouts/components/forms/CSButton";
import AddMeetingSchedule from "./AddMeetingSchedule";
import Alert from "../../../services/alert";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import moment from "moment";
import MeetingRoomCard from "../../../layouts/components/cards/MeetingRoomCard";

const ScheduleMeeting = () => {
  const navigate = useNavigate();
  const { auth } = useAppContext();

  const initialState = {
    id: 0,
    user_id: 0,
    code: "",
    title: "",
    budget_code: "",
    start: "",
    startTime: "",
    finish: "",
    endTime: "",
    duration: 0,
    description: "",
    closed: false,
  };

  const [state, setState] = useState(initialState);
  const [details, setDetails] = useState([]);
  const [show, setShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const [dependencies, setDependencies] = useState({});

  const axios = useAxiosPrivate();

  const scheduleMeeting = (e) => {
    e.preventDefault();

    const body = {
      ...state,
      start: moment(`${state.start} ${state.startTime}`).format(
        "MMMM Do YYYY, h:mm a"
      ),
      finish: moment(`${state.finish} ${state.endTime}`).format(
        "MMMM Do YYYY, h:mm a"
      ),
      details,
    };

    setIsLoading(true);

    try {
      axios
        .post("bookings", body)
        .then((res) => {
          const response = res.data;
          Alert.success("Request Confirmed!", response.message);
          setIsLoading(false);
          setState(initialState);
          navigate("/requests/meeting/rooms");
        })
        .catch((err) => {
          setIsLoading(false);
          Alert.error("Oops", "Something went wrong");
          console.error(err.message);
        });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setDetails(
        details.map((detail) => {
          if (parseInt(detail.id) === parseInt(response?.data?.id)) {
            return response?.data;
          }

          return detail;
        })
      );
    } else {
      setDetails([response?.data, ...details]);
    }

    Alert.success(response?.status, response?.message);
    handleClose();
  };

  const handleClose = () => {
    setShow(false);
    setIsUpdating(false);
    setData(undefined);
    setIsLoading(false);
  };

  const removeItem = (item) => {
    setDetails(details.filter((detail) => detail?.id !== item?.id));
    Alert.success(
      "Removed!!",
      "This schedule has been removed from this request"
    );
  };

  useEffect(() => {
    if (state.start !== "" && state.startTime !== "") {
      setState({
        ...state,
        finish: state.start,
        endTime: state.startTime,
      });
    }
  }, [state.start, state.startTime]);

  useEffect(() => {
    if (auth) {
      const { user } = auth;

      setState({
        ...state,
        user_id: user?.id,
        code: unique("RMK"),
      });
    }
  }, [auth]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    try {
      const urls = ["rooms", "seatings", "users"];

      const requests = urls.map((url) => axios.get(url));

      Promise.all(requests)
        .then((responses) => {
          const tResponse = responses[2].data?.data;
          setDependencies({
            rooms: responses[0].data?.data,
            seatings: responses[1].data?.data,
            staff: formatSelectOptions(tResponse, "id", "name"),
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

  return (
    <>
      <AddMeetingSchedule
        title="Create Schedule"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
        dependencies={{ ...dependencies }}
      />

      <div className="row">
        <PageHeader
          text="Schedule a Meeting"
          btnIcon="arrow_back"
          btnText="Go Back"
          variant="dark"
          handleClick={() => {
            navigate(-1);
          }}
        />

        <div className="col-md-12">
          <div className="row">
            <CSForm lg={9} md={8} noHeader formSubmit={scheduleMeeting}>
              <div className="col-md-3 mb-4">
                <CSInput
                  label="Request Code"
                  value={state.code}
                  onChange={(e) => setState({ ...state, code: e.target.value })}
                  readOnly
                />
              </div>
              <div className="col-md-3 mb-4">
                <CSInput
                  label="Budget Code (Optional)"
                  value={state.budget_code}
                  onChange={(e) =>
                    setState({ ...state, budget_code: e.target.value })
                  }
                  placeholder="Enter Budget Code"
                />
              </div>
              <div className="col-md-6 mb-4">
                <CSInput
                  label="Purpose"
                  value={state.title}
                  onChange={(e) =>
                    setState({ ...state, title: e.target.value })
                  }
                  placeholder="Enter Meeting Purpose"
                />
              </div>
              <div className="col-md-4 mb-4">
                <CSInput
                  label="Begin"
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
                  value={state.startTime}
                  onChange={(e) =>
                    setState({ ...state, startTime: e.target.value })
                  }
                />
              </div>
              <div className="col-md-4 mb-4">
                <CSInput
                  label="Elapse"
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
                  value={state.endTime}
                  onChange={(e) =>
                    setState({ ...state, endTime: e.target.value })
                  }
                />
              </div>
              <div className="col-md-12 mb-4">
                <p className="cs__form-label">Meeting Schedules</p>
                <div className="panel">
                  <CSButton
                    text="Add Meeting Schdule"
                    icon="event"
                    variant="dark"
                    isLoading={isLoading}
                    handleClick={() => setShow(true)}
                    borderRadius
                    block
                    small
                  />
                </div>
              </div>
              <div className="col-md-12 mb-4">
                <CSTextarea
                  label="Description"
                  value={state.description}
                  onChange={(e) =>
                    setState({ ...state, description: e.target.value })
                  }
                  placeholder="Enter Description of Meeting"
                  rows={8}
                />
              </div>
              <div className="col-md-12">
                <CSButton
                  text="Confirm Booking Request"
                  type="submit"
                  icon="mail"
                  variant="primary"
                  disabled={
                    state.title === "" ||
                    state.start === "" ||
                    state.finish === "" ||
                    state.startTime === "" ||
                    state.endTime === "" ||
                    details?.length < 1
                  }
                  block
                />
              </div>
            </CSForm>

            <div className="col-lg-3 col-md-4 col-sm-12">
              {details?.length > 0 ? (
                details?.map((detail, i) => (
                  <MeetingRoomCard
                    detail={detail}
                    key={i}
                    remove={removeItem}
                    adding
                  />
                ))
              ) : (
                <div className="no__card">
                  <p>No Schedule has been Added Yet!!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleMeeting;
