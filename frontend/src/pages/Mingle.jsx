/* eslint-disable no-unused-vars */
import React from "react";
import Dashboard from "../components/Mingle/Dashboard";
import CallContainer from "../components/Mingle/Callcontainer";
import MessageContainer from "../components/Mingle/Messagecontainer";

const Mingle = () => {
  return (
    <section className="hero__section pt-[60px] 2xl:h-[800px]">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-start justify-start">
          <div className="lg:w-[450px]">
            <Dashboard />
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

export default Mingle;
