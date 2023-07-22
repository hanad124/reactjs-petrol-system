import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PersonPinOutlinedIcon from "@mui/icons-material/PersonPinOutlined";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [showReports, setShowReports] = useState(false);
  const [access, setAccess] = useState(false);
  // active sidebar hooks

  const roll = JSON.parse(localStorage.getItem("roll"));

  useEffect(() => {
    if (roll == "user") {
      setAccess(false);
    } else {
      setAccess(true);
    }
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (event, path) => {
    event.preventDefault();
    navigate(path);
  }

  return (
    <div className="sidebar">
      <Link to="/">
        <div className="title text-red-500">sinay petroleum</div>
      </Link>
      <div className="seprator"></div>
      <ul className="list">
        <Link to="/">
          <li className={`${location.pathname === "/" ? "active" : ""}`} onClick={(event) => handleClick(event, "/")}>
            <DashboardIcon className="icon" />
            <span>Dashaord</span>
          </li>
        </Link>
        <Link to="/employees" className={`${access ? "" : "hideItem"}`}>
          <li className={`${location.pathname === "/employees" ? "active" : ""}`} onClick={(event) => handleClick(event, "/employees")}>
            <PersonOutlineOutlinedIcon className="icon" />
            <span>Employee</span>
          </li>
        </Link>
        <Link to="/supplier">
          <li className={`${location.pathname === "/supplier" ? "active" : ""}`} onClick={(event) => handleClick(event, "/supplier")}>
            <PersonPinOutlinedIcon className="icon" />
            <span>Supplier</span>
          </li>
        </Link>{" "}
        <Link to="/fuel">
          <li className={`${location.pathname === "/fuel" ? "active" : ""}`} onClick={(event) => handleClick(event, "/fuel")}>
            <LocalGasStationOutlinedIcon className="icon" />
            <span>Fuel</span>
          </li>{" "}
        </Link>{" "}
        <Link to="/purchase">
          <li className={`${location.pathname === "/purchase" ? "active" : ""}`} onClick={(event) => handleClick(event, "/purchase")}>
            <ShoppingBasketOutlinedIcon className="icon" />
            <span>Purchase</span>
          </li>{" "}
        </Link>{" "}
        <Link to="/customer">
          <li className={`${location.pathname === "/customer" ? "active" : ""}`} onClick={(event) => handleClick(event, "/customer")}>
            <SupportAgentOutlinedIcon className="icon" />
            <span>Customer</span>
          </li>
        </Link>
        <Link to="/sales">
          <li className={`${location.pathname === "/sales" ? "active" : ""}`} onClick={(event) => handleClick(event, "/sales")}>
            <MonetizationOnOutlinedIcon className="icon" />
            <span>Sales</span>
          </li>
        </Link>{" "}
        <Link to="/users" className={`${access ? "" : "hideItem"}`}>
          <li className={`${location.pathname === "/users" ? "active" : ""}`} onClick={(event) => handleClick(event, "/users")}>
            <AccountCircleOutlinedIcon className="icon" />
            <span>Users</span>
          </li>
        </Link>
        <li
          className="reports"
          onClick={() => {
            !showReports ? setShowReports(true) : setShowReports(false);
          }}
        >
          <SummarizeOutlinedIcon className="icon" />
          <div className="main-rep ">
            <span>Reports</span>
          </div>
          <KeyboardArrowDownOutlinedIcon
            className={`"icon arrow " ${showReports ? "rotate" : ""}`}
          />
        </li>
        <Link to="/purchaseReport">
          <li className={`sub_rep ${showReports ? "show-sub_rep" : ""}`}>
            <SummarizeOutlinedIcon className="icon" />
            <span>Purchase report</span>
          </li>
        </Link>
        <li className={`sub_rep ${showReports ? "show-sub_rep" : ""}`}>
          <SummarizeOutlinedIcon className="icon" />
          <span>Sales report</span>
        </li>
        <Link to="/login">
          <li
            onClick={() => {
              localStorage.removeItem("user");
            }}
          >
            <LogoutOutlinedIcon className="icon" />
            <span>Log Out</span>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;