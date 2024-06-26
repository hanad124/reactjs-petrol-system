import "./home.scss";
import "../../index.css";
import { json, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Widget from "../../components/widgets/Widgets";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import { SalesData } from "../sales/Sales";

function Home() {
  return (
    <div className="home">
      <div className="widgets">
        <Widget type="employees" />
        <Widget type="customers" />
        <Widget type="purchase" />
        <Widget type="sales" />
      </div>
      <div className="charts">
        <Featured />
        <Chart />
      </div>
      <div className="listContainer">
        <div className="listTitle">The recent transactions for customers</div>
        <SalesData buttons={false} />
      </div>
    </div>
  );
}

export default Home;
