/* eslint-disable no-unused-vars */
import React, { useState } from "react";
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
      <section className="hero__section pt-[60px] 2xl:h-[800px]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-[30px] items-start justify-start">
            {/* ==== Dashboard ===== */}
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
                    Talk with other user by passing his personal code or talk
                    with strangers!
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
                  <button
                    className="connecting_button"
                    id="stranger_video_button"
                  >
                    <img
                      src={videoButton}
                      className="connecting_buttons_image"
                      alt="Video Call with Stranger"
                    />
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
              <div className="dashboard_blur hidden" id="dashboard_blur"></div>
            </div>

            {/* ==== Call Container ===== */}
            <div className="call_container">
              <div className="videos_container">
                <div id="video_placeholder" className="videos_placeholder">
                  <img src={logo} alt="Logo" />
                </div>
                <video
                  className="remote_video "
                  autoPlay={true}
                  id="remote_video"
                ></video>
                <div className="local_video_container">
                  <video
                    className="local_video"
                    autoPlay={true}
                    id="local_video"
                  ></video>
                </div>
                <div className="call_buttons_container" id="call_buttons">
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
          </div>
        </div>
      </section>
    </>
  );
};

export default Mingle;
