import moment from "moment";
import CSButton from "../forms/CSButton";

const MeetingRoomCard = ({
  detail,
  remove = undefined,
  adding = false,
  confirm = undefined,
  deny = undefined,
}) => {
  return (
    <div className="meeting_card">
      <h2 className="mb-2">{detail?.room_name}</h2>
      <div className="event__head">
        <span className="material-icons-sharp">event</span>
        <p>
          Start:{" "}
          {adding
            ? moment(`${detail?.begin} ${detail?.beginTime}`).format(
                "MMM Do, h:mm a"
              )
            : moment(detail?.start).format("MMM Do, h:mm a")}
        </p>
      </div>
      <div className="event__head">
        <span className="material-icons-sharp">event</span>
        <p>
          Finish:{" "}
          {adding
            ? moment(`${detail?.elapse} ${detail?.elapseTime}`).format(
                "MMM Do, h:mm a"
              )
            : moment(detail?.finish).format("MMM Do, h:mm a")}
        </p>
      </div>
      <div className="amenities__card mt-3 mb-3">
        <p>
          <span className="material-icons-sharp">call</span> Contact Person:
        </p>
        <h3>{detail?.staff_name}</h3>
      </div>

      <div className="more__details mb-3">
        <p>Amenities:</p>

        <ul className="dits mt-1">
          {detail?.pa_system && <li>{`PA System`}</li>}
          {detail?.audio_visual_system && <li>{`Audio/Visual System`}</li>}
          {detail?.internet && <li>{`Internet`}</li>}
        </ul>
      </div>

      <div className="more__details mb-4">
        <p>Refreshments:</p>

        <ul className="dits mt-1">
          {detail?.tea_snacks && <li>{`Tea & Snacks`}</li>}
          {detail?.breakfast && <li>{`Breakfast`}</li>}
          {detail?.luunch && <li>{`Lunch`}</li>}
        </ul>
      </div>

      {remove !== undefined && (
        <CSButton
          text="Remove Schedule"
          variant="danger"
          icon="close"
          handleClick={() => remove(detail)}
          block
          small
        />
      )}
      {confirm !== undefined && (
        <CSButton
          text="Confirm Request"
          variant="primary"
          icon="verified"
          handleClick={() => confirm(detail)}
          block
          small
        />
      )}
      {deny !== undefined && (
        <CSButton
          text="Deny Request"
          variant="danger"
          icon="block"
          handleClick={() => deny(detail)}
          block
          small
        />
      )}
    </div>
  );
};

export default MeetingRoomCard;
