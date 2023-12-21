/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ForgotPassword = ({ toast }) => {
  const [resetOption, setResetOption] = useState("email");
  const [userInput, setUserInput] = useState("");
  const navigate = useNavigate();

  const handleOptionChange = (event) => {
    setResetOption(event.target.value);
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let apiEndpoint;
      let requestBody;

      if (resetOption === "email") {
        apiEndpoint = "https://48byhymg2s.ap-southeast-1.awsapprunner.com/auth/sendcode";
        requestBody = {
          toEmail: userInput,
        };
      } else if (resetOption === "sms") {
        apiEndpoint = "https://48byhymg2s.ap-southeast-1.awsapprunner.com/auth/sendsms";
        requestBody = {
          toPhone: userInput,
        };
      }

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (result.success) {
        // Optionally, you can navigate to a success page or show a success message
        // Navigate to /resetpassword
        navigate("/resetpassword");
        // Display success toast
        toast.success(
          resetOption === "email"
            ? "Reset link will be sent to your registered email address"
            : "Reset link sent to your registered number"
        );
      } else {
        // Handle error case, show an error message, etc.
        console.error(result.message);
        // Display error toast
        toast.error("Error sending reset link");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error case, show an error message, etc.
      // Display error toast
      toast.error("Error submitting form");
    }
  };

  return (
    <section>
      <div className="container">
        <div className="flex justify-center items-center">
          <form className="forgot-password" onSubmit={handleSubmit}>
            <div className="forgot-header">
              <span className="title">Forgot Password</span>
              <p className="sub-title">
                Please Select Option To Reset Password
              </p>
            </div>
            <div className="reset-option">
              <input
                value="email"
                id="email"
                name="option"
                type="radio"
                checked={resetOption === "email"}
                onChange={handleOptionChange}
              />
              <label htmlFor="email">
                <div className="reset-info">
                  <span className="reset-title">Reset via Email</span>
                  <span className="reset-sub-title">
                    Reset link will be sent to your registered email address
                  </span>
                </div>
              </label>
            </div>
            <div className="reset-option">
              <input
                value="sms"
                id="sms"
                name="option"
                type="radio"
                checked={resetOption === "sms"}
                onChange={handleOptionChange}
              />
              <label htmlFor="sms">
                <div className="reset-info">
                  <span className="reset-title">Reset via SMS</span>
                  <span className="reset-sub-title">
                    Reset link will be sent to your registered number
                  </span>
                </div>
              </label>
            </div>
            <div className="user-input">
              <label className="mr-2">
                {resetOption === "email" ? "Email:" : "Phone Number:"}
              </label>
              <input
                className="ml-2"
                type={resetOption === "email" ? "email" : "tel"}
                value={userInput}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="forgot-send-btn">
              {resetOption === "email" ? "Send Code" : "Send SMS Code"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

ForgotPassword.propTypes = {
  toast: PropTypes.func.isRequired,
};

export default ForgotPassword;
