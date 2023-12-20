/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import sendMessageButtonImage from "../../assets/images/sendMessageButton.png";
import * as store from "../../assets/js/store";
import * as constants from "../../assets/js/constants";
import * as webRTCHandler from "../../assets/js/webRTCHandler";
import * as ui from "../../assets/js/ui";

const MessageContainer = () => {
  const callType = store.getState().callType;

  useEffect(() => {
    // Code to run after component is mounted
    const messagesContainer = document.getElementById("messages_container");
    if (!messagesContainer) {
      console.error("Element with id 'messages_container' not found.");
    }
  }, []); // Empty dependency array ensures the effect runs once after mount

  const handleKeyDown = (event) => {
    const key = event.key;

    if (key === "Enter") {
      webRTCHandler.sendMessageUsingDataChannel(event.target.value);
      ui.appendMessage(event.target.value, true);
      event.target.value = "";
    }
  };

  const handleClick = () => {
    const message = document.getElementById("new_message_input").value;
    webRTCHandler.sendMessageUsingDataChannel(message);
    ui.appendMessage(message, true);
    document.getElementById("new_message_input").value = "";
  };

  return (
    <div className="messenger_container">
      <div className="messages_container" id="messages_container"></div>
      {callType !== constants.callType.VIDEO_PERSONAL_CODE &&
        callType !== constants.callType.VIDEO_STRANGER && (
          <div className="new_message_container" id="new_message">
            <input
              className="new_message_input"
              id="new_message_input"
              type="text"
              placeholder="Type your message..."
              onKeyDown={handleKeyDown}
            />
            <button
              className="send_message_button"
              id="send_message_button"
              onClick={handleClick}
            >
              <div className="flex justify-center items-center">
                {" "}
                <img
                  className="send_message_button_image"
                  src={sendMessageButtonImage}
                  alt="Send"
                />
              </div>
            </button>
          </div>
        )}
    </div>
  );
};

export default MessageContainer;
