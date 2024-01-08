/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { registerSocketEvents } from "../../assets/js/wss";
import logoImage from "../../assets/images/logo.png";
import copyButtonImage from "../../assets/images/copyButton.png";
import chatButtonImage from "../../assets/images/chatButton.png";
import videoButtonImage from "../../assets/images/videoButton.png";
import { callType } from "../../assets/js/constants";
import * as strangerUtils from "../../assets/js/strangerUtils";
import * as webRTCHandler from "../../assets/js/webRTCHandler";
import { showVideoCallButtons } from "../../assets/js/ui";
import * as wss from "../../assets/js/wss";
import PropTypes from "prop-types";
import * as ui from "../../assets/js/ui";

function Dashboard({ toast }) {
  const [showVideoButton, setShowVideoButton] = useState(false);
  const [isStrangerAllowed, setIsStrangerAllowed] = useState(true);
  const [personalCode, setPersonalCode] = useState("Your personal code here");
  const [socket, setSocket] = useState(null);
  const [isChatActive, setIsChatActive] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isStrangerChatActive, setIsStrangerChatActive] = useState(false);
  const [isStrangerVideoActive, setIsStrangerVideoActive] = useState(false);

  useEffect(() => {
    // Initialize Socket.IO client
    const newSocket = io("http://localhost:3001"); // Replace with your server URL
    setSocket(newSocket);

    // Register socket events
    wss.registerSocketEvents(newSocket);

    try {
      webRTCHandler.getLocalPreview();
      setShowVideoButton(true);
    } catch (err) {
      console.error("Error accessing the camera: ", err);
    }

    showVideoCallButtons();

    return () => {
      // Disconnect socket on unmount
      newSocket.close();
    };
  }, []);

  // Toggle the checkbox state
  useEffect(() => {
    wss.changeStrangerConnectionStatus(isStrangerAllowed);
    console.log("Stranger checkbox status updated to", isStrangerAllowed);
  }, [isStrangerAllowed]);

  const handleVideoButtonClick = () => {
    if (isChatActive || isVideoActive) {
      console.log("Chat or video is already active");
      toast.error("You are already in a chat or video call");
      return;
    }

    console.log("Video button clicked");
    const calleePersonalCode = document.getElementById(
      "personal_code_input"
    ).value;

    if (calleePersonalCode) {
      setIsVideoActive(true); // Set video as active
      webRTCHandler.sendPreOffer(
        callType.VIDEO_PERSONAL_CODE,
        calleePersonalCode
      );
    } else {
      console.error("Personal code is required for video call");
      toast.error("Personal code is required for video call");
    }
  };

  const handleCopyButtonClick = () => {
    const personalCode = document.getElementById(
      "personal_code_paragraph"
    ).innerText;
    navigator.clipboard
      .writeText(personalCode)
      .then(() => {
        console.log("Personal code copied to clipboard");
        toast.success("Personal code copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy personal code. Please try again.");
      });
  };

  const handleChatButtonClick = () => {
    if (isChatActive || isVideoActive) {
      console.log("Chat or video is already active");
      toast.error("You are already in a chat or video call");
      return;
    }

    console.log("Chat button clicked");
    const calleePersonalCode = document.getElementById(
      "personal_code_input"
    ).value;

    if (calleePersonalCode) {
      setIsChatActive(true); // Set chat as active
      webRTCHandler.sendPreOffer(
        callType.CHAT_PERSONAL_CODE,
        calleePersonalCode
      );
    } else {
      console.error("Personal code is required for chat");
      toast.error("Personal code is required for chat");
    }
  };

  const handleStrangerChatButtonClick = () => {
    if (isStrangerChatActive || isStrangerVideoActive) {
      console.log("Stranger chat or video is already active");
      toast.error("You are already connected to a stranger");
      return;
    }

    console.log("stranger chat button clicked");
    ui.clearMessenger();
    strangerUtils.getStrangerSocketIdAndConnect(callType.CHAT_STRANGER, () => {
      setIsStrangerChatActive(true); // Set stranger chat as active
      // Callback function to be executed when successfully connected
      toast.success("Connected to a stranger for chat");
    });
  };

  const handleStrangerVideoButtonClick = () => {
    if (isStrangerChatActive || isStrangerVideoActive) {
      console.log("Stranger chat or video is already active");
      toast.error("You are already connected to a stranger");
      return;
    }

    console.log("stranger video button clicked");
    ui.clearMessenger();
    strangerUtils.getStrangerSocketIdAndConnect(callType.VIDEO_STRANGER, () => {
      setIsStrangerVideoActive(true); // Set stranger video as active
      // Callback function to be executed when successfully connected
      toast.success("Connected to a stranger for video call");
    });
  };

  return (
    <div data-aos="fade-right" data-aos-duration="1500" className="container">
      <div className="dashboard_container">
        <div className="flex justify-center items-center logo_container">
          <img src={logoImage} alt="Logo" className="w-[150px] h-[150px]" />
        </div>
        <div className="mx-10 mb-10 description_container">
          <p className="font-medium text-base text-black description_container_paragraph">
            Talk with other users by passing their personal code or talk with
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
              {personalCode}
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
              onClick={handleChatButtonClick}
            >
              <div className="flex justify-center items-center">
                {" "}
                <img
                  src={chatButtonImage}
                  className="connecting_buttons_image"
                  alt="Chat"
                />
              </div>
            </button>
            <button
              className={`connecting_button mr-2 ${
                showVideoButton ? "" : "hidden"
              }`}
              id="personal_code_video_button"
              onClick={handleVideoButtonClick}
            >
              <div className="flex justify-center items-center">
                <img
                  src={videoButtonImage}
                  className="connecting_buttons_image"
                  alt="Video Call"
                />
              </div>
            </button>
          </div>
        </div>
        <div className="stranger_connecting_container mb-8">
          <p className="stranger_title_container">Stranger</p>
          <div className="stranger_buttons_container flex">
            <button
              className="connecting_button mr-2"
              onClick={handleStrangerChatButtonClick}
            >
              <div className="flex justify-center items-center">
                <img
                  src={chatButtonImage}
                  className="connecting_buttons_image"
                  alt="Chat"
                />
              </div>
            </button>
            <button
              className={`connecting_button mr-2 ${
                showVideoButton ? "" : "hidden"
              }`}
              id="stranger_video_button"
              onClick={handleStrangerVideoButtonClick}
            >
              <div className="flex justify-center items-center">
                <img
                  src={videoButtonImage}
                  className="connecting_buttons_image"
                  alt="Video Call"
                />
              </div>
            </button>
          </div>
        </div>
        {/* <div className="checkbox_container">
          <input
            type="checkbox"
            checked={isStrangerAllowed}
            onChange={toggleStrangerCheckbox}
            id="allow_strangers_checkbox"
          />
          <label
            htmlFor="allow_strangers_checkbox"
            className="checkbox_container_paragraph"
          >
            Allow connection from strangers
          </label>
        </div> */}
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  toast: PropTypes.func.isRequired,
};

export default Dashboard;
