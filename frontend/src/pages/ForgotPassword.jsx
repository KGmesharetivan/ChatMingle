/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [resetOption, setResetOption] = useState("email");
  const navigate = useNavigate();

  const handleOptionChange = (event) => {
    setResetOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your form submission logic here

    // Redirect based on the selected reset option
    if (resetOption === "email") {
      navigate("/resetpasswordemail");
    } else if (resetOption === "sms") {
      navigate("/resetpasswordtext");
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
            <button type="submit" className="forgot-send-btn">
              Send Link
            </button>
            <p className="sub-title">
              Didn't receive link?{" "}
              <span className="resend">
                Resend<span></span>
              </span>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
