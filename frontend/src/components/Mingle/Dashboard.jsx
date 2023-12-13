/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import logoImage from "../../assets/images/logo.png";
import copyButtonImage from "../../assets/images/copyButton.png";
import chatButtonImage from "../../assets/images/chatButton.png";
import videoButtonImage from "../../assets/images/videoButton.png";

function Dashboard() {
  const [showVideoButtons, setShowVideoButtons] = useState(false);
  const [isStrangerAllowed, setIsStrangerAllowed] = useState(false);

  const toggleStrangerCheckbox = () => {
    setIsStrangerAllowed(!isStrangerAllowed);
  };

  const handleCopyButtonClick = () => {
    const personalCode = document.getElementById(
      "personal_code_paragraph"
    ).innerText;
    navigator.clipboard
      .writeText(personalCode)
      .then(() => {
        console.log("Personal code copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="container">
      <div className="dashboard_container">
        <div className="flex justify-center items-center logo_container">
          <img src={logoImage} alt="Logo" className="w-[150px] h-[150px]" />
        </div>
        <div className="mx-10 mb-10 description_container">
          <p className="font-medium text-base text-black description_container_paragraph">
            Talk with other user by passing his personal code or talk with
            strangers!
          </p>
        </div>
        <div className="flex flex-col justify-evenly mx-10 rounded-lg personal_code_container">
          <div className="px-0 sm:px-25 personal_code_title_container">
            <p className="text-base font-medium personal_code_title_paragraph">
              Your personal code
            </p>
          </div>
          <div className="flex justify-between items-center mx-4 personal_code_value_container">
            <p
              className="font-semibold personal_code_value_paragraph"
              id="personal_code_paragraph"
            >
              DDDDDD
            </p>
            <button
              className="w-[40px] h-[40px] rounded-md bg-white personal_code_copy_button"
              id="personal_code_copy_button"
              onClick={handleCopyButtonClick}
            >
              <img src={copyButtonImage} alt="Copy" />
            </button>
          </div>
        </div>
        <div className="personal_code_connecting_container">
          <p className="personal_code_connecting_paragraph">Personal Code</p>
          <div className="personal_code_connecting_input_container">
            <input className="personal_code_input" id="personal_code_input" />
          </div>
          <div className="personal_code_connecting_buttons_container">
            <button
              className="connecting_button mr-2"
              id="personal_code_chat_button"
            >
              <img
                src={chatButtonImage}
                className="connecting_buttons_image"
                alt="Chat"
              />
            </button>
            <button
              className={`connecting_button mr-2 ${
                showVideoButtons ? "" : "hidden"
              }`}
              id="personal_code_video_button"
            >
              <img
                src={videoButtonImage}
                className="connecting_buttons_image"
                alt="Video Call"
              />
            </button>
          </div>
        </div>
        <div className="stranger_connecting_container mb-8">
          <p className="stranger_title_container">Stranger</p>
          <div className="stranger_buttons_container flex">
            <button
              className="connecting_button mr-2"
              id="stranger_chat_button"
            >
              <img
                src={chatButtonImage}
                className="connecting_buttons_image"
                alt="Chat"
              />
            </button>
            <button
              className={`connecting_button mr-2 ${
                showVideoButtons ? "" : "hidden"
              }`}
              id="stranger_video_button"
            >
              <img
                src={videoButtonImage}
                className="connecting_buttons_image"
                alt="Video Call"
              />
            </button>
          </div>
        </div>
        <div className="checkbox_container">
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
      </div>
    </div>
  );
}

export default Dashboard;
