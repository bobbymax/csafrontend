import CircularProgress from "@mui/joy/CircularProgress";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import events from "../services/events";
import moment from "moment";
import CSButton from "../layouts/components/forms/CSButton";

// const localizer = momentLocalizer(moment);

const Home = () => {
  // console.log(auth);

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
                    value={88}
                  >
                    <div className="card__text__details text-danger">
                      <small>Requisitions</small>
                      <p className="text-danger">2 / 3</p>
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
                    value={38}
                    color="primary"
                  >
                    <div className="card__text__details text-primary">
                      <small>Flights</small>
                      <p className="text-primary">2 / 3</p>
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
                    value={66.67}
                    color="warning"
                  >
                    <div className="card__text__details text-warning">
                      <small>Hotels</small>
                      <p className="text-warning">2 / 3</p>
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
                    value={55}
                    color="success"
                  >
                    <div className="card__text__details text-success">
                      <small>Furnitures</small>
                      <p className="text-success">2 / 3</p>
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
                    value={25}
                    color="warning"
                  >
                    <div className="card__text__details text-warning">
                      <small>Logistics</small>
                      <p className="text-warning">2 / 3</p>
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
                    value={45.87}
                    color="danger"
                  >
                    <div className="card__text__details text-danger">
                      <small>Tickets</small>
                      <p className="text-danger">2 / 3</p>
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
                    value={66.67}
                    color="success"
                  >
                    <div className="card__text__details text-success">
                      <small>Tasks</small>
                      <p className="text-success">2 / 3</p>
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
                    value={66.67}
                    color="primary"
                  >
                    <div className="card__text__details text-primary">
                      <small>Meetings</small>
                      <p className="text-primary">2 / 3</p>
                    </div>
                  </CircularProgress>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
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
      </div>
    </div>
  );
};

export default Home;
