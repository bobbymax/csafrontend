import { useEffect, useState } from "react";
import CSButton from "../../../layouts/components/forms/CSButton";
import Modal from "../../../layouts/components/modals/Modal";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSBox from "../../../layouts/components/forms/CSBox";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CSInput from "../../../layouts/components/forms/CSInput";
import Alert from "../../../services/alert";
import moment from "moment";

const AddMeetingSchedule = ({
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
    id: 0,
    booking_id: 0,
    contact_id: 0,
    room_id: 0,
    seating_id: 0,
    begin: "",
    beginTime: "",
    elapse: "",
    elapseTime: "",
    duration: 0,
    pa_system: false,
    audio_visual_system: false,
    internet: false,
    tea_snacks: false,
    breakfast: false,
    lunch: false,
    description: "",
    participants: 0,
    staff_name: "",
    room_name: "",
  };

  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [staff, setStaff] = useState([]);
  const [user, setUser] = useState({});
  const [rooms, setRooms] = useState([]);
  const [seatings, setSeatings] = useState([]);

  const animated = makeAnimated();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...state,
      id: isUpdating ? state.id : state.id + 1,
      start: moment(`${state.begin} ${state.beginTime}`).format(
        "MMMM Do YYYY, h:mm a"
      ),
      finish: moment(`${state.elapse} ${state.elapseTime}`).format(
        "MMMM Do YYYY, h:mm a"
      ),
    };

    handleSubmit({
      data: body,
      action: isUpdating ? "alter" : "store",
      status: isUpdating ? "Updated!!" : "Added!!",
      message: `Meeting Schedule has been ${
        isUpdating ? "updated!!" : "added!!"
      }`,
    });
    reset();
  };

  const handleModalClose = () => {
    reset();
    handleClose();
  };

  const reset = () => {
    setIsLoading(false);
    setState(initialState);
    setUser({});
  };

  useEffect(() => {
    if (user) {
      setState({
        ...state,
        contact_id: user?.value,
        staff_name: user?.label,
      });
    }
  }, [user]);

  useEffect(() => {
    if (state.begin !== "" && state.beginTime !== "") {
      setState({
        ...state,
        elapse: state.begin,
        elapseTime: state.beginTime,
      });
    }
  }, [state.begin, state.beginTime]);

  useEffect(() => {
    if (state.room_id > 0 && state.participants > 0) {
      const room = rooms.filter((rm) => rm.id === state.room_id)[0];

      setState({
        ...state,
        room_name: room?.name,
      });

      if (
        room &&
        parseInt(state.participants) > parseInt(room?.max_sitting_capacity)
      ) {
        Alert.error(
          "Not Permitted",
          "Selected number of participants are more than the maximum seating capacity for this meeting room. Please choose another option."
        );

        setState({
          ...state,
          participants: 0,
        });
      }
    } else {
      setStaff({
        ...state,
        room_name: "",
      });
    }
  }, [state.room_id, state.participants]);

  useEffect(() => {
    if (data) {
      setState(data);
    }
  }, [data]);

  useEffect(() => {
    if (
      dependencies &&
      dependencies?.staff &&
      dependencies?.rooms &&
      dependencies?.seatings
    ) {
      const { staff, rooms, seatings } = dependencies;
      setStaff(staff);
      setRooms(rooms);
      setSeatings(seatings);
    }
  }, [dependencies]);

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
          <label className="cs__form-label">Contact Person</label>
          <Select
            components={animated}
            options={staff}
            placeholder="Select Contact Person"
            value={user}
            onChange={setUser}
            isSearchable
          />
        </div>
        <div className="col-md-5 mb-3">
          <CSSelect
            id="room"
            label="Meeting Room"
            value={state.room_id}
            onChange={(e) =>
              setState({ ...state, room_id: parseInt(e.target.value) })
            }
          >
            <CSSelectOptions value={0} label="Select Meeting Room" disabled />

            {rooms.map((room, i) => (
              <CSSelectOptions key={i} label={room.name} value={room.id} />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-3 mb-3">
          <CSInput
            id="participants"
            type="number"
            label="Attendees"
            value={state.participants}
            onChange={(e) =>
              setState({ ...state, participants: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="col-md-4 mb-3">
          <CSSelect
            id="seating"
            label="Seating Arrangement"
            value={state.seating_id}
            onChange={(e) =>
              setState({ ...state, seating_id: parseInt(e.target.value) })
            }
          >
            <CSSelectOptions
              value={0}
              label="Select Seating Arrangement"
              disabled
            />

            {seatings.map((seating, i) => (
              <CSSelectOptions
                key={i}
                label={seating.name}
                value={seating.id}
              />
            ))}
          </CSSelect>
        </div>
        <div className="col-md-4 mb-4">
          <CSInput
            label="Begin"
            type="date"
            value={state.begin}
            onChange={(e) => setState({ ...state, begin: e.target.value })}
          />
        </div>
        <div className="col-md-2 mb-4">
          <CSInput
            label="Time"
            type="time"
            value={state.beginTime}
            onChange={(e) => setState({ ...state, beginTime: e.target.value })}
          />
        </div>
        <div className="col-md-4 mb-4">
          <CSInput
            label="Elapse"
            type="date"
            value={state.elapse}
            onChange={(e) => setState({ ...state, elapse: e.target.value })}
          />
        </div>
        <div className="col-md-2 mb-4">
          <CSInput
            label="Time"
            type="time"
            value={state.elapseTime}
            onChange={(e) => setState({ ...state, elapseTime: e.target.value })}
          />
        </div>
        <div className="col-md-12 mb-3">
          <p className="cs__form-label">Amenities</p>
          <div className="panel">
            <div className="row">
              <div className="col-md-4">
                <CSBox
                  label="PA System"
                  value={state.pa_system}
                  onChange={(e) =>
                    setState({ ...state, pa_system: e.target.checked })
                  }
                  checked={state.pa_system}
                />
              </div>
              <div className="col-md-4">
                <CSBox
                  label="Audio/Visual System"
                  value={state.audio_visual_system}
                  onChange={(e) =>
                    setState({
                      ...state,
                      audio_visual_system: e.target.checked,
                    })
                  }
                  checked={state.audio_visual_system}
                />
              </div>
              <div className="col-md-4">
                <CSBox
                  label="Internet"
                  value={state.internet}
                  onChange={(e) =>
                    setState({ ...state, internet: e.target.checked })
                  }
                  checked={state.internet}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 mb-3">
          <p className="cs__form-label">Refreshments</p>
          <div className="panel">
            <div className="row">
              <div className="col-md-4">
                <CSBox
                  label="Tea/Snacks"
                  value={state.tea_snacks}
                  onChange={(e) =>
                    setState({ ...state, tea_snacks: e.target.checked })
                  }
                  checked={state.tea_snacks}
                />
              </div>
              <div className="col-md-4">
                <CSBox
                  label="Breakfast"
                  value={state.breakfast}
                  onChange={(e) =>
                    setState({
                      ...state,
                      breakfast: e.target.checked,
                    })
                  }
                  checked={state.breakfast}
                />
              </div>
              <div className="col-md-4">
                <CSBox
                  label="Lunch"
                  value={state.lunch}
                  onChange={(e) =>
                    setState({ ...state, lunch: e.target.checked })
                  }
                  checked={state.lunch}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 mb-4">
          <CSTextarea
            label="Further Instructions"
            value={state.description}
            onChange={(e) =>
              setState({ ...state, description: e.target.value })
            }
            placeholder="Enter any further instructions here"
            rows={7}
          />
        </div>

        <div className="col-md-12">
          <CSButton
            text="Add Details"
            type="submit"
            variant="primary"
            icon="send"
            size="lg"
            isLoading={isLoading}
            block
            disabled={
              !user ||
              state.room_id < 1 ||
              state.participants < 1 ||
              state.seating_id < 1 ||
              state.begin === "" ||
              state.beginTime === "" ||
              state.elapse === "" ||
              state.elapseTime === ""
            }
          />
        </div>
      </CSForm>
    </Modal>
  );
};

export default AddMeetingSchedule;
