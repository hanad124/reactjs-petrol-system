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

const NewUser = () => {
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

  const handleAdd = async () => {
    // Validating fields
    if (!username || !email || !password || !phone || !address || !file) {
      alert("Please fill in all the fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      // const res = await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, "users"), {
        roll: roll,
        phone: phone,
        address: address,
        username: username,
        email: email,
        password: password,
        image: image,
        time: dayDate + "/" + months[monthDate] + "/" + yearDate,
      });
      alert("User has been successfully added!");
      navigate("/users");
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };

  const hidePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full ml-[233px]">
        <Navbar />
        <div className="px-6 py-4 flex-grow">
          <div className="text-lg font-medium mb-6">Add New User</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden">
                <img
                  src={file ? URL.createObjectURL(file) : noImage}
                  alt=""
                  className="object-cover w-full h-full"
                />
                {per && (
                  <div className="absolute inset-0 bg-gray-300 bg-opacity-75 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full border-4 border-gray-100 border-opacity-25"></div>
                    <div className="relative w-16 h-16">
                      <div
                        className="absolute inset-0 bg-blue-500 rounded-full"
                        style={{
                          transform: `translate(-50%, -50%) rotate(${
                            per * 3.6
                          }deg)`,
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold">
                        {per.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-4 w-full"
              />
            </div>
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label htmlFor="username" className="text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password" className="text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div
                    onClick={hidePassword}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <RemoveRedEyeOutlinedIcon />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="phone" className="text-sm font-medium mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="address" className="text-sm font-medium mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="roll" className="text-sm font-medium mb-1">
                  Role
                </label>
                <select
                  id="roll"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setEditUser(null)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-4"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <span className="mr-2">Add User</span>
              <ModeEditOutlinedIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
