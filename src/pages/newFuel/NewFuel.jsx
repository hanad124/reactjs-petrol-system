import "./newFuel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { async } from "@firebase/util";

const NewFuel = () => {
  const navigate = useNavigate();
  const [tankNumber, setTankNumber] = useState();
  const [capacity, setCapacity] = useState();
  const [fuelType, setFuelType] = useState();
  const [pricePerLitter, setPricePerLitter] = useState();

  //CHECK TANK CAPACITY
  // useEffect(() => {
  //   if (tankNumber == "1") {
  //     setCapacity("300 litters");
  //   } else if (tankNumber == "2") {
  //     setCapacity("1,200 litters");
  //   } else if (tankNumber == "3") {
  //     setCapacity("500 litters");
  //   } else if (tankNumber == "4") {
  //     setCapacity("830 litters");
  //   } else if (tankNumber == "5") {
  //     setCapacity("2,100 litters");
  //   }
  // }, [tankNumber]);

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

  const handleAdd = async () => {
    await addDoc(collection(db, "fuel"), {
      tankNumber: tankNumber,
      capacity: capacity,
      fuelType: fuelType,
      pricePerLitter: pricePerLitter,
      time: dayDate + "/" + months[monthDate] + "/" + yearDate,
    });

    alert("data has added sucessfully!");
    navigate(-1);
  };

  return (
    <div className="newFuel">
      <Sidebar />
      <div className="newFuelContainer">
        <Navbar />
        <div className="wrapper">
          <div className="title">Add New Fuel</div>
          <div className="wrapper-cols">
            <div className="wrapper-cols-1"></div>
            <div className="wrapper-cols-2">
              <p className="fullName">Tank Number</p>
              <input
                type="number"
                value={tankNumber}
                onChange={(e) => setTankNumber(e.target.value)}
              />
              <p className="phone">Capacity</p>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
            <div className="wrapper-cols-3">
              <p className="address">Fuel Type</p>
              <input
                type="text"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
              />
              <p className="address">Price per litter</p>
              <input
                type="number"
                value={pricePerLitter}
                onChange={(e) => setPricePerLitter(e.target.value)}
              />
            </div>
          </div>
          <button className="btn-save" onClick={handleAdd}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewFuel;
