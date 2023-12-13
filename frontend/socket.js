// socket.js or socket.ts

import { io } from "socket.io-client";

// Replace 'http://localhost:3000' with the URL of your Socket.io server.
const socket = io("http://localhost:3000");

// Export the socket instance for use in your components.
export default socket;
