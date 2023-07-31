import { Player } from "@lottiefiles/react-lottie-player";
import animation from "../../../assets/frontpageani.json";

const LoaderOne = () => {
  return (
    <div className="animation__wrapper">
      <div className="anime">
        <Player autoplay loop src={animation}></Player>
      </div>
    </div>
  );
};

export default LoaderOne;
