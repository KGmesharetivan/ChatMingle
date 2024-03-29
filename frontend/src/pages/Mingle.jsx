/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Mingle/Dashboard";
import CallContainer from "../components/Mingle/Callcontainer";
import MessageContainer from "../components/Mingle/Messagecontainer";
import Loader from "../components/Loader/Loader";

const Mingle = ({ isLoggedIn, toast, user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching or any asynchronous task
    const fetchData = async () => {
      // Your data fetching logic here

      // Simulating a delay of 2 seconds (replace this with your actual data fetching logic)
      setTimeout(() => {
        setLoading(false); // Set loading to false once the data is fetched
      }, 2000);
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once on mount

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
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col lg:flex-row items-start justify-start">
            <div className="lg:w-[450px] mingle-dashboard">
              <Dashboard toast={toast} user={user} isLoggedIn={isLoggedIn} />
            </div>
            <div className="lg:w-[750px] ml-[-20px] mt-[-20px] mingle-call">
              <CallContainer />
            </div>
            <div className="mingle-message">
              <MessageContainer />
            </div>
            <div id="dialog"></div>
          </div>
        )}
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
