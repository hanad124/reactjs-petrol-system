import "./singleUser.scss";
import sampleImg from "../../assets/sample-img.jpg";
import peroloader from "../../assets/preloader.gif";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const NewUser = () => {
  const navigate = useNavigate();
  const [picture, setPicture] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [address, setAddress] = useState("");
  const [password, setpassword] = useState("");
  const [roll, setRoll] = useState("");
  const [jionDate, setJionDate] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = JSON.parse(localStorage.getItem("userID"));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      // console.log(docSnap.data());
      const userImg = docSnap.data().image;
      const userName = docSnap.data().username;
      const userAddress = docSnap.data().address;
      const userID = userId;
      const userPhone = docSnap.data().phone;
      const userEmail = docSnap.data().email;
      const userPassword = docSnap.data().password;
      const userRoll = docSnap.data().roll;
      const userJionDate = docSnap.data().time;

      setPicture(userImg);
      setName(userName);
      setAddress(userAddress);
      setpassword(userPassword);
      setRoll(userRoll);
      setJionDate(userJionDate);
      setPhone(userPhone);
      setEmail(userEmail);
      setId(userID);

      setLoading(false);
    };
    fetchData();
  }, []);
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <img src={peroloader} alt="preloader" className="preloader" />;
  }
  return (
    <div className="flex">
      <Sidebar className="" />
      <div className="flex flex-col flex-1 w-full  ml-[233px]">
        <Navbar />
        <div className="flex flex-col items-center justify-center flex-1 w-full py-8 ">
          <div className="bg-white rounded-lg shadow-md w-[37rem] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img src={picture} alt="" className="w-12 h-12 rounded-full" />
                <div className="ml-4">
                  <h2 className="text-lg font-medium">{name}</h2>
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-3.5 h-3.5 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                    <p className="font-small text-[12px]">{address}</p>
                  </div>
                </div>
              </div>
              <button
                className="text-white text-sm hover:bg-[#1365bb] flex items-center gap-2 bg-[#007bff] py-1 px-3 rounded-md"
                onClick={handleBack}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                  />
                </svg>
                Back
              </button>
            </div>
            <div className="flex justify-between mt-[3rem]">
              <div className="flex flex-col">
                <div className="mb-4 flex gap-3">
                  <p className="text-gray-500 text-sm">ID</p>
                  <p className="font-medium">{id}</p>
                </div>
                <div className="mb-4 flex gap-3">
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="font-medium">{phone}</p>
                </div>
                <div className="mb-4 flex gap-3">
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium">{email}</p>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mb-4 flex gap-3">
                  <p className="text-gray-500 text-sm">Password: </p>
                  <p className="font-medium">{password.replace(/./g, "*")}</p>
                </div>
                <div className="mb-4  flex gap-3">
                  <p className="text-gray-500 text-sm">Roll:</p>
                  <p className="font-medium">{roll}</p>
                </div>
                <div className="mb-4  flex gap-3">
                  <p className="text-gray-500 text-sm">Join Date:</p>
                  <p className="font-medium">{jionDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
