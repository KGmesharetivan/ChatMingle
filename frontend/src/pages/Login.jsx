/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Login = ({ setUser, isLoggedIn, setLoggedIn, toast }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in when the component mounts
    if (isLoggedIn) {
      // Redirect to "/mingle" or show a message
      navigate("/mingle");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/functions/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: username, userPassword: password }),
        credentials: "include", // Include credentials in the request
      });

      if (!response.ok) {
        console.error("Login failed. Server response:", response.statusText);
        toast.error("Login failed. Please try again.");
        return;
      }

      const data = await response.json();

      if (data.loginStatus) {
        // Assuming the server sends back the user data
        setLoggedIn(true);
        setUser(data.user); // Update the user state with the received user data

        // Introduce a 2-second delay before navigating to "/mingle"
        setTimeout(() => {
          navigate("/mingle");
        }, 2000);

        toast.success("Login successful!");
      } else {
        console.error("Login failed. Server response:", data);
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred during login. Please try again later.");
    }
  };

  return (
    <section className="hero__section pt-[60px] 2xl:h-[800px]">
      <div className="flex justify-center items-center">
        {" "}
        <form className="form_main" action="">
          <p className="heading">Login</p>
          <div className="inputContainer">
            <svg
              viewBox="0 0 16 16"
              fill="#2e2e2e"
              height="16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
              className="inputIcon"
            >
              <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
            </svg>
            <input
              placeholder="Username"
              id="username"
              className="inputField"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="inputContainer">
            <svg
              viewBox="0 0 16 16"
              fill="#2e2e2e"
              height="16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
              className="inputIcon"
            >
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
            </svg>
            <input
              placeholder="Password"
              id="password"
              className="inputField"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button id="button" onClick={handleSubmit}>
            Submit
          </button>

          <div className="signupContainer">
            <p>Don't have any account?</p>
            <Link to="/signup">
              <button>Sign up</button>
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

// Add propTypes to specify the expected props
Login.propTypes = {
  setLoggedIn: PropTypes.func.isRequired,
  toast: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default Login;
