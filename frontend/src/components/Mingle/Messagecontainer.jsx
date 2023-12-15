/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import sendMessageButtonImage from "../../assets/images/sendMessageButton.png";
import * as store from "../../assets/js/store";
import * as constants from "../../assets/js/constants";

const MessageContainer = () => {
  const callType = store.getState().callType;
  const isNotVideoCall =
    callType !== constants.callType.VIDEO_PERSONAL_CODE &&
    callType !== constants.callType.VIDEO_STRANGER;

  return (
    <div className="messenger_container">
      <div className="messages_container" id="messages_container"></div>
      {isNotVideoCall && (
        <div className="new_message_container" id="new_message">
          <input
            className="new_message_input"
            id="new_message_input"
            type="text"
            placeholder="Type your message..."
          />
          <button className="send_message_button" id="send_message_button">
            <img
              className="send_message_button_image"
              src={sendMessageButtonImage}
              alt="Send"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
