import { useEffect, useState } from "react";
import CSForm from "../../../layouts/components/forms/CSForm";
import CSSelect from "../../../layouts/components/forms/CSSelect";
import CSSelectOptions from "../../../layouts/components/forms/CSSelectOptions";
import CSInput from "../../../layouts/components/forms/CSInput";
import CSButton from "../../../layouts/components/forms/CSButton";
import CSBox from "../../../layouts/components/forms/CSBox";
import Modal from "../../../layouts/components/modals/Modal";
import CSTextarea from "../../../layouts/components/forms/CSTextarea";

const AddBooking = ({
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
    user_id: 0,
    room_id: 0,
    seating_id: 0,
    start: "",
    finish: "",
    duration: 0,
    pa_system: false,
    audio_visual_system: false,
    internet: false,
    tea_snacks: false,
    breakfast: false,
    lunch: false,
    description: "",
    participants: 0,
    contact_person: "",
  };

  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [seatings, setSeatings] = useState([]);
  const [rooms, setRooms] = useState([]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    handleSubmit({
      data: state,
      message: "added",
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
  };

  useEffect(() => {
    if (
      dependencies !== undefined &&
      dependencies?.seatings?.length > 0 &&
      dependencies?.rooms?.length > 0 &&
      dependencies?.name !== ""
    ) {
      const { rooms, seatings, name } = dependencies;

      setSeatings(seatings);
      setRooms(rooms);
      setState({
        ...state,
        contact_person: name,
      });
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
        <div className="col-md-12 mb-4">
          <CSSelect
            label="Room"
            id="room_id"
            value={state.room_id}
            onChange={(e) => setState({ ...state, room_id: e.target.value })}
          >
            <CSSelectOptions value={0} label="Select Room" disabled />

            {rooms?.map((room, i) => (
              <CSSelectOptions key={i} value={room?.id} label={room?.name} />
            ))}
          </CSSelect>
        </div>

        <div className="col-md-3 mb-4">
          <CSInput
            id="participants"
            type="number"
            label="Participants"
            value={state.participants}
            onChange={(e) =>
              setState({ ...state, participants: e.target.value })
            }
          />
        </div>

        <div className="col-md-4 mb-4">
          <CSInput
            id="name"
            label="Contact"
            placeholder="Enter Name"
            value={state.contact_person}
            onChange={(e) =>
              setState({ ...state, contact_person: e.target.value })
            }
            readOnly
          />
        </div>

        <div className="col-md-5 mb-4">
          <CSSelect
            label="Seating"
            id="seating_id"
            value={state.seating_id}
            onChange={(e) => setState({ ...state, seating_id: e.target.value })}
          >
            <CSSelectOptions
              label="Select Seating Arrangement"
              value={0}
              disabled
            />
            {seatings.map((seating) => (
              <CSSelectOptions
                key={seating.id}
                label={seating.name}
                value={seating.id}
              />
            ))}
          </CSSelect>
        </div>

        <div className="col-md-12 mb-4">
          <div className="panel">
            <p className="cs__form-label mb-3">Required IT Services</p>
            <div className="row">
              <div className="col-md-4">
                <CSBox
                  label="PA System"
                  id="pa-system"
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
                  id="audio-visual"
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
                  id="internet"
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
        <div className="col-md-12 mb-4">
          <div className="panel">
            <p className="cs__form-label mb-3">Required Refreshments</p>
            <div className="row">
              <div className="col-md-4">
                <CSBox
                  label="Tea/Snacks"
                  id="tea-snacks"
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
                  id="breakfast"
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
                  id="lunch"
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
            text="Submit"
            type="submit"
            variant="primary"
            icon="send"
            size="lg"
            isLoading={isLoading}
            block
            disabled={state.name === "" || state.stock_category_id === 0}
          />
        </div>
      </CSForm>
    </Modal>
  );
};

export default AddBooking;
