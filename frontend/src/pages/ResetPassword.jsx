/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import LoginLoader from "../components/Loader/LoginLoader";

const ResetPassword = ({ toast }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    confirmPassword: "",
    code: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { identifier, password, confirmPassword, code } = formData;

    // Add validation logic if needed
    if (password !== confirmPassword) {
      // Use toast for validation error
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:5173/auth/resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          newPassword: password,
          resetToken: code,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Password reset successful, show success toast
        toast.success("Password reset successful");
        console.log("Password reset successful");

        // Navigate to the login page
        navigate("/login");
      } else {
        // Handle unsuccessful password reset with toast
        toast.error(`Error resetting password: ${result.message}`);
        console.error("Error resetting password:", result.message);
      }
    } catch (error) {
      // Handle network error or other exceptions with toast
      toast.error(`Error resetting password: ${error.message}`);
      console.error("Error resetting password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white relative items-center w-full px-5 py-12 mx-auto md:px-12 lg:px-20 max-w-7xl">
        <div className="w-full max-w-md mx-auto md:max-w-sm md:px-0 md:w-96 sm:px-4">
          <div className="flex flex-col">
            <div>
              <h2 className="text-4xl text-black">Reset password</h2>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="mt-4 space-y-6">
            <div className="col-span-full">
              <label className="block mb-3 text-sm font-medium text-gray-600">
                Email or Phone
              </label>
              <input
                type="text"
                placeholder="Enter email or phone"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                className="block w-full px-6 py-3 text-black bg-white border border-gray-200 rounded-full appearance-none placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="col-span-full">
              <label className="block mb-3 text-sm font-medium text-gray-600">
                New Password
              </label>
              <input
                type="password"
                placeholder="******"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-6 py-3 text-black bg-white border border-gray-200 rounded-full appearance-none placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="col-span-full">
              <label className="block mb-3 text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="******"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full px-6 py-3 text-black bg-white border border-gray-200 rounded-full appearance-none placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="col-span-full">
              <label className="block mb-3 text-sm font-medium text-gray-600">
                Code
              </label>
              <input
                type="password"
                placeholder="******"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="block w-full px-6 py-3 text-black bg-white border border-gray-200 rounded-full appearance-none placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="col-span-full">
              <button
                type="submit"
                className="items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full inline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
              >
                {isLoading ? <LoginLoader /> : "Submit your request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

ResetPassword.propTypes = {
  toast: PropTypes.func.isRequired,
};

export default ResetPassword;
