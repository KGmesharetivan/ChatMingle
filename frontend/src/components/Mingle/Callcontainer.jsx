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

const CallContainer = () => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isVideoCallInitiated, setIsVideoCallInitiated] = useState(false);
  const [showFinishChatButton, setShowFinishChatButton] = useState(false);
  const [showRecordingButtons, setShowRecordingButtons] = useState(false);
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
      const callState = currentState.callState;
      const callType = store.getState().callType;

      // Determine if it's a personal or stranger call
      const isStranger =
        callType === constants.callType.CHAT_STRANGER ||
        callType === constants.callType.VIDEO_STRANGER;

      setIsVideoCallInitiated(
        callType === constants.callType.VIDEO_PERSONAL_CODE ||
          callType === constants.callType.VIDEO_STRANGER
      );

      const isCallActive = callState !== constants.callState.CALL_AVAILABLE;

      setIsVideoCallInitiated(isCallActive);
      setShowPlaceholder(!isCallActive);

      // Logic for showing finish chat button
      setShowFinishChatButton(
        (callType === constants.callType.CHAT_PERSONAL_CODE ||
          callType === constants.callType.CHAT_STRANGER) &&
          isCallActive
      );

      // Logic for showing recording buttons
      // Adjust this condition based on your application's requirements
      setShowRecordingButtons(
        isStranger && callState === constants.callState.SOME_STATE_FOR_RECORDING
      );

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
    setIsVideoCallInitiated(false);
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

  return (
    <div className="call_container">
      <div className="videos_container">
        {showPlaceholder && (
          <div className="videos_placeholder" id="video_placeholder">
            <div className="flex justify-between items-center">
              <img src={logoImage} alt="Logo" />
            </div>
          </div>
        )}
        <video
          className="remote_video"
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
        {isVideoCallInitiated && (
          <div className="call_buttons_container " id="call_buttons">
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
            >
              <div className="flex justify-center items-center">
                <img src={hangUpImage} alt="Hang Up" />
              </div>
            </button>
            <button className="call_button_small" ref={screenSharingButtonRef}>
              <div className="flex justify-center items-center">
                <img
                  src={switchCameraScreenSharingImage}
                  alt="Screen Sharing"
                />
              </div>
            </button>
            <button className="call_button_small" ref={startRecordingButtonRef}>
              <div className="flex justify-center items-center">
                <img src={recordingStartImage} alt="Start Recording" />
              </div>
            </button>
          </div>
        )}

        <div
          className={`finish_chat_button_container ${
            showFinishChatButton ? "" : "display_none"
          }`}
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
          className={`video_recording_buttons_container ${
            showRecordingButtons ? "" : "display_none"
          }`}
          id="video_recording_buttons"
        >
          <button id="pause_recording_button" ref={pauseRecordingButtonRef}>
            <img src={pauseImage} alt="Pause Recording" />
          </button>
          <button
            id="resume_recording_button"
            ref={resumeRecordingButtonRef}
            className="display_none"
          >
            <img src={resumeImage} alt="Resume Recording" />
          </button>
          <button id="stop_recording_button" ref={stopRecordingButtonRef}>
            Stop recording
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallContainer;
