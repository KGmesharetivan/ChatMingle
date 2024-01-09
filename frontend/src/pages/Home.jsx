/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import landing from "../assets/images/landing.png";
import { Link } from "react-router-dom";
import Loader from "../components/Loader/Loader";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Simulating a delay of 2 seconds (replace this with your actual data fetching logic)
      setTimeout(() => {
        setLoading(false); // Set loading to false once the data is fetched
      }, 2000);
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    // ==== hero section start =====
    <section className="hero__section pt-[60px] 2xl:h-[800px]">
      <div className="container">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-[30px] items-center justify-between">
              {/* ==== hero content ===== */}
              <div className="lg:w-[570px] welcome-css">
                <h1
                  data-aos="fade-right"
                  data-aos-duration="1500"
                  className="text-[36px] leading-[46px] text-headingColor font-[800] md:text-[60px] md:leading-[70px]"
                >
                  Welcome to Chatmingle.net
                </h1>
                <p
                  data-aos="fade-right"
                  data-aos-duration="1500"
                  className="text__para "
                >
                  At Chatmingle.net, we believe in the power of communication to
                  bring people together from all corners of the world. Whether
                  you're looking to make new friends, find a study buddy, or
                  explore new cultures, our platform is designed to make your
                  experience seamless and enjoyable.
                </p>
                {/* Additional Information */}
                <p
                  data-aos="fade-right"
                  data-aos-duration="1500"
                  className="text__para mt-4"
                >
                  Join us today and experience a vibrant community where you can
                  engage in meaningful conversations, share your interests, and
                  discover like-minded individuals. Our user-friendly interface
                  and advanced features ensure a delightful journey in
                  connecting with people around the globe.
                </p>

                {/* Key Features */}
                <div
                  data-aos="fade-right"
                  data-aos-duration="1800"
                  className="mt-6"
                >
                  <h2 className="text-[24px] font-[600] mb-2">Key Features:</h2>
                  <ul className="text__para list-disc ml-6">
                    <li>Instant Messaging for Quick Connections</li>
                    <li>Advanced Search to Find Your Perfect Match</li>
                    <li>Secure and Private Communication</li>
                    <li>Interest-Based Chat Rooms</li>
                    <li>Seamless Cross-Platform Experience</li>
                  </ul>
                </div>
                <div className="flex justify-center items-center mt-4">
                  <Link to="/login">
                    <div className="flex justify-center items-center">
                      <button className="animated-button">
                        <svg
                          viewBox="0 0 24 24"
                          className="arr-2"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                        </svg>
                        <span className="text">Get Started</span>
                        <span className="circle"></span>
                        <svg
                          viewBox="0 0 24 24"
                          className="arr-1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                        </svg>
                      </button>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Image */}
              <img
                data-aos="fade-left"
                data-aos-duration="1500"
                src={landing}
                alt="Landing"
                className="w-full h-auto lg:max-w-[800px] object-cover lg:object-contain welcome-img"
              />
            </div>
          </>
        )}
      </div>
    </section>
    // ==== hero section End =====
  );
};

export default Home;
