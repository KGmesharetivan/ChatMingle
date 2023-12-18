/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male"); // Default to male
  const navigate = useNavigate();

  const showToast = (message, type = "info") => {
    toast[type](message);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname,
          email,
          phone,
          role: "user", // Assuming a default role for new users
          gender,
          password,
        }),
      });

      const data = await response.json();

      if (data.registered) {
        // Registration successful, redirect to login page or any other desired page
        navigate("/login");
        showToast("Registration successful. Please log in.", "success");
      } else {
        console.log("Registration failed:", data.message);
        showToast(`Registration failed. ${data.message}`, "error");
      }
    } catch (error) {
      console.error("Error during user registration:", error);
      showToast(
        "An error occurred during registration. Please try again later.",
        "error"
      );
    }
  };

  return (
    <section>
      <div className="flex justify-center items-center">
        <form className="form_main" onSubmit={handleSubmit}>
          <p className="heading">Sign Up</p>

          <div className="inputContainer">
            <input
              placeholder="Fullname"
              id="fullname"
              className="inputField"
              type="text"
              required
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>

          <div className="inputContainer">
            <input
              placeholder="Email"
              id="email"
              className="inputField"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="inputContainer">
            <input
              placeholder="Phone"
              id="phone"
              className="inputField"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="inputContainer">
            <input
              placeholder="Password"
              id="password"
              className="inputField"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="genderContainer">
            <label className="mr-4">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={() => setGender("male")}
                required
              />
              Male
            </label>
            <label className="ml-4">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={() => setGender("female")}
                required
              />
              Female
            </label>
          </div>

          <button id="button" type="submit">
            Sign Up
          </button>

          <div className="signupContainer">
            <p>Already have an account?</p>
            <Link to="/login">
              <button href="#">Login</button>
            </Link>
          </div>
        </form>
      </div>
      {/* Toast container for alerts */}
      <ToastContainer />
    </section>
  );
};

export default Signup;
