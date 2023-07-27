import "./editSales.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SalesContext from "../../context/SalesContext";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

const EditSales = () => {
  const { salesId, SetSalesId } = useContext(SalesContext);
  const navigate = useNavigate();
  const [fuelData, setFuelData] = useState([]);
  const [data, setData] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [fuelID, setFuelID] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [fuelTank, setFuelTank] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [litter, setLitter] = useState("");
  const [pricePerLitter, setPricePerLitter] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [salesDate, setsalesDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [defaultCusName, setDefaultCusName] = useState();
  const [defaultFuelType, setDefaultFuelType] = useState();
  const [defaultLitter, setDefaultLitter] = useState(55);
  const [error, setError] = useState("");

  const suppData = [];
  const fulTempData = [];
  console.log(status);

  const exectSalesID = JSON.parse(localStorage.getItem("salesID"));

  //get the defualt data
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "sales", exectSalesID);
      const docSnap = await getDoc(docRef);

      const cusNam = docSnap.data().customerName;
      const flType = docSnap.data().fuelType;
      const litt = docSnap.data().litter;
      const perlitt = docSnap.data().pricePerLitter;
      const totalprc = docSnap.data().totalPrice;
      const salDate = docSnap.data().salesDate;
      const cusPhone = docSnap.data().customerPhone;
      const cusEmail = docSnap.data().customerEmail;
      const tankNum = docSnap.data().fuelTank;
      const salStatus = docSnap.data().status;

      setDefaultCusName(cusNam);
      setDefaultFuelType(flType);
      setPricePerLitter(perlitt);
      setTotalPrice(totalprc);
      setsalesDate(salDate);
      setCustomerPhone(cusPhone);
      setCustomerEmail(cusEmail);
      setFuelTank(tankNum);
      setStatus(salStatus);
      // setDefaultLitter(litt);

      setLitter(litt);
    };
    fetchData();
  }, []);

  // CHECK FUEL PRICE
  useEffect(() => {
    if (fuelType === "Bazine") {
      setPricePerLitter(1.25);
    } else if (fuelType === "Ethanol") {
      setPricePerLitter(1);
    } else if (fuelType === "Gasoline") {
      setPricePerLitter(0.5);
    } else if (fuelType === "Kerosene") {
      setPricePerLitter(0.25);
    } else if (fuelType === "Diesel Fuel") {
      setPricePerLitter(1.75);
    } else {
      setPricePerLitter("");
    }
  }, [fuelType]);

  // CALCULATE FUEL TOTAL
  useEffect(() => {
    setTotalPrice(litter * pricePerLitter);
  }, [litter, pricePerLitter]);

  // FETCH CUSTOMER DETAILS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "customers", customerID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const supphone = docSnap.data().phone;
          const supemail = docSnap.data().email;

          setCustomerPhone(supphone);
          setCustomerEmail(supemail);
          setCustomerName(docSnap.data().name);
        } else {
          setError("Customer not found");
        }
      } catch (error) {
        setError("Error fetching customer data");
      }
    };
    fetchData();
  }, [customerID]);

  // FETCH CUSTOMER AND FUEL DATA
  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "customers"), (snapShot) => {
      let list = [];
      snapShot.docs.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setData(list);
    });
    const unsub2 = onSnapshot(collection(db, "fuel"), (snapShot) => {
      let list = [];
      snapShot.docs.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setFuelData(list);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // FETCH FUEL DETAILS
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "fuel", fuelID);
      const docSnap = await getDoc(docRef);

      setCurrentFuel(docSnap.data());

      const tanknum = docSnap.data().tankNumber;
      setFuelTank(tanknum);
    };
    fetchData();
  }, [fuelID]);

  console.log("customerName: ", customerName);
  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "sales", exectSalesID);
      await setDoc(docRef, {
        customerName,
        customerID,
        customerPhone,
        customerEmail,
        fuelType,
        fuelTank,
        litter,
        pricePerLitter,
        totalPrice,
        salesDate,
        status,
      });
      alert("Sale has been updated successfully");
      navigate("/sales");
    } catch (error) {
      console.log(error);
      setError("Error updating sales data");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full ml-[233px]">
        <Navbar />
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Edit Sales</h1>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-bold">Customer Name</label>
              <select
                // defaultValue={defaultValue}
                name="supp-name"
                className="supp_name border border-gray-400 p-2 rounded w-full"
                value={customerName}
                onChange={(e) => {
                  // setSuppName(e.target.value);
                  // console.log(suppName);
                  suppData.filter((el) => {
                    if (el.id == e.target.value) {
                      setCustomerID(el.id);
                      setCustomerName(el.cusname);
                    }
                  });
                }}
              >
                <option value={customerName}>{customerName}</option>
                {data.map((el) => {
                  suppData.push({ id: el.id, cusname: el.fullName });
                  return <option value={el.id}>{el.fullName}</option>;
                })}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-bold">Fuel Type</label>
              <select
                className="border border-gray-400 p-2 rounded w-full"
                value={fuelType}
                onChange={(e) => {
                  fuelData.filter((el) => {
                    if (el.id == e.target.value) {
                      setFuelType(el.fuelType);
                      setFuelID(el.id);
                    }
                  });
                }}
              >
                <option value={defaultFuelType}>{defaultFuelType}</option>
                {fuelData.map((el) => {
                  fulTempData.push({ id: el.id, fuelType: el.fuelType });
                  return <option value={el.id}>{el.fuelType}</option>;
                })}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-bold">Litter</label>
              <input
                className="border border-gray-400 p-2 rounded w-full"
                type="number"
                value={litter}
                onChange={(e) => setLitter(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2 font-bold">Price Per Litter</label>
              <input
                className="border border-gray-400 p-2 rounded w-full"
                type="number"
                value={pricePerLitter}
                onChange={(e) => setPricePerLitter(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-bold">Total Price</label>
              <input
                className="border border-gray-400 p-2 rounded w-full"
                type="number"
                value={totalPrice}
                readOnly
              />
            </div>
            <div>
              <label className="block mb-2 font-bold">Purchase Date</label>
              <input
                className="border border-gray-400 p-2 rounded w-full"
                type="date"
                value={salesDate}
                onChange={(e) => setsalesDate(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-bold">Customer Phone</label>
              <input
                className="border border-gray-400 p-2 rounded w-full"
                type="text"
                value={customerPhone}
                readOnly
              />
            </div>
            <div>
              <label className="block mb-2 font-bold">Customer Email</label>
              <input
                className="border border-gray-400 p-2 rounded w-full"
                type="text"
                value={customerEmail}
                readOnly
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-bold">Fuel Tank</label>
              <input
                className="border border-gray-400 p-2 rounded w-full"
                type="text"
                value={fuelTank}
                readOnly
              />
            </div>
            <div>
              <label className="block mb-2 font-bold">Status</label>
              <select
                className="border border-gray-400 p-2 rounded w-full"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value={status}>{status}</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
              </select>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex justify-between">
            {" "}
            <p className="text-red-500">{error}</p>{" "}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleUpdate}
            >
              {" "}
              Update{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default EditSales;
