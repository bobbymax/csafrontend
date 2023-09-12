import { useState } from "react";
import PageHeader from "../../../layouts/includes/PageHeader";

const Reservations = () => {
  const [collection, setCollection] = useState([]);

  const handleAction = () => {
    //
  };

  return (
    <>
      <div className="row">
        <PageHeader
          text="Reservations"
          btnText="Make Reservation"
          handleClick={handleAction}
        />

        <div className="col-md-12 mt-4 mb-3">
          <div className="cs__btn__tabs">
            <button type="button" className="cs__tabs__btn">
              <span className="material-icons-sharp">airlines</span>
              <p>Flights</p>
            </button>
            <button type="button" className="cs__tabs__btn">
              <span className="material-icons-sharp">bed</span>
              <p>Hotel</p>
            </button>
            <button type="button" className="cs__tabs__btn">
              <span className="material-icons-sharp">meeting_room</span>
              <p>Meeting Room</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reservations;
