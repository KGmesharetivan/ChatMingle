/* eslint-disable no-unused-vars */
import React from "react";
import Home from "../pages/Home";
import Services from "../pages/Mingle";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Doctors from "../pages/Doctors/Doctors";
import DoctorDetails from "../pages/Doctors/DoctorDetails";

import { Routes, Route } from "react-router-dom";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="home" element={<Home />} />
      <Route path="/profile" element={<Doctors />} />
      <Route path="/profile/:id" element={<DoctorDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/mingle" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default Routers;
