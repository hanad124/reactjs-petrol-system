// import "./editSales.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PurchaseContext from "../../context/PurchaseContext";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  deleteDoc,
  onSnapshot,
  where,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

const EditPurchase = () => {
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

  const exectPurchaseID = JSON.parse(localStorage.getItem("purchaseID"));

  //get the defualt data
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "purchase", exectPurchaseID);
      const docSnap = await getDoc(docRef);

      const cusNam = docSnap.data().suppName;
      const flType = docSnap.data().fuelType;
      const litt = docSnap.data().litter;
      const perlitt = docSnap.data().pricePerLitter;
      const totalprc = docSnap.data().totalPrice;
      const salDate = docSnap.data().perchaseDate;
      const cusPhone = docSnap.data().suppPhone;
      const cusEmail = docSnap.data().suppEmail;
      const tankNum = docSnap.data().fuelTank;
      const salStatus = docSnap.data().status;

      setCustomerName(cusNam);
      setFuelType(flType);
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

  // CALCULATE FUEL TOTAL
  useEffect(() => {
    setTotalPrice(litter * pricePerLitter);
  }, [litter, pricePerLitter]);

  // FETCH CUSTOMER DETAILS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "suppliers", customerID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const supphone = docSnap.data().phone;
          const supemail = docSnap.data().email;

          setCustomerPhone(supphone);
          setCustomerEmail(supemail);
          // setCustomerName(docSnap.data().name);
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
    const unsub1 = onSnapshot(collection(db, "suppliers"), (snapShot) => {
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
      const q = query(
        collection(db, "fuel"),
        where("fuelType", "==", fuelType)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        const docSnap = querySnapshot.docs[0];

        // setCurrentFuel(docSnap.data());
      } else {
        // console.log(`No customer found with ID ${custID}`);
      }
    };

    fetchData();
  }, [fuelType]);

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "purchase", exectPurchaseID);
      await setDoc(docRef, {
        suppName: customerName,
        suppPhone: customerPhone,
        suppEmail: customerEmail,
        fuelType: fuelType,
        fuelTank: fuelTank,
        litter: litter,
        pricePerLitter: pricePerLitter,
        totalPrice: totalPrice,
        perchaseDate: salesDate,
        status: status,
      });
      alert("purchase has been updated successfully");
      navigate("/purchase");
    } catch (error) {
      console.log(error);
      setError("Error updating purchase data");
    }
  };

  return (
    <div className="flex">
      <div className="w-full ">
        <div className="p-4">
          <h1 className="text-2xl text-slate-500 mb-4">Edit Purchase</h1>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm">Supplier Name</label>
              <select
                // defaultValue={defaultValue}
                name="supp-name"
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none"
                value={customerID}
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
              <label className="block mb-2 text-sm">Fuel Type</label>
              <select
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none"
                value={fuelID}
                onChange={(e) => {
                  fuelData.filter((el) => {
                    if (el.id == e.target.value) {
                      setFuelType(el.fuelType);
                      setFuelID(el.id);
                      setPricePerLitter(el.pricePerLitter);
                      setFuelTank(el.tankNumber);
                    }
                  });
                }}
              >
                <option value={fuelType}>{fuelType}</option>
                {fuelData.map((el) => {
                  fulTempData.push({
                    id: el.id,
                    fuelType: el.fuelType,
                  });
                  return <option value={el.id}>{el.fuelType}</option>;
                })}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm">Litter</label>
              <input
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none"
                type="number"
                value={litter}
                onChange={(e) => setLitter(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Price Per Litter</label>
              <input
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none"
                type="number"
                value={pricePerLitter}
                readOnly
                onChange={(e) => setPricePerLitter(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm">Total Price</label>
              <input
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none"
                type="number"
                value={totalPrice}
                readOnly
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Purchase Date</label>
              <input
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none"
                type="date"
                value={salesDate}
                onChange={(e) => setsalesDate(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm">Supplier Phone</label>
              <input
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none"
                type="text"
                value={customerPhone}
                readOnly
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Supplier Email</label>
              <input
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none"
                type="text"
                value={customerEmail}
                readOnly
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm">Fuel Tank</label>
              <input
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none"
                type="text"
                value={fuelTank}
                readOnly
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Status</label>
              <select
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none"
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
              className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded"
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
export default EditPurchase;
