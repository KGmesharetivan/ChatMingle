require("dotenv").config();

const express = require("express");
const router = express.Router();
const passwordUtils = require("../auth/passwordUtils");
const passport = require("passport");
const ChatMingle = require("../MongoDB/ChatMingledb");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const saltRounds = 10;

// handles login requests
router.post("/login", async function (req, res, next) {
  console.log("Login request received");

  // Log the username and password being sent
  const { userEmail, userPassword } = req.body;
  console.log("Username:", userEmail);
  console.log("Password:", userPassword);

  try {
    const user = await ChatMingle.getUserByEmail(userEmail);
    console.log("User from the database:", user);

    if (!user) {
      console.log("Authentication failed. User not found.");
      return res.status(401).send({ loginStatus: false });
    }

    // Use bcrypt to compare the entered password with the stored hash
    try {
      const isValid = await bcrypt.compare(userPassword, user.hash);

      if (isValid) {
        req.logIn(user, function (err) {
          if (err) {
            console.error("Error during login:", err);
            return next(err);
          }

          console.log("User successfully logged in:", user);

          // Create a JWT token
          const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET);

          return res.send({ loginStatus: true, user: user, token: token });
        });
      } else {
        console.log("Invalid password for user:", user);
        return res.status(401).send({ loginStatus: false });
      }
    } catch (error) {
      console.error("Error during password comparison:", error);
      return next(error);
    }
  } catch (error) {
    console.error("Error during user retrieval:", error);
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

    // Generate bcrypt hash
    const saltRounds = 10; // adjust according to your needs
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
    console.error("Error during user registration:", error);
    res.status(500).send({
      registered: false,
      message: "An error occurred during registration",
    });
  }
});

router.get("/isLoggedIn", (req, res) => {
  console.log("Session data:", req.session);

  if (req.isAuthenticated()) {
    console.log("User is authenticated. User:", req.user);
    res.send({ isLoggedIn: true, user: req.user });
  } else {
    console.log("User is not authenticated.");
    console.log("Passport Session:", req.session.passport);
    console.log("Passport User:", req.session.passport.user);

    res.send({ isLoggedIn: false, user: null });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error: ", err);
      res.status(500).send({ logout: false });
    } else {
      res.send({ logout: true });
    }
  });
});

module.exports = router;
