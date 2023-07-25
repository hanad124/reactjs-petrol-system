import "./newSupplier.scss";
import noImage from "../../assets/no-pictures.png";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import { async } from "@firebase/util";

const NewSupplier = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [emailError, setEmailError] = useState("");
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

  const handleAdd = async () => {
    await addDoc(collection(db, "suppliers"), {
      fullName: fullName,
      phone: phone,
      address: address,
      email: email,
      time: dayDate + "/" + months[monthDate] + "/" + yearDate,
    });

    alert("data has added successfully!");
    navigate(-1);
  };

  const validateFullName = () => {
    if (fullName.trim() === "") {
      setFullNameError("Full name is required.");
    } else {
      setFullNameError("");
    }
  };

  const validatePhone = () => {
    if (phone.trim() === "") {
      setPhoneError("Phone number is required.");
    } else if (!/^\d{10}$/i.test(phone)) {
      setPhoneError("Phone number must be 10 digits.");
    } else {
      setPhoneError("");
    }
  };

  const validateAddress = () => {
    if (address.trim() === "") {
      setAddressError("Address is required.");
    } else {
      setAddressError("");
    }
  };

  const validateEmail = () => {
    if (email.trim() === "") {
      setEmailError("Email is required.");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setEmailError("Invalid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
    validateFullName();
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    validatePhone();
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    validateAddress();
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    validateEmail();
  };

  const isFormValid = () => {
    return (
      fullNameError === "" &&
      phoneError === "" &&
      addressError === "" &&
      emailError === "" &&
      per !== null &&
      per >= 100
    );
  };

  return (
    <div className="newSupplier">
      <Sidebar />
      <div className="newSupplierContainer">
        <Navbar />
        <div className="wrapper">
          <div className="title">Add New Supplier</div>
          <div className="wrapper-cols">
            <div className="wrapper-cols-2">
              <p className="fullName">Full name</p>
              <input
                type="text"
                onChange={handleFullNameChange}
                onBlur={validateFullName}
                className={`${fullNameError !== "" ? "border-red-500" : ""}`}
              />
              {fullNameError !== "" && (
                <p className="text-red-500">{fullNameError}</p>
              )}
              <p className="label phone">Phone</p>
              <input
                type="text"
                onChange={handlePhoneChange}
                onBlur={validatePhone}
                className={`${phoneError !== "" ? "border-red-500" : ""}`}
              />
              {phoneError !== "" && (
                <p className="text-red-500">{phoneError}</p>
              )}
            </div>
            <div className="wrapper-cols-3">
              <p className="address">Address</p>
              <input
                type="text"
                onChange={handleAddressChange}
                onBlur={validateAddress}
                className={`${addressError !== "" ? "border-red-500" : ""}`}
              />
              {addressError !== "" && (
                <p className="text-red-500">{addressError}</p>
              )}
              <p className="email">Email</p>
              <input
                type="text"
                onChange={handleEmailChange}
                onBlur={validateEmail}
                className={`${emailError !== "" ? "border-red-500" : ""}`}
              />
              {emailError !== "" && (
                <p className="text-red-500">{emailError}</p>
              )}
            </div>
          </div>
          <button
            className="btn-save"
            onClick={handleAdd}
            disabled={!isFormValid()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewSupplier;
