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

const Routers = ({ setLoggedIn }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:id" element={<ProfileDetails />} />
      <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/mingle" element={<Mingle />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

// Add propTypes to specify the expected props
Routers.propTypes = {
  setLoggedIn: PropTypes.func.isRequired,
};

export default Routers;
