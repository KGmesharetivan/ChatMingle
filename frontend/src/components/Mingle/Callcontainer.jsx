/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import logoImage from "../../assets/images/logo.png";
import micImage from "../../assets/images/mic.png";
import cameraImage from "../../assets/images/camera.png";
import hangUpImage from "../../assets/images/hangUp.png";
import switchCameraScreenSharingImage from "../../assets/images/switchCameraScreenSharing.png";
import recordingStartImage from "../../assets/images/recordingStart.png";
import pauseImage from "../../assets/images/pause.png";
import resumeImage from "../../assets/images/resume.png";

const CallContainer = () => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [showRemoteVideo, setShowRemoteVideo] = useState(true);
  const [showCallButtons, setShowCallButtons] = useState(true);
  const [showVideoButtons, setShowVideoButtons] = useState(true);

  const handleEndCall = () => {
    // Logic for ending the call
    console.log("Call ended"); // Replace with your actual logic
  };

  return (
    <div>
      <div className="videos_container">
        <div
          id="video_placeholder"
          className="videos_placeholder"
          style={{ display: showPlaceholder ? "block" : "none" }}
        >
          <div className="flex justify-center items-center">
            {" "}
            <img src={logoImage} alt="Logo" />
          </div>
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
          <div className="flex justify-between items-center">
            {" "}
            {showVideoButtons && (
              <>
                <button className="call_button_small" id="mic_button">
                  <div className="flex justify-center items-center">
                    <img src={micImage} alt="Mic" />
                  </div>
                </button>
                <button className="call_button_small" id="camera_button">
                  <div className="flex justify-center items-center">
                    <img
                      src={cameraImage}
                      id="camera_button_image"
                      alt="Camera"
                    />
                  </div>
                </button>
              </>
            )}
            <button className="call_button_large" id="hang_up_button">
              <div className="flex justify-center items-center">
                <img src={hangUpImage} alt="Hang Up" />
              </div>
            </button>
            {showVideoButtons && (
              <>
                <button
                  className="call_button_small"
                  id="screen_sharing_button"
                >
                  <div className="flex justify-center items-center">
                    <img
                      src={switchCameraScreenSharingImage}
                      alt="Screen Sharing"
                    />
                  </div>
                </button>
                <button
                  className="call_button_small"
                  id="start_recording_button"
                >
                  <div className="flex justify-center items-center">
                    <img src={recordingStartImage} alt="Start Recording" />
                  </div>
                </button>
              </>
            )}
          </div>
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
            <img src={hangUpImage} alt="Hang Up" />
          </button>
        </div>
        <div
          className="video_recording_buttons_container hidden"
          id="video_recording_buttons"
        >
          <button id="pause_recording_button">
            <img src={pauseImage} alt="Pause Recording" />
          </button>
          <button id="resume_recording_button" className="hidden">
            <img src={resumeImage} alt="Resume Recording" />
          </button>
          <button id="stop_recording_button">Stop recording</button>
        </div>
      </div>
    </div>
  );
};

export default CallContainer;
