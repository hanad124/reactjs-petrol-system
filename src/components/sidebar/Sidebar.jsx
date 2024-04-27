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

import { paths } from "../../dataSource";

const Sidebar = () => {
  const [showReports, setShowReports] = useState(false);
  const [access, setAccess] = useState(false);
  const [activePath, setActivePath] = useState(window.location.pathname);

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

  // const handleClick = (event, path) => {
  //   event.preventDefault();
  //   navigate(path);
  // };

  useEffect(() => {
    const handlePathChange = () => {
      setActivePath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePathChange);

    return () => {
      window.removeEventListener("popstate", handlePathChange);
    };
  }, []);

  const handleItemClick = (path) => {
    setActivePath(path);
    navigate(path);
  };

  return (
    <div className="hidden md:block sticky top-0  border-r min-w-[15rem] min-h-screen dark:bg-background dark:border-r-none ">
      <Link to="/">
        <div className="text-xl font-bold text-primary tracking-wide py-5 text-center cursor-pointer">
          Sinay Petroleum
        </div>
      </Link>
      <div className="seprator"></div>

      <div className="flex flex-col gap-y-2 mt-2">
        {paths.map((path, index) => (
          <div
            key={index}
            className={`cursor-pointer flex items-center font-light mx-3 gap-3 py-2 px-2 ${
              (path.path === "/dashboard" && activePath === "/dashboard") ||
              activePath === path.path
                ? "text-white bg-blue-600 dark:bg-primary rounded-md font-light"
                : "text-slate-600  font-light hover:bg-primary/10 rounded-md   "
            }`}
            onClick={() => handleItemClick(path.path)}
          >
            {path.icon}
            {path.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
