/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import sendMessageButtonImage from "../../assets/images/sendMessageButton.png";

const MessageContainer = () => {
  const [showNewMessage, setShowNewMessage] = useState(false);

  return (
    <div className="messenger_container">
      <div className="messages_container" id="messages_container"></div>
      <div
        className={`new_message_container ${
          showNewMessage ? "" : "display_none"
        }`}
        id="new_message"
      >
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
    </div>
  );
};

export default MessageContainer;
