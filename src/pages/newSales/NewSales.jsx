// import "./newSales.scss";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  onSnapshot,
  where,
  query,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { async } from "@firebase/util";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const NewSales = () => {
  const navigate = useNavigate();
  const [fuelData, setFuelData] = useState([]);
  const [data, setData] = useState([]);
  const [custName, setCustName] = useState("");
  const [custID, setCustID] = useState("");
  const [fuelID, setFuelID] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [fuelTank, setFuelTank] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [currentFuel, setCurrentFuel] = useState("");
  const [litter, setLitter] = useState("");
  const [pricePerLitter, setPricePerLitter] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [salesDate, setSaleseDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [errors, setErrors] = useState({});

  const [tankNumber, setTankNumber] = useState("");
  const [capacity, setCapacity] = useState("");

  const suppData = [];
  const fulTempData = [];

  // CALCULATE FUEL TOTAL
  useEffect(() => {
    setTotalPrice(litter * pricePerLitter);
  }, [litter, pricePerLitter]);

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

  // FETCH CUSTOMER NAME
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "customers"),
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

  // FETCH FUEL TYPE
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "fuel"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setFuelData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  // FETCH FUEL DETAILS
  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "fuel"),
        where("fuelType", "==", fuelType)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        const docSnap = querySnapshot.docs[0];

        setCurrentFuel(docSnap.data());
      } else {
        console.log(`No customer found with ID ${custID}`);
      }
    };

    // const fetchData = async () => {
    //   const docRef = doc(db, "fuel", fuelID);
    //   const docSnap = await getDoc(docRef);

    //   setCurrentFuel(docSnap.data());

    // };
    fetchData();
  }, [fuelType]);

  // FETCH CUSTOMER DETAILS
  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "customers"),
        where("fullName", "==", custName)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        const docSnap = querySnapshot.docs[0];
        const custPhone = docSnap.data().phone;
        const custEmail = docSnap.data().email;

        setCustPhone(custPhone);
        setCustEmail(custEmail);
      } else {
        console.log(`No customer found with ID ${custID}`);
      }
    };

    fetchData();
  }, [custID]);

  const validateInputs = () => {
    let errors = {};
    let formIsValid = true;

    // Tank Number
    if (!tankNumber || tankNumber.trim() === "") {
      formIsValid = false;
      errors["tankNumber"] = "Tank Number is required";
    }

    // customer phone
    if (!custPhone || custPhone.trim() === "") {
      formIsValid = false;
      errors["custPhone"] = "Customer phone is required";
    }

    // customer email
    if (!custEmail || custEmail.trim() === "") {
      formIsValid = false;
      errors["custEmail"] = "Customer email is required";
    }

    // customer email
    if (!custName || custName.trim() === "") {
      formIsValid = false;
      errors["custName"] = "Customer Name is required";
    }

    // litters
    if (!litter || litter.trim() === "") {
      formIsValid = false;
      errors["litter"] = "litter is required";
    }

    // Fuel Type
    if (!fuelType || fuelType.trim() === "") {
      formIsValid = false;
      errors["fuelType"] = "Fuel Type is required";
    }
    // Fuel Tank
    if (!fuelTank || fuelTank.trim() === "") {
      formIsValid = false;
      errors["fuelTank"] = "Fuel Tank is required";
    }

    // total price
    if (!totalPrice) {
      formIsValid = false;
      errors["totalPrice"] = "total price is required";
    } else if (isNaN(totalPrice)) {
      formIsValid = false;
      errors["totalPrice"] = "total price must be a number";
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
    // if (validateInputs()) {
    await addDoc(collection(db, "sales"), {
      customerName: custName,
      customerPhone: custPhone,
      customerEmail: custEmail,
      fuelTank: tankNumber,
      fuelType: fuelType,
      litter: litter,
      pricePerLitter: pricePerLitter,
      totalPrice: totalPrice,
      salesDate: salesDate,
      status: status,
      time: dayDate + "/" + months[monthDate] + "/" + yearDate,
    });

    const currentCapacity = currentFuel.capacity;
    const newCapacity = parseInt(currentCapacity) - parseInt(litter);

    const q = query(
      collection(db, "fuel"),
      where("tankNumber", "==", currentFuel.tankNumber)
    );

    const fieldToUpdate = "capacity";
    const newValue = newCapacity;

    getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, { [fieldToUpdate]: newValue });
        });
      })
      .catch((error) => {
        console.log("Error updating document:", error);
      });

    alert("data has added successfully!");
    navigate(-1);
    // }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-[233px]">
        <Navbar />
        <div className="container mx-auto mt-10  lg:px-7">
          <div className="text-2xl font-medium text-gray-900 mb-6">
            Add New sales
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 mr-[10rem] mb-8">
            <div className="flex flex-col">
              <label className="block mb-2 text-sm">Customer Name</label>
              <select
                // defaultValue={defaultValue}
                name="cust-name"
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none"
                value={custID}
                onChange={(e) => {
                  suppData.filter((el) => {
                    if (el.id == e.target.value) {
                      setCustID(el.id);
                      setCustName(el.cusname);
                    }
                  });
                }}
              >
                {data.map((el) => {
                  suppData.push({ id: el.id, cusname: el.fullName });
                  return <option value={el.id}>{el.fullName}</option>;
                })}
              </select>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="capacity"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Fuel type
              </label>
              <select
                name="fuel-tank"
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none"
                value={fuelID}
                onChange={(e) => {
                  fuelData.filter((el) => {
                    if (el.id == e.target.value) {
                      setFuelID(el.id);
                      setFuelType(el.fuelType);
                      setPricePerLitter(el.pricePerLitter);
                      setTankNumber(el.tankNumber);
                    }
                  });
                }}
              >
                {fuelData.map((el) => {
                  fulTempData.push({ id: el.id, fuelType: el.fuelType });
                  return <option value={el.id}>{el.fuelType}</option>;
                })}
              </select>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="fuelType"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Litters
              </label>
              <input
                type="number"
                id="fuelType"
                className={`block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none ${
                  errors["litter"] ? "border-red-500" : ""
                }`}
                value={litter}
                onChange={(e) => setLitter(e.target.value)}
              />
              {errors["litter"] && (
                <p className="text-red-500 text-sm">{errors["litter"]}</p>
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
            <div className="flex flex-col">
              <label
                htmlFor="totalPrice"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Total Price
              </label>
              <input
                type="number"
                id="totalPrice"
                className={`block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none ${
                  errors["totalPrice"] ? "border-red-500" : ""
                }`}
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
              />
              {errors["totalPrice"] && (
                <p className="text-red-500 text-sm">{errors["totalPrice"]}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="salesDate"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Transection Date
              </label>
              <input
                required
                type="date"
                id="salesDate"
                className={`block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none`}
                onChange={(e) => setSaleseDate(e.target.value)}
              />
              {errors["totalPrice"] && (
                <p className="text-red-500 text-sm">{errors["totalPrice"]}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="customerPhone"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Customer Phone
              </label>
              <input
                type="text"
                id="customerPhone"
                className={`block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none ${
                  errors["custPhone"] ? "border-red-500" : ""
                }`}
                value={custPhone}
                onChange={(e) => setCustPhone(e.target.value)}
              />
              {errors["custPhone"] && (
                <p className="text-red-500 text-sm">{errors["custPhone"]}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="customerEmail"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Customer Email
              </label>
              <input
                type="text"
                id="customerEmail"
                className={`block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none ${
                  errors["custEmail"] ? "border-red-500" : ""
                }`}
                value={custEmail}
                onChange={(e) => setCustEmail(e.target.value)}
              />
              {errors["custEmail"] && (
                <p className="text-red-500 text-sm">{errors["custEmail"]}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="tankNumber"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Tank number
              </label>
              <input
                type="text"
                id="tankNumber"
                className={`block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none ${
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
                htmlFor="status"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Status
              </label>
              <select
                name="fuel-tank"
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              >
                <option value="Approved">Approved</option>;
                <option value="Pending"> Pending</option>;
              </select>
            </div>
          </div>
          <button
            className="bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 w-2/6"
            onClick={handleAdd}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewSales;
