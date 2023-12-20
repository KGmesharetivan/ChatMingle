/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import logoImage from "../../assets/images/logo.png";
import micImage from "../../assets/images/mic.png";
import micOffImage from "../../assets/images/micOff.png";
import cameraImage from "../../assets/images/camera.png";
import cameraOffImage from "../../assets/images/cameraOff.png";
import hangUpImage from "../../assets/images/hangUp.png";
import switchCameraScreenSharingImage from "../../assets/images/switchCameraScreenSharing.png";
import recordingStartImage from "../../assets/images/recordingStart.png";
import pauseImage from "../../assets/images/pause.png";
import resumeImage from "../../assets/images/resume.png";
import { showCallElements, updateUIAfterHangUp } from "../../assets/js/ui";
import * as webRTCHandler from "../../assets/js/webRTCHandler";
import * as ui from "../../assets/js/ui";
import {
  callType,
  preOfferAnswer,
  webRTCSignaling,
  callState,
} from "../../assets/js/constants";
import * as constants from "../../assets/js/constants";
import * as store from "../../assets/js/store";
import * as recordingUtils from "../../assets/js/recordingUtils";
import staticImage from "../../assets/images/static-image.png";

const CallContainer = () => {
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  // Use React Refs to access DOM elements
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const micButtonRef = useRef(null);
  const cameraButtonRef = useRef(null);
  const hangUpButtonRef = useRef(null);
  const screenSharingButtonRef = useRef(null);
  const startRecordingButtonRef = useRef(null);
  const finishChatCallButtonRef = useRef(null);
  const pauseRecordingButtonRef = useRef(null);
  const resumeRecordingButtonRef = useRef(null);
  const stopRecordingButtonRef = useRef(null);

  useEffect(() => {
    const checkCallState = () => {
      const currentState = store.getState();
      const callType = currentState.callType;
      const isStranger =
        callType === constants.callType.CHAT_STRANGER ||
        callType === constants.callType.VIDEO_STRANGER;

      // Call showCallElements with isStranger parameter
      showCallElements(callType, isStranger);
    };

    checkCallState();
    const intervalId = setInterval(checkCallState, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleEndCall = () => {
    webRTCHandler.handleHangUp();
    updateUIAfterHangUp();
    ui.updateUIAfterHangUp(callType);
    setMicEnabled(true);
    setCameraEnabled(true);
  };

  // Toggle microphone state
  const toggleMic = () => {
    const localStream = store.getState().localStream;
    if (localStream && localStream.getAudioTracks().length > 0) {
      const newMicState = !localStream.getAudioTracks()[0].enabled;
      localStream.getAudioTracks()[0].enabled = newMicState;
      setMicEnabled(newMicState);
    }
  };

  // Toggle camera state
  const toggleCamera = () => {
    const localStream = store.getState().localStream;
    if (localStream && localStream.getVideoTracks().length > 0) {
      const newCameraState = !localStream.getVideoTracks()[0].enabled;
      localStream.getVideoTracks()[0].enabled = newCameraState;
      setCameraEnabled(newCameraState);
    }
  };

  // Toggle screen sharing
  const toggleScreenSharing = () => {
    const screenSharingActive = store.getState().screenSharingActive;
    webRTCHandler.switchBetweenCameraAndScreenSharing(screenSharingActive);
  };

  // Function to start recording
  const startRecording = () => {
    recordingUtils.startRecording();
    ui.showRecordingPanel();
  };

  // Function to stop recording
  const stopRecording = () => {
    recordingUtils.stopRecording();
    ui.resetRecordingButtons();
  };

  // Function to pause recording
  const pauseRecording = () => {
    recordingUtils.pauseRecording();
    ui.switchRecordingButton(true);
  };

  // Function to resume recording
  const resumeRecording = () => {
    recordingUtils.resumeRecording();
    ui.switchRecordingButton();
  };

  return (
    <div className="call_container">
      <div className="videos_container">
        <div className="videos_placeholder" id="video_placeholder">
          <div className="flex justify-between items-center mt-[-10px]">
            <img
              src={staticImage}
              alt="Logo"
              className="static_image_animation"
            />
          </div>
        </div>
        <video
          className="remote_video display_none"
          autoPlay={true}
          id="remote_video"
          ref={remoteVideoRef}
        ></video>
        <div className="local_video_container">
          <video
            className="local_video"
            autoPlay={true}
            id="local_video"
            ref={localVideoRef}
          ></video>
        </div>
        <div className="call_buttons_container display_none" id="call_buttons">
          <button
            className="call_button_small"
            ref={micButtonRef}
            id="mic_button"
            onClick={toggleMic}
          >
            <div className="flex justify-center items-center">
              <img src={micEnabled ? micImage : micOffImage} alt="Mic" />
            </div>
          </button>
          <button
            className="call_button_small"
            ref={cameraButtonRef}
            onClick={toggleCamera}
            id="camera_button"
          >
            <div className="flex justify-center items-center">
              <img
                src={cameraEnabled ? cameraImage : cameraOffImage}
                alt="Camera"
              />
            </div>
          </button>
          <button
            className="call_button_large"
            ref={hangUpButtonRef}
            onClick={handleEndCall}
            id="hang_up_button"
          >
            <div className="flex justify-center items-center">
              <img src={hangUpImage} alt="Hang Up" />
            </div>
          </button>
          <button
            className="call_button_small"
            ref={screenSharingButtonRef}
            id="screen_sharing_button"
            onClick={toggleScreenSharing}
          >
            <div className="flex justify-center items-center">
              <img src={switchCameraScreenSharingImage} alt="Screen Sharing" />
            </div>
          </button>
          <button
            className="call_button_small"
            ref={startRecordingButtonRef}
            id="start_recording_button"
            onClick={startRecording}
          >
            <div className="flex justify-center items-center">
              <img src={recordingStartImage} alt="Start Recording" />
            </div>
          </button>
        </div>
        <div
          className="finish_chat_button_container display_none"
          id="finish_chat_button_container"
          ref={finishChatCallButtonRef}
        >
          <button
            className="call_button_large"
            id="finish_chat_call_button"
            onClick={handleEndCall}
          >
            <div className="flex justify-center items-center">
              <img src={hangUpImage} alt="Hang Up" />
            </div>
          </button>
        </div>
        <div
          className="video_recording_buttons_container display_none"
          id="video_recording_buttons"
        >
          <button
            id="pause_recording_button"
            ref={pauseRecordingButtonRef}
            className="call_button_small"
            onClick={pauseRecording}
          >
            <div className="flex justify-center items-center">
              {" "}
              <img src={pauseImage} alt="Pause Recording" />
            </div>
          </button>
          <button
            id="resume_recording_button"
            ref={resumeRecordingButtonRef}
            className="display_none call_button_small"
            onClick={resumeRecording}
          >
            <div className="flex justify-center items-center">
              {" "}
              <img src={resumeImage} alt="Resume Recording" />
            </div>
          </button>
          <button
            id="stop_recording_button"
            ref={stopRecordingButtonRef}
            className="stop_recording"
            onClick={stopRecording}
          >
            <span className="text">Stop recording</span>
            <span className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallContainer;
