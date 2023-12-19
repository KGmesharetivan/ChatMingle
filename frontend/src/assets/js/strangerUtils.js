import * as wss from "./wss.js";
import * as webRTCHandler from "./webRTCHandler.js";
import * as ui from "./ui.js";

let strangerCallType;

export const changeStrangerConnectionStatus = (status) => {
  const data = { status };
  wss.changeStrangerConnectionStatus(data);
};

export const getStrangerSocketIdAndConnect = (callType, callback) => {
  strangerCallType = callType;
  wss.getStrangerSocketId(callback);
};

export const connectWithStranger = (data) => {
  console.log("Data received:", data);
  console.log("Random Stranger Socket ID:", data.randomStrangerSocketId);
  console.log(data.randomStrangerSocketId);

  if (data.randomStrangerSocketId) {
    webRTCHandler.sendPreOffer(strangerCallType, data.randomStrangerSocketId);
  } else {
    // no user is available from connection
    ui.showNoStrangerAvailableDiolog();
  }
};
