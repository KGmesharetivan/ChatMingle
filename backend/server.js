require("dotenv").config();

const express = require("express");
const http = require("http");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const passport = require("./functions/auth/passportConfig");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

const indexRouter = require("./functions/routes/index");
const authRouter = require("./functions/routes/auth");

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);

// Socket.IO configuration
const io = require("socket.io")(server, {
  cors: {
    origin: "https://chatmingle--bright-cascaron-41cee7.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Use cors middleware
app.use(
  cors({
    origin: "https://chatmingle--bright-cascaron-41cee7.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// MongoDB connection
mongoose.set("strictQuery", false);

mongoose
  .connect(
    "mongodb+srv://mesharet93:fh1TKG5wWQigURlz@cluster0.osfx5k9.mongodb.net/ChatMingle"
  )
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error(err));

// Session store configuration
const sessionStore = new MongoStore({
  mongoUrl:
    "mongodb+srv://mesharet93:fh1TKG5wWQigURlz@cluster0.osfx5k9.mongodb.net/ChatMingle",
  dbName: "ChatMingle",
  collection: "sessions",
  mongooseConnection: mongoose.connection,
  stringify: false,
});

app.use(
  session({
    secret: "EWC8ANTIfZKrRrRpHcSIXlI_5QjkAtEZZVkxVBphjk8",
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

// Define your routes here
app.use("/", indexRouter);
app.use("/auth", authRouter);

// Middleware for serving your React application
app.use(express.static(path.join(__dirname, "frontend/build")));
app.use("/uploads", express.static("uploads"));

// Handle CORS preflight OPTIONS request
app.options("*", cors());

let connectedPeers = [];
let connectedPeersStrangers = [];

io.on("connection", (socket) => {
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
      const data = {
        callerSocketId: socket.id,
        callType,
      };
      io.to(calleePersonalCode).emit("pre-offer", data);
    } else {
      const data = {
        preOfferAnswer: "CALLEE_NOT_FOUND",
      };
      io.to(socket.id).emit("pre-offer-answer", data);
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

    const data = {
      randomStrangerSocketId,
    };

    io.to(socket.id).emit("stranger-socket-id", data);
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
