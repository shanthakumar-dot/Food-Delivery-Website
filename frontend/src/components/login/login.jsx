import  { useContext, useState } from "react";
import "./login.css";
import { assets } from "../../assets/assets/assets";
import { StoreContext } from "../../context/storecontext";
import axios from "axios";

const LoginPopup = ({ setLogin }) => {
  const { url, settoken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("login");
  const [data, setdata] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onchange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setdata((data) => ({ ...data, [name]: value }));
  };

  const onlogin = async (event) => {
    event.preventDefault();

    let newurl = url;

    if (currState === "login") {
      newurl += "/api/user/login";
    } else {
      newurl += "/api/user/register";
    }

    try {
      const response = await axios.post(newurl, data);
      if (response.data.success) {
        settoken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Authentication error Failure:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onlogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState === "login" ? "Login" : "Sign Up"}</h2>
          <img
            onClick={() => setLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "login" ? null : (
            <input
              name="name"
              onChange={onchange}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onchange}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            type="password"
            name="password"
            onChange={onchange}
            value={data.password}
            placeholder="Password"
            required
          />
        </div>

        <button type="submit">
          {currState === "signup" ? "Create account" : "Login"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        {currState === "login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("signup")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
