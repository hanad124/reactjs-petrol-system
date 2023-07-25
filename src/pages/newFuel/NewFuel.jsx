import "./newFuel.scss";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const NewFuel = () => {
  const navigate = useNavigate();
  const [tankNumber, setTankNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [pricePerLitter, setPricePerLitter] = useState("");
  const [errors, setErrors] = useState({});

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

  const validateInputs = () => {
    let errors = {};
    let formIsValid = true;

    // Tank Number
    if (!tankNumber || tankNumber.trim() === "") {
      formIsValid = false;
      errors["tankNumber"] = "Tank Number is required";
    }

    // Capacity
    if (!capacity || capacity.trim() === "") {
      formIsValid = false;
      errors["capacity"] = "Capacity is required";
    }

    // Fuel Type
    if (!fuelType || fuelType.trim() === "") {
      formIsValid = false;
      errors["fuelType"] = "Fuel Type is required";
    }

    // Price per Litter
    if (!pricePerLitter || pricePerLitter.trim() === "") {
      formIsValid = false;
      errors["pricePerLitter"] = "Price per Litter is required";
    } else if (isNaN(pricePerLitter)) {
      formIsValid = false;
      errors["pricePerLitter"] = "Price per Litter must be a number";
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleAdd = async () => {
    if (validateInputs()) {
      await addDoc(collection(db, "fuel"), {
        tankNumber,
        capacity,
        fuelType,
        pricePerLitter,
        time: `${dayDate}/${months[monthDate]}/${yearDate}`,
      });

      alert("Data has been added successfully!");
      navigate(-1);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-[233px]">
        <Navbar />
        <div className="container mx-auto mt-10  lg:px-7">
          <div className="text-2xl font-medium text-gray-900 mb-6">
            Add New Fuel
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-y-4  mb-8">
            <div className="flex flex-col">
              <label
                htmlFor="tankNumber"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Tank Number
              </label>
              <input
                type="number"
                id="tankNumber"
                className={`fuel_input ${
                  errors["tankNumber"] ? "border-red-500" : ""
                }`}
                value={tankNumber}
                onChange={(e) => setTankNumber(e.target.value)}
              />
              {errors["tankNumber"] && (
                <p className="text-red-500 text-sm">{errors["tankNumber"]}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="capacity"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                className={`fuel_input ${
                  errors["capacity"] ? "border-red-500" : ""
                }`}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
              {errors["capacity"] && (
                <p className="text-red-500 text-sm">{errors["capacity"]}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="fuelType"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Fuel Type
              </label>
              <input
                type="text"
                id="fuelType"
                className={`fuel_input ${
                  errors["fuelType"] ? "border-red-500" : ""
                }`}
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
              />
              {errors["fuelType"] && (
                <p className="text-red-500 text-sm">{errors["fuelType"]}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="pricePerLitter"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Price per Liter
              </label>
              <input
                type="text"
                id="pricePerLitter"
                className={`fuel_input ${
                  errors["pricePerLitter"] ? "border-red-500" : ""
                }`}
                value={pricePerLitter}
                onChange={(e) => setPricePerLitter(e.target.value)}
              />
              {errors["pricePerLitter"] && (
                <p className="text-red-500 text-sm">
                  {errors["pricePerLitter"]}
                </p>
              )}
            </div>
          </div>
          <button
            className="bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 w-2/6"
            onClick={handleAdd}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewFuel;
