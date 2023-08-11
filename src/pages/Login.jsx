import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../http";
import CSInput from "../layouts/components/forms/CSInput";
import CSButton from "../layouts/components/forms/CSButton";
import { useAppContext } from "../context/AuthProvider";
import DataFile from "../services/file";

const Login = () => {
  const { setAuth } = useAppContext();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await axios.post(
        "login",
        JSON.stringify({ email, password: pwd }),
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const token = response?.data?.data?.token;
      const user = response?.data?.data?.user;

      setAuth({ user, token });

      sessionStorage.setItem("auth", DataFile.encrypt(response.data.data));

      setEmail("");
      setPwd("");
      setIsLoading(false);
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);

      if (!error?.response) {
        setErrorMsg("No Server Response");
      } else if (error?.response?.status === 400) {
        setErrorMsg("Missing Username or Password");
      } else if (error.response?.status === 401) {
        setErrorMsg("Unauthorized");
      } else {
        setErrorMsg("Login Failed");
      }
    }
  };

  return (
    <>
      <div className="col-md-12">
        <div className="login__form__styling">
          <div className="login__form__card">
            <div className="login__card__header">
              <h3>STAFF LOGIN</h3>
            </div>
            <div className="form__card__body">
              <form onSubmit={handleSubmit}>
                <div className="col-md-12 mb-4">
                  <CSInput
                    id="username"
                    label="Username"
                    placeholder="Enter Username"
                    size="lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col-md-12 mb-5">
                  <CSInput
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="Enter Password"
                    size="lg"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                  />
                </div>
                <div className="col-md-12">
                  <CSButton
                    text="Login"
                    type="submit"
                    variant="primary"
                    icon="login"
                    size="lg"
                    isLoading={isLoading}
                    block
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
