import "./navbar.scss";
import avatar from "../../assets/avator.png";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const [clicked, setClicked] = useState(false);
  const [clockTime, setClockTime] = useState("");
  const navigate = useNavigate();

  //CLOCK DATE
  const startTime = () => {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    let ampm = h >= 12 ? "PM" : "AM"; // determine if it's AM or PM
    m = checkTime(m);
    s = checkTime(s);
    setClockTime(h + ":" + m + ":" + s + "  " + ampm);
  };
  setTimeout(startTime, 1000);

  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    } // add zero in front of numbers < 10
    return i;
  }

  //  const startTime = () => {
  //   const today = new Date();
  //   let h = today.getHours();
  //   let m = today.getMinutes();
  //   let s = today.getSeconds();
  //   let ampm = h >= 12 ? "PM" : "AM"; // determine if it's AM or PM
  //   h = h % 12; // convert to 12-hour format
  //   h = h ? h : 12; // "0" should be "12"
  //   m = checkTime(m);
  //   s = checkTime(s);
  //   setClockTime(h + ":" + m + ":" + s + " " + ampm);
  // };

  const showaccount = () => {
    if (clicked) {
      setClicked(false);
    } else {
      setClicked(true);
    }
  };

  const roll = JSON.parse(localStorage.getItem("roll"));
  const name = JSON.parse(localStorage.getItem("username"));
  const image = JSON.parse(localStorage.getItem("image"));
  const accountID = JSON.parse(localStorage.getItem("accountID"));

  const AccountClick = () => {
    localStorage.removeItem("userID");
    localStorage.setItem("userID", JSON.stringify(accountID));
    navigate("/users/single-user");
  };

  const handleLogout = () => {
    // navigate("login");
    localStorage.removeItem("user");
  };

  return (
    <div className="flex items-center justify-end gap-x-5 w-full">
      <div className="flex items-center dark:text-slate-400 ">
        <div className="flex items-center dark:text-slate-400 rounded-md ">
          <div className="items">
            <div className="item">
              <div className="account">
                <div className="roll">{roll}</div>
                <div className="name">{name}</div>
              </div>
              <img
                src={image}
                alt=""
                className={`avatar ${clicked ? "active" : ""}`}
                onClick={showaccount}
              />
              <div className={`account_popup ${clicked ? "show" : ""}`}>
                <Link to="/users/single-user">
                  <div
                    className="userAccount"
                    style={{ color: "#555555" }}
                    onClick={AccountClick}
                  >
                    <AccountCircleOutlinedIcon className=" icon sitting-icon" />
                    <p>Account</p>
                  </div>
                </Link>
                <Link to="/login">
                  <div className="logout" onClick={handleLogout}>
                    <LogoutOutlinedIcon className="icon logout-icon" />
                    <p>Logout</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
