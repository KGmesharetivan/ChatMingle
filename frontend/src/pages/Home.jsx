/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from "react";
import landing from "../assets/images/landing.png";

const Home = () => {
  return (
    <>
      {/* ==== hero section ===== */}
      <section className="hero__section pt-[60px] 2xl:h-[800px]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-[30px] items-center justify-between">
            {/* ==== hero content ===== */}
            <div className="lg:w-[570px]">
              <h1 className="text-[36px] leading-[46px] text-headingColor font-[800] md:text-[60px] md:leading-[70px]">
                Welcome to Chatmingle.net
              </h1>
              <p className="text__para">
                At Chatmingle.net, we believe in the power of communication to
                bring people together from all corners of the world. Whether
                you're looking to make new friends, find a study buddy, or
                explore new cultures, our platform is designed to make your
                experience seamless and enjoyable.
              </p>
            </div>
            {/* Image */}
            <img
              src={landing}
              alt="Landing"
              className="w-full h-auto lg:max-w-[800px] object-cover lg:object-contain"
            />
          </div>
        </div>
      </section>

      {/* ==== hero section End ===== */}
    </>
  );
};

export default Home;
