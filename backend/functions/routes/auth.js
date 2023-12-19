require("dotenv").config();

const express = require("express");
const router = express.Router();
const passwordUtils = require("../auth/passwordUtils");
const passport = require("passport");
const ChatMingle = require("../MongoDB/ChatMingledb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// CORS middleware
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const saltRounds = 10;

// handles login requests
router.post("/login", async function (req, res, next) {
  const { userEmail, userPassword } = req.body;

  try {
    const user = await ChatMingle.getUserByEmail(userEmail);

    if (!user) {
      return res.status(401).send({ loginStatus: false });
    }

    try {
      const isValid = await bcrypt.compare(userPassword, user.hash);

      if (isValid) {
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }

          const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET);
          return res.send({ loginStatus: true, user, token });
        });
      } else {
        return res.status(401).send({ loginStatus: false });
      }
    } catch (error) {
      return next(error);
    }
  } catch (error) {
    return res.status(500).send({ loginStatus: false });
  }
});

router.post("/register", async (req, res) => {
  try {
    const duplicateEmail = await ChatMingle.getUserByEmail(req.body.email);

    if (duplicateEmail) {
      return res
        .status(409)
        .send({ registered: false, message: "Email already exists" });
    }

    const hash = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = {
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      gender: req.body.gender,
      hash: hash,
    };

    let saveResult = await ChatMingle.saveNewUser(newUser);

    if (saveResult.acknowledged) {
      res.send({ registered: true });
    } else {
      res
        .status(400)
        .send({ registered: false, message: "Failed to save the user" });
    }
  } catch (error) {
    res.status(500).send({
      registered: false,
      message: "An error occurred during registration",
    });
  }
});

router.get("/isLoggedIn", (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ isLoggedIn: true, user: req.user });
  } else {
    res.send({ isLoggedIn: false, user: null });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      res.status(500).send({ logout: false });
    } else {
      res.send({ logout: true });
    }
  });
});

module.exports.handler = async (event, context) => {
  // Netlify function entry point
  const app = express();
  app.use(express.json()); // Body parser middleware

  // Your existing routes
  app.use("/.netlify/functions/auth", router);

  return app(event, context);
};
