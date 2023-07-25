import "./login.scss";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/login-logo.png";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const querySnapshot = await getDocs(collection(db, "users"));
    const matchingUser = querySnapshot.docs.find(
      (doc) => doc.data().email === email && doc.data().password === password
    );
    if (matchingUser) {
      localStorage.setItem("roll", JSON.stringify(matchingUser.data().roll));
      localStorage.setItem(
        "username",
        JSON.stringify(matchingUser.data().username)
      );
      localStorage.setItem("image", JSON.stringify(matchingUser.data().image));
      localStorage.setItem("accountID", JSON.stringify(matchingUser.id));
      dispatch({ type: "LOGIN", payload: matchingUser.data() });
      navigate("/");
    } else {
      setPasswordError("Invalid email or password");
    }
  };

  const HidePassword = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    // This regex pattern checks if the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // This regex pattern checks if the password is at least 8 characters long and contains at least one digit and one uppercase letter
    const passwordRegex = /^(?=.*\d)(?=.*[A-Z])[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleEmailBlur = () => {
    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordBlur = () => {
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and contain at least one digit and one uppercase letter"
      );
    } else {
      setPasswordError("");
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-cols">
          <div className="login-cols-1">
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
            <p className="col1-title">sinay petroleum</p>
            <p className="col1-desc">
              <span>Sinay management system</span> Will mange your petrol &amp;
              accounts easily.
            </p>
          </div>
          <div className="login-cols-2">
            <h1>Login to your account</h1>
            <form className="form" onSubmit={handleLogin}>
              <p className="name">Email</p>
              <input
                type="email"
                id="txtEmail"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
              />
              {emailError && <p className="error">{emailError}</p>}
              <p className="password">Password</p>
              <div className="passWrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="txtPass"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordBlur}
                />
                {showPassword ? (
                  <RemoveRedEyeOutlinedIcon
                    className="eye text-slate-500"
                    style={{ cursor: "pointer", color: "gray" }}
                    onClick={HidePassword}
                  />
                ) : (
                  <VisibilityOffOutlinedIcon
                    className="eye text-slate-500"
                    style={{ cursor: "pointer", color: "gray" }}
                    onClick={HidePassword}
                  />
                )}
              </div>
              {passwordError && <p className="error">{passwordError}</p>}
              <br />
              <Link to="/forgotPassword">
                <p className="forget_link text-[#0B63E5]">forgot password?</p>
              </Link>
              <div className="btn_login-wrapper">
                <button
                  className="submit-login"
                  type="submit"
                  disabled={emailError || passwordError}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
