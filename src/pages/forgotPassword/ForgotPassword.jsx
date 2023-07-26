import React, { useState, useEffect } from "react";
import "./forgotPassword.scss";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  onSnapshot,
  where,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState([]);
  const [email, setEmail] = useState("");
  const [secretQuestion, setSecretQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [answerError, setAnswerError] = useState("");

  const resetErrors = () => {
    setEmailError("");
    setAnswerError("");
  };

  const handleEmailVerification = (e) => {
    e.preventDefault();
    resetErrors();

    if (!email) {
      setEmailError("Email is required.");
      return;
    }

    const colRef = collection(db, "users");

    const qry = query(colRef, where("email", "==", email));

    const unsub = onSnapshot(
      qry,
      (snapShot) => {
        let correctEmail = [];
        snapShot.docs.forEach((doc) => {
          correctEmail.push({ id: doc.id, ...doc.data() });
        });
        if (email == correctEmail[0].email) {
          setSecretQuestion(correctEmail[0].secret_question);
          setStep(2);
        } else {
          setEmailError("Email not found.");
        }
      },
      (error) => {
        console.log(error);
        setEmailError("Email not found.");
      }
    );

    return () => {
      unsub();
    };
  };

  const handleSecurityQuestion = (e) => {
    e.preventDefault();

    if (!answer) {
      setAnswerError("Answer is required.");
      return;
    }

    const colRef = collection(db, "users");

    const qry = query(colRef, where("email", "==", email));

    const unsub = onSnapshot(
      qry,
      (snapShot) => {
        let correctAns = [];
        snapShot.docs.forEach((doc) => {
          correctAns.push({ id: doc.id, ...doc.data() });
        });
        if (answer == correctAns[0].answer) {
          setPassword(correctAns[0].password);
          setStep(3);
        } else {
          setAnswerError("Incorrect answer.");
        }
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 },
  };

  const handleSpanClick = () => {
    const code = document.querySelector(".passText").textContent;
    navigator.clipboard.writeText(code);
    alert("text copied to clipboard!");
  };

  return (
    <motion.div
      className="password-reset-page"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.h1 className="password-reset-page__title" variants={itemVariants}>
        Forgot Password
      </motion.h1>

      <motion.form
        className="password-reset-page__form"
        variants={itemVariants}
      >
        {step === 1 && (
          <motion.div
            className="password-reset-page__step"
            variants={itemVariants}
          >
            <label
              className="password-reset-page__label"
              htmlFor="email"
              variants={itemVariants}
            >
              Email
            </label>
            <input
              className="password-reset-page__input"
              type="email"
              value={email}
              name="email"
              id="email"
              placeholder="Enter Your Email"
              required
              onChange={(e) => setEmail(e.target.value)}
              variants={itemVariants}
            />
            {emailError && (
              <p className="password-reset-page__error" variants={itemVariants}>
                {emailError}
              </p>
            )}
            <button
              className="password-reset-page__button"
              onClick={handleEmailVerification}
              variants={itemVariants}
            >
              Submit
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            className="password-reset-page__step"
            variants={itemVariants}
          >
            <p
              className="password-reset-page__question"
              variants={itemVariants}
            >
              {secretQuestion}
            </p>
            <label
              className="password-reset-page__label"
              htmlFor="answer"
              variants={itemVariants}
            >
              Answer
            </label>
            <input
              className="password-reset-page__input"
              type="text"
              name="answer"
              id="answer"
              value={answer}
              required
              onChange={(e) => setAnswer(e.target.value)}
              variants={itemVariants}
            />
            {answerError && (
              <p className="password-reset-page__error" variants={itemVariants}>
                {answerError}
              </p>
            )}
            <button
              className="password-reset-page__button"
              onClick={handleSecurityQuestion}
              variants={itemVariants}
            >
              Submit
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            className="password-reset-page__step"
            variants={itemVariants}
          >
            <p
              className="password-reset-page__success-message"
              variants={itemVariants}
            >
              Your password :
              <span className="passText" onClick={handleSpanClick}>
                {password}
              </span>
            </p>
            <button
              className="password-reset-page__button"
              onClick={handleResetPassword}
              variants={itemVariants}
            >
              Go to Login
            </button>
          </motion.div>
        )}
      </motion.form>
    </motion.div>
  );
}

export default ForgotPassword;
