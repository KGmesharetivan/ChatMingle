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

function Dashboard({ toast, user, isLoggedIn }) {
  const [showVideoButton, setShowVideoButton] = useState(false);
  const [isStrangerAllowed, setIsStrangerAllowed] = useState(true);
  const [personalCode, setPersonalCode] = useState("Your personal code here");
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Socket.IO client
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
    registerSocketEvents(newSocket);

    try {
      webRTCHandler.getLocalPreview();
      setShowVideoButton(true);
    } catch (err) {
      console.error("Error accessing the camera: ", err);
    }

    showVideoCallButtons();

    // Set loading to false once everything is initialized
    setIsLoading(false);

    return () => {
      newSocket.close();
    };
  }, [user, isLoggedIn]);

  // Toggle the checkbox state
  useEffect(() => {
    wss.changeStrangerConnectionStatus(isStrangerAllowed);
    console.log("Stranger checkbox status updated to", isStrangerAllowed);
  }, [isStrangerAllowed]);

  useEffect(() => {
    if (user && socket) {
      ui.updatePersonalCode(socket.id);
    }
  }, [user, socket]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleCopyButtonClick = () => {
    const personalCodeParagraph = document.getElementById(
      "personal_code_paragraph"
    );
    if (personalCodeParagraph) {
      const personalCode = personalCodeParagraph.innerText;
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
    } else {
      console.error("Element with ID 'personal_code_paragraph' not found");
    }
  };

  const handleChatButtonClick = () => {
    console.log("chat button clicked");
    const calleePersonalCode = document.getElementById(
      "personal_code_input"
    ).value;
    if (calleePersonalCode) {
      webRTCHandler.sendPreOffer(
        callType.CHAT_PERSONAL_CODE,
        calleePersonalCode
      );
    } else {
      console.error("Personal code is required for chat");
      toast.error("Personal code is required for chat");
    }
  };

  const handleVideoButtonClick = () => {
    console.log("video button clicked");
    const calleePersonalCode = document.getElementById(
      "personal_code_input"
    ).value;
    if (calleePersonalCode) {
      webRTCHandler.sendPreOffer(
        callType.VIDEO_PERSONAL_CODE,
        calleePersonalCode
      );
    } else {
      console.error("Personal code is required for video call");
      toast.error("Personal code is required for video call");
    }
  };

  const handleStrangerChatButtonClick = () => {
    strangerUtils.getStrangerSocketIdAndConnect(callType.CHAT_STRANGER, () => {
      // Callback function to be executed when successfully connected
      toast.success("Connected to a stranger for chat");
    });
  };

  const handleStrangerVideoButtonClick = () => {
    strangerUtils.getStrangerSocketIdAndConnect(callType.VIDEO_STRANGER, () => {
      // Callback function to be executed when successfully connected
      toast.success("Connected to a stranger for video call");
    });
  };

  return (
    <div className="container">
      <div className="dashboard_container">
        <div className="flex justify-center items-center logo_container">
          <img src={logoImage} alt="Logo" className="w-[150px] h-[150px]" />
        </div>
        <div className="flex justify-center items-center mb-5">
          {user && (
            <p className="font-medium text-3xl text-black">
              Welcome ! {user.fullname.split(" ")[0]}
            </p>
          )}
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
  user: PropTypes.object,
  toast: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default Dashboard;
