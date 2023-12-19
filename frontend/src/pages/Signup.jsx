/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Signup = ({ toast }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male"); // Default to male
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/functions/auth/register", {
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
        toast.success("Registration successful. Please log in.");
      } else {
        console.log("Registration failed:", data.message);
        toast.error(`Registration failed. ${data.message}`);
      }
    } catch (error) {
      console.error("Error during user registration:", error);
      toast.error(
        "An error occurred during registration. Please try again later."
      );
    }
  };

  return (
    <section className="hero__section pt-[60px] 2xl:h-[800px]">
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
    </section>
  );
};

// Add propTypes to specify the expected props
Signup.propTypes = {
  toast: PropTypes.func.isRequired,
};

export default Signup;
