/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import logo from "../assets/images/logo.png";
import copyButton from "../assets/images/copyButton.png";
import chatButton from "../assets/images/chatButton.png";
import videoButton from "../assets/images/videoButton.png";
import mic from "../assets/images/mic.png";
import camera from "../assets/images/camera.png";
import hangUp from "../assets/images/hangUp.png";
import switchCam from "../assets/images/switchCameraScreenSharing.png";
import pause from "../assets/images/pause.png";
import recordingStart from "../assets/images/recordingStart.png";
import resume from "../assets/images/resume.png";
import sendMessageButton from "../assets/images/sendMessageButton.png";
import io from "socket.io-client";
import { registerSocketEvents } from "../assets/js/wss";
import * as ui from "../assets/js/ui";
import * as store from "../assets/js/store";
import * as constants from "../assets/js/constants";
import * as webRTCHandler from "../assets/js/webRTCHandler";
import * as strangerUtils from "../assets/js/strangerUtils";

const Mingle = () => {
  const [isStrangerAllowed, setIsStrangerAllowed] = useState(false);
  const [personalCode, setPersonalCode] = useState("");
  const [localStream, setLocalStream] = useState(null);
  const [showVideoButtons, setShowVideoButtons] = useState(false);
  const [isDashboardBlurred, setIsDashboardBlurred] = useState(false);
  const [showCallButtons, setShowCallButtons] = useState(false);
  const [showRemoteVideo, setShowRemoteVideo] = useState(false);
  const [showNewMessageInput, setShowNewMessageInput] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [callType, setCallType] = useState(null);

  const handleCopyButtonClick = async () => {
    try {
      const personalCode = store.getState().socketId; // Or use relevant state if you have
      await navigator.clipboard.writeText(personalCode);
      // Optional: Show a notification or update the button to indicate success
    } catch (err) {
      console.log("Error copying text: ", err);
      // Handle the error (e.g., show an error message)
    }
  };

  const toggleStrangerCheckbox = () => {
    const newCheckboxState = !isStrangerAllowed;
    setIsStrangerAllowed(newCheckboxState);

    // Update UI and store states
    ui.updateStrangerCheckbox(newCheckboxState);
    store.setAllowConnectionsFromStrangers(newCheckboxState);

    // Invoke the strangerUtils function
    strangerUtils.changeStrangerConnectionStatus(newCheckboxState);
  };

  const updatePersonalCode = (newCode) => {
    setPersonalCode(newCode);
  };

  useEffect(() => {
    const socket = io("http://localhost:3001");
    registerSocketEvents(socket);

    // Clean up on unmount
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const getLocalPreview = () => {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          setLocalStream(stream);
          ui.updateLocalVideo(stream);
          showVideoCallButtons();
          store.setCallState(constants.callState.CALL_AVAILABLE);
          store.setLocalStream(stream);
        })
        .catch((err) => {
          console.log(
            "error occurred when trying to get access to camera",
            err
          );
        });
    };

    getLocalPreview();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const showVideoCallButtons = () => {
    // Update state to show video call buttons
    setShowVideoButtons(true);
  };

  const handlePersonalCodeChatClick = () => {
    console.log("chat button clicked");
    const calleePersonalCode = document.getElementById(
      "personal_code_input"
    ).value;
    const callType = constants.callType.CHAT_PERSONAL_CODE;

    webRTCHandler.sendPreOffer(callType, calleePersonalCode);
    setCallType(constants.callType.CHAT_PERSONAL_CODE);
  };

  const handlePersonalCodeVideoClick = () => {
    console.log("video button clicked");
    const calleePersonalCode = document.getElementById(
      "personal_code_input"
    ).value;
    const callType = constants.callType.VIDEO_PERSONAL_CODE;
    webRTCHandler.sendPreOffer(callType, calleePersonalCode);
    setCallType(constants.callType.VIDEO_PERSONAL_CODE);
  };

  const handleStrangerChatClick = () => {
    // logic
    strangerUtils.getStrangerSocketIdAndConnect(
      constants.callType.CHAT_STRANGER
    );
  };

  const handleStrangerVideoClick = () => {
    // logic
    strangerUtils.getStrangerSocketIdAndConnect(
      constants.callType.VIDEO_STRANGER
    );
  };

  const enableDashboard = () => {
    setIsDashboardBlurred(false);
  };

  const disableDashboard = () => {
    setIsDashboardBlurred(true);
  };

  const showVideoCallElements = () => {
    setShowCallButtons(true);
    setShowPlaceholder(false);
    setShowRemoteVideo(true);
    setShowNewMessageInput(true);
    disableDashboard();
  };

  const updateUIAfterHangUp = (callType) => {
    enableDashboard();
    setShowCallButtons(false);
    setShowNewMessageInput(false);
    setShowRemoteVideo(false);
    setShowPlaceholder(true);
  };

  const handleCallConnected = () => {
    showVideoCallElements();
    ui.updateUIAfterCallConnected(callType);
    setShowPlaceholder(false);
    setShowRemoteVideo(true);
    setShowCallButtons(true);
  };

  const handleEndCall = () => {
    webRTCHandler.handleHangUp(); // This should internally call ui.updateUIAfterHangUp
    setShowPlaceholder(true);
    setShowRemoteVideo(false);
    setShowCallButtons(false);

    // Resetting other UI state to default
    setIsDashboardBlurred(false);
    setShowVideoButtons(false);
    setShowNewMessageInput(false);
    setShowPlaceholder(true);
    setCallType(null);
  };

  return (
    <>
      <section className="pt-[60px] 2xl:h-[800px]">
        <div className="container">
          <div className="flex flex-col lg:flex-row  items-start justify-start">
            {/* ==== Dashboard ===== */}
            <div className="mingle_section w-1/4 h-full flex flex-col justify-between relative custom-gradient dashboard_container">
              <div
                className="ml-10 flex justify-center items-center logo_container"
                style={{ width: "180px", height: "120px" }}
              >
                <img src={logo} alt="Logo" className="w-[150px] h-[150px] " />
              </div>

              {/* Description Container */}
              <div>
                <div className="mx-10 mb-10 description_container">
                  <p className="font-medium text-base text-black description_container_paragraph">
                    Talk with other user by passing his personal code or talk
                    with strangers!
                  </p>
                </div>

                {/* Personal Code Container */}
                <div
                  className="flex flex-col justify-evenly mx-10 rounded-lg personal_code_container"
                  style={{
                    height: "110px",
                    background: "rgba(196, 196, 196, 0.2)",
                    backdropFilter: "blur(80px)",
                  }}
                >
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
                      className="w-[40px] h-[40px] rounded-md bg-white transition-transform duration-500 personal_code_copy_button"
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
                <p className="personal_code_connecting_paragraph">
                  Personal Code
                </p>
                <div className="personal_code_connecting_input_container">
                  <input
                    className="personal_code_input"
                    id="personal_code_input"
                  />
                </div>
                <div className="personal_code_connecting_buttons_container ">
                  <button
                    className="connecting_button mr-2"
                    id="personal_code_chat_button"
                    onClick={handlePersonalCodeChatClick}
                  >
                    <div className="flex justify-center items-center">
                      <img
                        src={chatButton}
                        className="connecting_buttons_image"
                        alt="Chat"
                      />
                    </div>
                  </button>

                  <button
                    className={`connecting_button mr-2 ${
                      showVideoButtons ? "" : "hidden"
                    }`}
                    id="personal_code_video_button"
                    onClick={handlePersonalCodeVideoClick}
                  >
                    <div className="flex justify-center items-center">
                      <img
                        src={videoButton}
                        className="connecting_buttons_image"
                        alt="Video Call"
                      />
                    </div>
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
                    onClick={handleStrangerChatClick}
                  >
                    <div className="flex justify-center items-center">
                      {" "}
                      <img
                        src={chatButton}
                        className="connecting_buttons_image"
                        alt="Chat"
                      />
                    </div>
                  </button>

                  <button
                    className={`connecting_button mr-2 ${
                      showVideoButtons ? "" : "hidden"
                    }`}
                    id="stranger_video_button"
                    onClick={handleStrangerVideoClick}
                  >
                    <div className="flex justify-center items-center">
                      {" "}
                      <img
                        src={videoButton}
                        className="connecting_buttons_image"
                        alt="Video Call"
                      />
                    </div>
                  </button>
                </div>
              </div>

              {/* Checkbox Container */}
              <div
                className="checkbox_container"
                onClick={toggleStrangerCheckbox}
              >
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
              <div
                className={`dashboard_blur ${
                  isDashboardBlurred ? "" : "hidden"
                }`}
                id="dashboard_blur"
              ></div>
            </div>

            {/* ==== Call Container ===== */}
            <div className="call_container">
              <div className="videos_container">
                <div
                  id="video_placeholder"
                  className="videos_placeholder"
                  style={{ display: showPlaceholder ? "block" : "none" }}
                >
                  <img src={logo} alt="Logo" />
                </div>
                <video
                  className="remote_video"
                  autoPlay={true}
                  id="remote_video"
                  style={{ display: showRemoteVideo ? "block" : "none" }}
                ></video>
                <div className="local_video_container">
                  <video
                    className="local_video"
                    autoPlay={true}
                    id="local_video"
                  ></video>
                </div>
                <div
                  className="call_buttons_container"
                  id="call_buttons"
                  style={{ display: showCallButtons ? "block" : "none" }}
                >
                  <button className="call_button_small" id="mic_button">
                    <div className="flex justify-center items-center">
                      <img src={mic} id="mic_button_image" alt="Mic" />
                    </div>
                  </button>
                  <button className="call_button_small" id="camera_button">
                    <div className="flex justify-center items-center">
                      <img src={camera} id="camera_button_image" alt="Camera" />
                    </div>
                  </button>
                  <button className="call_button_large" id="hang_up_button">
                    <div className="flex justify-center items-center">
                      {" "}
                      <img src={hangUp} alt="Hang Up" />
                    </div>
                  </button>
                  <button
                    className="call_button_small"
                    id="screen_sharing_button"
                  >
                    <div className="flex justify-center items-center">
                      {" "}
                      <img src={switchCam} alt="Screen Sharing" />
                    </div>
                  </button>
                  <button
                    className="call_button_small"
                    id="start_recording_button"
                  >
                    <div className="flex justify-center items-center">
                      {" "}
                      <img src={recordingStart} alt="Start Recording" />
                    </div>
                  </button>
                </div>

                <div
                  className="finish_chat_button_container hidden"
                  id="finish_chat_button_container"
                >
                  <button
                    className="call_button_large"
                    id="finish_chat_call_button"
                    onClick={handleEndCall}
                  >
                    <img src={hangUp} alt="Hang Up" />
                  </button>
                </div>
                <div
                  className="video_recording_buttons_container hidden"
                  id="video_recording_buttons"
                >
                  <button id="pause_recording_button">
                    <img src={pause} alt="Pause Recording" />
                  </button>
                  <button id="resume_recording_button" className="hidden">
                    <img src={resume} alt="Resume Recording" />
                  </button>
                  <button id="stop_recording_button">Stop recording</button>
                </div>
              </div>
            </div>

            {/* ==== Message Container ===== */}
            <div className="messenger_container">
              <div className="messages_container" id="messages_container"></div>
              <div
                className="new_message_container"
                id="new_message"
                style={{ display: showNewMessageInput ? "block" : "none" }}
              >
                <input
                  className="new_message_input"
                  id="new_message_input"
                  type="text"
                  placeholder="Type your message..."
                />
                <button
                  className="send_message_button"
                  id="send_message_button"
                >
                  <div className="flex justify-center items-center">
                    <img
                      className="send_message_button_image"
                      src={sendMessageButton}
                    />
                  </div>
                </button>
              </div>
            </div>
            <div id="dialog"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Mingle;
