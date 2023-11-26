/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import logo from "../assets/images/logo.png";
import copyButton from "../assets/images/copyButton.png";
import chatButton from "../assets/images/chatButton.png";
import videoButton from "../assets/images/videoButton.png";

const Mingle = () => {
  const [isStrangerAllowed, setIsStrangerAllowed] = useState(false);

  const handleCopyButtonClick = async () => {
    const personalCode = document.getElementById(
      "personal_code_paragraph"
    ).innerText;
    try {
      await navigator.clipboard.writeText(personalCode);
      // Optional: Show a notification or update the button to indicate success
    } catch (err) {
      // Handle the error (e.g., show an error message)
    }
  };

  const toggleStrangerCheckbox = () => {
    setIsStrangerAllowed(!isStrangerAllowed);
  };

  return (
    <>
      <div className="container mt-5">
        <div className="w-1/4 h-full flex flex-col justify-between relative custom-gradient">
          <div
            className="ml-10 flex justify-center items-center"
            style={{ width: "180px", height: "120px" }}
          >
            <img src={logo} alt="Logo" className="w-[150px] h-[150px]" />
          </div>

          <div>
            {/* Description Container */}
            <div className="mx-10 mb-10">
              <p className="font-medium text-base text-black">
                Talk with other user by passing his personal code or talk with
                strangers!
              </p>
            </div>

            {/* Personal Code Container */}
            <div
              className="flex flex-col justify-evenly mx-10 rounded-lg"
              style={{
                height: "110px",
                background: "rgba(196, 196, 196, 0.2)",
                backdropFilter: "blur(80px)",
              }}
            >
              <div className="px-0 sm:px-25">
                <p className="text-base font-medium">Your personal code</p>
              </div>
              <div className="flex justify-between items-center mx-4">
                <p
                  className="text-lg font-semibold"
                  id="personal_code_paragraph"
                >
                  ALWKfq1rkqTIJP5PAAAB
                </p>
                <button
                  className="w-[40px] h-[40px] rounded-md bg-white transition-transform duration-500"
                  id="personal_code_copy_button"
                  onClick={handleCopyButtonClick}
                >
                  <img src={copyButton} alt="Copy" />
                </button>
              </div>
            </div>
          </div>

          {/* Personal Code Connecting Container */}
          <div className="personal_code_connecting_container">
            <p className="personal_code_connecting_paragraph">Personal Code</p>
            <div className="personal_code_connecting_input_container">
              <input className="personal_code_input" id="personal_code_input" />
            </div>
            <div className="personal_code_connecting_buttons_container ">
              <button
                className="connecting_button mr-2"
                id="personal_code_chat_button"
              >
                <img
                  src={chatButton}
                  className="connecting_buttons_image"
                  alt="Chat"
                />
              </button>
              <button
                className="connecting_button"
                id="personal_code_video_button"
              >
                <img
                  src={videoButton}
                  className="connecting_buttons_image"
                  alt="Video Call"
                />
              </button>
            </div>
          </div>

          {/* Stranger Connecting Container */}
          <div className="stranger_connecting_container mb-4">
            <p className="stranger_title_container">Stranger</p>
            <div className="stranger_buttons_container flex">
              <button
                className="connecting_button mr-2"
                id="stranger_chat_button"
              >
                <img
                  src={chatButton}
                  className="connecting_buttons_image"
                  alt="Chat with Stranger"
                />
              </button>
              <button className="connecting_button" id="stranger_video_button">
                <img
                  src={videoButton}
                  className="connecting_buttons_image"
                  alt="Video Call with Stranger"
                />
              </button>
            </div>
          </div>

          {/* Checkbox Container */}
          <div className="checkbox_container" onClick={toggleStrangerCheckbox}>
            <input
              type="checkbox"
              checked={isStrangerAllowed}
              onChange={toggleStrangerCheckbox}
              id="allow_strangers_checkbox"
              className="checkbox_connection"
            />
            <label
              htmlFor="allow_strangers_checkbox"
              className="checkbox_container_paragraph"
            >
              Allow connection from strangers
            </label>
          </div>

          {/* Dashboard Blur */}
          <div className="dashboard_blur hidden" id="dashboard_blur"></div>
        </div>
      </div>
    </>
  );
};

export default Mingle;
