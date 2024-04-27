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

const NewEmployee = () => {
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

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPer(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          setPer(null);
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImage(downloadURL);
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

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

    if (!age) {
      errors.age = "Age is required";
    } else if (!/^\d{2}$/.test(age)) {
      errors.age = "Invalid age";
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
      await addDoc(collection(db, "employees"), {
        fullName: fullName,
        phone: phone,
        gender: gender,
        image: image,
        age: age,
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
            New Employee
          </div>
          <div className="flex flex-col md:flex-row mb-4 px-6 items-center justify-center">
            <div className="relative w-32 h-32 md:w-48 md:h-48 flex justify-center items-center border border-blue-600 rounded-full">
              {image ? (
                !per && (
                  <img
                    src={file ? URL.createObjectURL(file) : ""}
                    alt="employee"
                    className="object-cover w-full h-full rounded-full "
                  />
                )
              ) : (
                <Skeleton
                  width={200}
                  height={200}
                  className="absolute inset-0"
                  style={{
                    borderRadius: "50%",
                    zIndex: "1",
                    position: "relative",
                  }}
                />
              )}
              {per && (
                <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-600 absolute top-[13rem] rounded-lg">
                  <div
                    className="h-1 bg-blue-600"
                    style={{ width: `${per}%` }}
                  ></div>
                </div>
              )}
              <label
                htmlFor="image"
                className="absolute bottom-0 right-0 bg-white rounded-full h-10 w-10 flex justify-center items-center cursor-pointer shadow-md hover:shadow-lg  z-10"
              >
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  disabled={per !== null}
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </label>
            </div>
            <div className="flex flex-col md:ml-4 mt-4 md:mt-0">
              <div className="text-gray-800 text-xl mb-2">
                {fullName || <Skeleton />}
              </div>
              <div className="text-gray-600 text-sm">
                {email ? email : "No email available"}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 px-6 py-4 mt-[1rem]">
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
                <label htmlFor="age" className="text-gray-800">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  className={`block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3 focus:outline-none ${
                    formErrors.age && "border-red-500"
                  }`}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
                {formErrors.age && (
                  <div className="text-red-500 mb-2">{formErrors.age}</div>
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
              <div>
                <label htmlFor="gender" className="text-gray-800">
                  Gender
                </label>
                <select
                  id="gender"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 py-2 px-3"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
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

export default NewEmployee;
