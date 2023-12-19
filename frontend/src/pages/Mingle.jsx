/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Mingle/Dashboard";
import CallContainer from "../components/Mingle/Callcontainer";
import MessageContainer from "../components/Mingle/Messagecontainer";

const Mingle = ({ isLoggedIn, toast, user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is not logged in
    if (!isLoggedIn) {
      // Navigate to the login page
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    // Return null or an alternative component/message if not logged in
    return null;
  }

  return (
    <section className="hero__section pt-[60px] 2xl:h-[800px]">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-start justify-start">
          <div className="lg:w-[450px]">
            <Dashboard toast={toast} user={user} isLoggedIn={isLoggedIn} />
          </div>
          <div className="lg:w-[750px] ml-[-40px] mt-[-20px]">
            <CallContainer />
          </div>
          <div className="ml-[-25px]">
            <MessageContainer />
          </div>
          <div id="dialog"></div>
        </div>
      </div>
    </section>
  );
};

Mingle.propTypes = {
  user: PropTypes.object,
  isLoggedIn: PropTypes.bool.isRequired,
  toast: PropTypes.func.isRequired,
};

export default Mingle;
