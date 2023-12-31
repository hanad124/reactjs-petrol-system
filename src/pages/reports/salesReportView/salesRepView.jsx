import "./purRepView.scss";
import React from "react";
import logo from "../../../assets/logo.png";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import { SalesData } from "../../sales/Sales";

const userColumns = [
  // { field: "id", headerName: "ID", width: 70 },
  {
    field: "suppName",
    headerName: "Supplier Name",
    width: 150,
  },

  {
    field: "suppPhone",
    headerName: "Phone",
    width: 100,
  },
  {
    field: "fuelType",
    headerName: "Fuel",
    width: 70,
  },
  {
    field: "fuelTank",
    headerName: "Tank No.",
    width: 60,
  },
  {
    field: "litter",
    headerName: "Litters",
    width: 50,
  },
  {
    field: "pricePerLitter",
    headerName: "Price/Litter",
    width: 40,
  },
  {
    field: "totalPrice",
    headerName: "Total",
    width: 70,
  },
  {
    field: "perchaseDate",
    headerName: "Date",
    width: 110,
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];

const PurRepView = React.forwardRef((props, ref) => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "sales"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  const date = new Date();

  const dayDate = date.getDate();
  const monthDate = date.getMonth() + 1;
  const yearDate = date.getFullYear();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="purchaseReport" ref={ref}>
      <div className="purRepViewContainer">
        <div className="datatable">
          <div className="reportTitle">
            <div className="company">
              <img src={logo} alt="" />
              SINAY PETROLEUM
            </div>
            <p className="report_type">Sales Report</p>
            <p className="report_date">
              Report Date:{" "}
              <span>
                {dayDate + " - " + months[monthDate] + " - " + yearDate}
              </span>{" "}
            </p>
          </div>
          <SalesData buttons={false} />
        </div>
      </div>
    </div>
  );
});

export default PurRepView;
