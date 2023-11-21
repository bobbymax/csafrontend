import { useEffect, useState } from "react";
import CircularProgress from "@mui/joy/CircularProgress";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import events from "../services/events";
import moment from "moment";
import CSButton from "../layouts/components/forms/CSButton";
import { useAppContext } from "../context/AuthProvider";

// const localizer = momentLocalizer(moment);

const Home = () => {
  const { auth } = useAppContext();

  const [staff, setStaff] = useState(null);
  const [stats, setStats] = useState({});

  // console.log(stats);

  const handleArrs = (arr, status) => {
    const pending = arr?.filter((ar) => ar.status === status)?.length;
    const full = arr?.length;
    const div = pending / full;

    const value = isNaN(div) ? 0 : div;
    // console.log(1 * 100);

    return {
      percentage: Math.round(value * 100),
      display: `${pending} / ${full}`,
    };
  };

  useEffect(() => {
    if (staff !== null) {
      const { statistics } = staff;
      setStats(statistics);
    }
  }, [staff]);

  useEffect(() => {
    if (auth) {
      const { user } = auth;
      setStaff(user);
    }
  }, [auth]);

  return (
    <div className="dashboard__container">
      <div className="row mb-4">
        <div className="col-md-12 mb-4">
          <div className="dashboard__statistics">
            <div className="row">
              <div className="col-md-3">
                <div className="circular__card">
                  <CircularProgress
                    size="lg"
                    sx={{ "--CircularProgress-size": "140px" }}
                    determinate
                    color="danger"
                    value={
                      handleArrs(stats?.requisitions, "approved").percentage
                    }
                  >
                    <div className="card__text__details text-danger">
                      <small>Requisitions</small>
                      <p className="text-danger">
                        {handleArrs(stats?.requisitions, "approved").display}
                      </p>
                    </div>
                  </CircularProgress>
                </div>
              </div>
              <div className="col-md-3">
                <div className="circular__card">
                  <CircularProgress
                    size="lg"
                    sx={{ "--CircularProgress-size": "140px" }}
                    determinate
                    value={handleArrs(stats?.flights, "confirmed").percentage}
                    color="primary"
                  >
                    <div className="card__text__details text-primary">
                      <small>Flights</small>
                      <p className="text-primary">
                        {handleArrs(stats?.flights, "confirmed").display}
                      </p>
                    </div>
                  </CircularProgress>
                </div>
              </div>
              <div className="col-md-3">
                <div className="circular__card">
                  <CircularProgress
                    size="lg"
                    sx={{ "--CircularProgress-size": "140px" }}
                    determinate
                    value={handleArrs(stats?.flights, "confirmed").percentage}
                    color="warning"
                  >
                    <div className="card__text__details text-warning">
                      <small>Hotels</small>
                      <p className="text-warning">
                        {handleArrs(stats?.hotels, "confirmed").display}
                      </p>
                    </div>
                  </CircularProgress>
                </div>
              </div>
              <div className="col-md-3">
                <div className="circular__card">
                  <CircularProgress
                    size="lg"
                    sx={{ "--CircularProgress-size": "140px" }}
                    determinate
                    value={handleArrs(stats?.furniture, "approved").percentage}
                    color="success"
                  >
                    <div className="card__text__details text-success">
                      <small>Furnitures</small>
                      <p className="text-success">
                        {handleArrs(stats?.furniture, "approved").display}
                      </p>
                    </div>
                  </CircularProgress>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="dashboard__statistics">
            <div className="row">
              <div className="col-md-3">
                <div className="circular__card">
                  <CircularProgress
                    size="lg"
                    sx={{ "--CircularProgress-size": "140px" }}
                    determinate
                    value={handleArrs(stats?.logistics, "confirmed").percentage}
                    color="warning"
                  >
                    <div className="card__text__details text-warning">
                      <small>Logistics</small>
                      <p className="text-warning">
                        {handleArrs(stats?.logistics, "confirmed").display}
                      </p>
                    </div>
                  </CircularProgress>
                </div>
              </div>
              <div className="col-md-3">
                <div className="circular__card">
                  <CircularProgress
                    size="lg"
                    sx={{ "--CircularProgress-size": "140px" }}
                    determinate
                    value={handleArrs(stats?.tickets, "resolved").percentage}
                    color="danger"
                  >
                    <div className="card__text__details text-danger">
                      <small>Tickets</small>
                      <p className="text-danger">
                        {handleArrs(stats?.tickets, "resolved").display}
                      </p>
                    </div>
                  </CircularProgress>
                </div>
              </div>
              <div className="col-md-3">
                <div className="circular__card">
                  <CircularProgress
                    size="lg"
                    sx={{ "--CircularProgress-size": "140px" }}
                    determinate
                    value={handleArrs(stats?.tasks, "completed").percentage}
                    color="success"
                  >
                    <div className="card__text__details text-success">
                      <small>Tasks</small>
                      <p className="text-success">
                        {handleArrs(stats?.tasks, "completed").display}
                      </p>
                    </div>
                  </CircularProgress>
                </div>
              </div>
              <div className="col-md-3">
                <div className="circular__card">
                  <CircularProgress
                    size="lg"
                    sx={{ "--CircularProgress-size": "140px" }}
                    determinate
                    value={handleArrs(stats?.meetings, "approved").percentage}
                    color="primary"
                  >
                    <div className="card__text__details text-primary">
                      <small>Meetings</small>
                      <p className="text-primary">
                        {handleArrs(stats?.meetings, "approved").display}
                      </p>
                    </div>
                  </CircularProgress>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="row">
        <div className="col-md-7"></div>
        <div className="col-md-5">
          <div className="flight__details">
            <div className="flight__content">
              <div className="top__sectio__r">
                <h5>Flight Details</h5>
              </div>
              <div className="mid__section__r">
                <div className="row">
                  <div className="col-md-8">
                    <div className="route">
                      <div className="takeoff__state">
                        <h3 className="lead__txt">ABV</h3>
                      </div>
                      <div className="destination__state">
                        <span className="material-icons-sharp tabber">
                          arrow_forward
                        </span>
                        <h3 className="destination__txt">JNB</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="route__desc">
                      <span className="material-icons-sharp">
                        connecting_airports
                      </span>
                      <p>International</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flight__bttm">
              <p>Passenger</p>
              <h3>Super Administrator</h3>

              <div className="reser__dets mt-3 mb-4">
                <div className="row">
                  <div className="col-md-6">
                    <p>Departs</p>
                    <h3>20-04-23 11:00AM</h3>
                  </div>
                  <div className="col-md-6">
                    <p>Return</p>
                    <h3>28-04-23 08:00AM</h3>
                  </div>
                </div>
              </div>

              <CSButton text="View Reservation" block variant="dark" />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Home;
