import noImage from "../../assets/no-pictures.png";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import {
  ModeEditOutlined,
  RemoveRedEyeOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";

import Skeleton from "react-loading-skeleton";

const NewCustomer = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("male");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [per, setPer] = useState(null);

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

  const [formErrors, setFormErrors] = useState({});

  const handleAdd = async () => {
    const errors = {};

    // Input validation
    if (!fullName) {
      errors.fullName = "Full name is required";
    }

    if (!phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{9}$/.test(phone)) {
      errors.phone = "Invalid phone number";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Invalid email address";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Add new employee to database
    try {
      await addDoc(collection(db, "customers"), {
        fullName: fullName,
        phone: phone,
        // gender: gender,
        // image: image,
        // age: age,
        address: address,
        email: email,
        time: `${dayDate}/${months[monthDate]}/${yearDate}`,
      });

      alert("Data has been added successfully!");
      navigate(-1);
    } catch (error) {
      console.log(error);
      alert("Failed to add new employee. Please try again later.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-col flex-1 w-full">
        <div className="flex flex-col flex-1 mx-4 my-8 overflow-y-auto bg-white rounded-lg shadow-lg">
          <div className="text-2xl font-medium text-gray-400 px-6">
            New Customer
          </div>

          <div className="px-6 py-4  mt-[6rem]">
            <form action="" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="full-name" className="text-gray-800 ">
                  Full name
                </label>
                <input
                  type="text"
                  id="full-name"
                  className={`block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none ${
                    formErrors.fullName && "border-red-500"
                  }`}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {formErrors.fullName && (
                  <div className="text-red-500 mb-2">{formErrors.fullName}</div>
                )}
              </div>
              <div>
                <label htmlFor="email" className="text-gray-800">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  className={`block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none ${
                    formErrors.phone && "border-red-500"
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {formErrors.phone && (
                  <div className="text-red-500 mb-2">{formErrors.phone}</div>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="text-gray-800">
                  Phone number
                </label>
                <input
                  type="text"
                  id="phone"
                  className={`block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none ${
                    formErrors.email && "border-red-500"
                  }`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {formErrors.email && (
                  <div className="text-red-500 mb-2">{formErrors.email}</div>
                )}
              </div>

              <div>
                <label htmlFor="address" className="text-gray-800">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className={`block w-full border border-gray-300 focus:outline-none rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3`}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <button
                  type="button"
                  disabled={per !== null}
                  className="inline-flex items-center px-14 py-3 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:shadow-outline-indigo disabled:opacity-25 transition ease-in-out duration-150"
                  onClick={handleAdd}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCustomer;
