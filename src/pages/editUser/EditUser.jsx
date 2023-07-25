import "./editUser.scss";

import noImage from "../../assets/no-pictures.png";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import EditUserContext from "../../context/EditUserContext";

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  getDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const EditUser = () => {
  const { editUser, setEditUser } = useContext(EditUserContext);
  const [file, setFile] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roll, setRoll] = useState("user");
  const [username, setUserName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [per, setPer] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "users", editUser);
      const docSnap = await getDoc(docRef);

      const userImg = docSnap.data().image;
      const userName = docSnap.data().username;
      const userAddress = docSnap.data().address;
      const userPhone = docSnap.data().phone;
      const userEmail = docSnap.data().email;
      const userPassword = docSnap.data().password;
      const userRoll = docSnap.data().roll;

      setUserName(userName);
      setEmail(userEmail);
      setPhone(userPhone);
      setRoll(userRoll);
      setAddress(userAddress);
      setPassword(userPassword);
      setImage(userImg);
    };
    fetchData();
  }, []);

  const handleUpdate = async () => {
    if (!username || !email || !password || !phone || !address) {
      alert("Please fill all the fields!");
      return;
    }
    try {
      await setDoc(doc(db, "users", editUser), {
        roll: roll,
        phone: phone,
        address: address,
        username: username,
        email: email,
        password: password,
        image: image,
        time: dayDate + "/" + months[monthDate] + "/" + yearDate,
      });
      alert("Data has been updated successfully!");
      navigate("/users");
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };

  const HidePassword = () => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-[233px]">
        <Navbar />
        <div className="user-edit_container bg-white p-10 rounded-lg shadow-md">
          <div className="text-3xl font-medium mb-4 text-gray-400">
            Edit User
          </div>
          <div className="flex items-center mb-6">
            <img
              src={image ? image : noImage}
              alt=""
              className="w-24 h-24 object-cover rounded-full mr-6"
            />
            <div>
              <div className="text-xl font-bold">{username}</div>
              <div className="text-gray-500">{email}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                className="border border-gray-400 rounded-lg p-2"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-400 rounded-lg p-2"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-400 rounded-lg p-2 pr-10"
                />
                <button
                  className="absolute top-2 right-2 focus:outline-none"
                  onClick={HidePassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-gray-400 rounded-lg p-2"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border border-gray-400 rounded-lg p-2"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="roll">Roll</label>
              <select
                id="roll"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                className="border border-gray-400 rounded-lg p-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="image">Image</label>
              <input
                type="file"
                id="image"
                onChange={(e) => setFile(e.target.files[0])}
                className="border border-gray-400 rounded-lg p-2"
              />
              {per && (
                <div className="mt-2">
                  <progress value={per} max="100" />
                </div>
              )}
            </div>
          </div>
          <button
            className="bg-blue-500 text-white py-3 px-4 mt-6 rounded-md hover:bg-blue-600 transition-colors w-1/6"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
