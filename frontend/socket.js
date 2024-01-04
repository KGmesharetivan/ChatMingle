// socket.js or socket.ts

import { io } from "socket.io-client";

const socket = io("http://localhost:3001/");

// Export the socket instance for use in your components.
export default socket;
