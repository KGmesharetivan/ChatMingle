/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";
import Home from "../pages/Home";
import Mingle from "../pages/Mingle";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile/Profile";
import ProfileDetails from "../pages/Profile/ProfileDetails";
import { Routes, Route } from "react-router-dom";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

const Routers = ({ isLoggedIn, setLoggedIn, user, setUser, toast }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="home" element={<Home />} />
      <Route path="/profile" element={<Profile isLoggedIn={isLoggedIn} />} />
      <Route path="/profile/:id" element={<ProfileDetails />} />
      <Route
        path="/login"
        element={
          <Login
            setLoggedIn={setLoggedIn}
            toast={toast}
            isLoggedIn={isLoggedIn}
            setUser={setUser}
          />
        }
      />
      <Route path="/signup" element={<Signup toast={toast} />} />
      <Route
        path="/mingle"
        element={<Mingle isLoggedIn={isLoggedIn} toast={toast} user={user} />}
      />
      <Route
        path="/contact"
        element={<Contact toast={toast} isLoggedIn={isLoggedIn} />}
      />
      <Route
        path="/forgotpassword"
        element={<ForgotPassword toast={toast} />}
      />
      <Route path="/resetpassword" element={<ResetPassword toast={toast} />} />
    </Routes>
  );
};

// Add propTypes to specify the expected props
Routers.propTypes = {
  user: PropTypes.object,
  setLoggedIn: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  setUser: PropTypes.func.isRequired,
  toast: PropTypes.func.isRequired,
};

export default Routers;
