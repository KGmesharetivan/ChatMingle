/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from "react";
import landing from "../assets/images/landing.png";
import { Link, NavLink } from "react-router-dom";

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
              <p className="text__para ">
                At Chatmingle.net, we believe in the power of communication to
                bring people together from all corners of the world. Whether
                you're looking to make new friends, find a study buddy, or
                explore new cultures, our platform is designed to make your
                experience seamless and enjoyable.
              </p>
              <div className="flex justify-center items-center mt-4">
                <Link to="/login">
                  <button className="customButton">
                    <div>GET STARTED</div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25px"
                      height="25px"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M11.6801 14.62L14.2401 12.06L11.6801 9.5"
                        stroke="black"
                        strokeWidth={2}
                        strokeMiterlimit={10}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M4 12.0601H14.17"
                        stroke="black"
                        strokeWidth={2}
                        strokeMiterlimit={10}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M12 4C16.42 4 20 7 20 12C20 17 16.42 20 12 20"
                        stroke="black"
                        strokeWidth={2}
                        strokeMiterlimit={10}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </button>
                </Link>
              </div>
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
