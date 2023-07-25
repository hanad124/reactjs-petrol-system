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
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full ml-[233px]">
        <Navbar />
        <div className="flex flex-col items-center justify-center w-full flex-grow md:flex-row">
          <div className="flex flex-col items-center justify-center w-full md:w-1/2">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden">
                <img
                  src={file ? URL.createObjectURL(file) : noImage}
                  alt=""
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-80 transition-opacity">
                  <label htmlFor="file" className="cursor-pointer">
                    <ModeEditOutlined className="text-white w-6 h-6" />
                  </label>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    className="hidden"
                    style={{ cursor: "pointer" }}
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full md:w-1/2">
            <div className="text-lg font-bold mb-4">Add New Employee</div>
            <div className="flex flex-col md:flex-row">
              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="fullName" className="mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  className={`border border-gray-400 rounded-lg px-3 py-2 mb-4 w-full ${
                    formErrors.fullName && "border-red-500"
                  }`}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {formErrors.fullName && (
                  <div className="text-red-500 mb-2">{formErrors.fullName}</div>
                )}
                <label htmlFor="phone" className="mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className={`border border-gray-400 rounded-lg px-3 py-2 mb-4 w-full ${
                    formErrors.phone && "border-red-500"
                  }`}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {formErrors.phone && (
                  <div className="text-red-500 mb-2">{formErrors.phone}</div>
                )}
              </div>
              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="email" className="mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={`border border-gray-400 rounded-lg px-3 py-2 mb-4 w-full ${
                    formErrors.email && "border-red-500"
                  }`}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {formErrors.email && (
                  <div className="text-red-500 mb-2">{formErrors.email}</div>
                )}
                <label htmlFor="gender" className="mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  className="border border-gray-400 rounded-lg px-3 py-2 mb-4 w-full"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="age" className="mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  className="border border-gray-400 rounded-lg px-3 py-2 mb-4 w-full"
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-full md:w-1/2">
                <label htmlFor="address" className="mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  id="address"
                  rows="3"
                  className="border border-gray-400 rounded-lg px-3 py-2 mb-4 w-full"
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>
            </div>
            <button
              type="button"
              className="bg-blue-500 text-white rounded-lg px-4 py-2"
              onClick={handleAdd}
            >
              Add Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEmployee;
