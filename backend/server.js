import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import path from "path";
import session from "express-session";
import cors from "cors";
import passport from "./functions/auth/passportConfig.js";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import indexRouter from "./functions/routes/index.js";
import authRouter from "./functions/routes/auth.js";

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);

// Socket.IO configuration
import { Server as SocketIOServer } from "socket.io";
const io = new SocketIOServer(server, {
  cors: {
    origin: "https://wd92pt-mp2-chatmingle.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
});

// Use cors middleware
app.use(
  cors({
    origin: "https://wd92pt-mp2-chatmingle.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// MongoDB connection
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error(err));

// Session store configuration
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  dbName: "ChatMingle",
  collection: "sessions",
  mongooseConnection: mongoose.connection,
  stringify: false,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 7 * 1000 * 60 * 60 * 24,
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Custom middleware for handling OPTIONS request
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Headers", "Authorization");
    return res.status(200).json({});
  }
  next();
});

// Define your routes here
app.use("/", indexRouter);
app.use("/auth", authRouter);

// Middleware for serving your React application
app.use(express.static(path.join(__dirname, "frontend/build")));
app.use("/functions/uploads", express.static("functions/uploads"));

let connectedPeers = [];
let connectedPeersStrangers = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  connectedPeers.push(socket.id);

  socket.on("pre-offer", (data) => {
    console.log("pre-offer-came");
    const { calleePersonalCode, callType } = data;
    console.log(calleePersonalCode);
    console.log(connectedPeers);
    const connectedPeer = connectedPeers.find(
      (peerSocketId) => peerSocketId === calleePersonalCode
    );

    console.log(connectedPeer);

    if (connectedPeer) {
      const responseData = {
        callerSocketId: socket.id,
        callType,
      };
      io.to(calleePersonalCode).emit("pre-offer", responseData);
    } else {
      const responseData = {
        preOfferAnswer: "CALLEE_NOT_FOUND",
      };
      io.to(socket.id).emit("pre-offer-answer", responseData);
    }
  });

  socket.on("pre-offer-answer", (data) => {
    const { callerSocketId } = data;

    const connectedPeer = connectedPeers.find(
      (peerSocketId) => peerSocketId === callerSocketId
    );

    if (connectedPeer) {
      io.to(data.callerSocketId).emit("pre-offer-answer", data);
    }
  });

  socket.on("webRTC-signaling", (data) => {
    const { connectedUserSocketId } = data;

    const connectedPeer = connectedPeers.find(
      (peerSocketId) => peerSocketId === connectedUserSocketId
    );

    if (connectedPeer) {
      io.to(connectedUserSocketId).emit("webRTC-signaling", data);
    }
  });

  socket.on("user-hanged-up", (data) => {
    const { connectedUserSocketId } = data;

    const connectedPeer = connectedPeers.find(
      (peerSocketId) => peerSocketId === connectedUserSocketId
    );

    if (connectedPeer) {
      io.to(connectedUserSocketId).emit("user-hanged-up");
    }
  });

  socket.on("stranger-connection-status", (data) => {
    const { status } = data;
    if (status) {
      connectedPeersStrangers.push(socket.id);
    } else {
      const newConnectedPeersStrangers = connectedPeersStrangers.filter(
        (peerSocketId) => peerSocketId !== socket.id
      );
      connectedPeersStrangers = newConnectedPeersStrangers;
    }

    console.log(connectedPeersStrangers);
  });

  socket.on("get-stranger-socket-id", () => {
    let randomStrangerSocketId;
    const filterConnectedPeersStrangers = connectedPeersStrangers.filter(
      (peerSocketId) => peerSocketId !== socket.id
    );

    if (filterConnectedPeersStrangers.length > 0) {
      randomStrangerSocketId =
        filterConnectedPeersStrangers[
          Math.floor(Math.random() * filterConnectedPeersStrangers.length)
        ];
    } else {
      randomStrangerSocketId = null;
    }

    const responseData = {
      randomStrangerSocketId,
    };

    io.to(socket.id).emit("stranger-socket-id", responseData);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Notify the other participant about the disconnection
    const connectedPeerIndex = connectedPeers.indexOf(socket.id);
    if (connectedPeerIndex !== -1) {
      const otherParticipantSocketId = connectedPeers[1 - connectedPeerIndex]; // Get the socket ID of the other participant

      if (otherParticipantSocketId) {
        io.to(otherParticipantSocketId).emit("user-hanged-up");
      }

      // Remove the disconnected user from the list
      connectedPeers = connectedPeers.filter(
        (peerSocketId) => peerSocketId !== socket.id
      );
    }

    // Handle other disconnection logic as needed

    console.log("Updated connectedPeers:", connectedPeers);
    console.log("Updated connectedPeersStrangers:", connectedPeersStrangers);

    const newConnectedPeersStrangers = connectedPeersStrangers.filter(
      (peerSocketId) => peerSocketId !== socket.id
    );

    console.log("Updated connectedPeersStrangers:", newConnectedPeersStrangers);

    connectedPeersStrangers = newConnectedPeersStrangers;
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
