// socket.js or socket.ts

import { io } from "socket.io-client";

const socket = io("https://wwybwsw3tw.ap-southeast-1.awsapprunner.com/");

// Export the socket instance for use in your components.
export default socket;
