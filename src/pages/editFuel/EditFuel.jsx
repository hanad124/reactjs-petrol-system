// import "./EditFuel.scss";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import FuelContext from "../../context/FuelContext";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import noImage from "../../assets/no-pictures.png";
import Skeleton from "react-loading-skeleton";

const EditFuel = () => {
  const { fuelId, SetFuelId } = useContext(FuelContext);
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

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "fuel", fuelId);
      const docSnap = await getDoc(docRef);
      const fltype = docSnap.data().fuelType;
      const tknumber = docSnap.data().tankNumber;
      const cpcity = docSnap.data().capacity;
      const perlitter = docSnap.data().pricePerLitter;

      setFuelType(fltype);
      setTankNumber(tknumber);
      setCapacity(cpcity);
      setPricePerLitter(perlitter);
    };

    fetchData();
  }, [FuelContext]);

  const validateInputs = () => {
    let errors = {};
    let formIsValid = true;

    // Tank Number
    if (!tankNumber || tankNumber.trim() === "") {
      formIsValid = false;
      errors["tankNumber"] = "Tank Number is required";
    }

    // Capacity
    if (!capacity) {
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

  console.log("capacity: ", capacity);

  const handleUpdate = async () => {
    if (validateInputs()) {
      try {
        await setDoc(doc(db, "fuel", fuelId), {
          tankNumber,
          capacity,
          fuelType,
          pricePerLitter,
          time: `${dayDate}/${months[monthDate]}/${yearDate}`,
        });
        alert("Fuel has been updated successfully!");
        navigate("/fuel");
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full ml-[233px]">
        <Navbar />
        <div className="flex flex-col flex-1 mx-4 my-8 overflow-y-auto bg-white rounded-lg shadow-lg">
          <div className="text-2xl font-medium text-gray-400 px-6">
            Update Fuel
          </div>
          <div className=" px-6 py-4 mt-[6rem]">
            <form action="" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tank-number" className="text-gray-800">
                  Tank number
                </label>
                <input
                  type="text"
                  id="tank-number"
                  className={`block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none${
                    errors["tankNumber"] ? "border-red-500" : ""
                  }`}
                  value={tankNumber}
                  onChange={(e) => setTankNumber(e.target.value)}
                />
                {errors["tankNumber"] && (
                  <p className="text-red-500 text-sm">{errors["tankNumber"]}</p>
                )}
              </div>
              <div>
                <label htmlFor="capacity" className="text-gray-800">
                  Capacity
                </label>
                <input
                  type="number"
                  id="capacity"
                  className={`block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none ${
                    errors["capacity"] ? "border-red-500" : ""
                  }`}
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
                {errors["capacity"] && (
                  <p className="text-red-500 text-sm">{errors["capacity"]}</p>
                )}
              </div>
              <div>
                <label htmlFor="fuelType" className="text-gray-800">
                  Fuel Type
                </label>
                <input
                  type="text"
                  id="fuelType"
                  className={`block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none ${
                    errors["fuelType"] ? "border-red-500" : ""
                  }`}
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                />
                {errors["fuelType"] && (
                  <p className="text-red-500 text-sm">{errors["fuelType"]}</p>
                )}
              </div>
              <div>
                <label htmlFor="pricePerLitter" className="text-gray-800">
                  Price per Liter
                </label>
                <input
                  type="text"
                  id="pricePerLitter"
                  className={`block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none ${
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
              <div className="col-span-2">
                <button
                  type="button"
                  className="inline-flex items-center px-14 py-3 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:shadow-outline-indigo disabled:opacity-25 transition ease-in-out duration-150"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditFuel;
