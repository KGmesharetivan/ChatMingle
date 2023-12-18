const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const ChatMingle = require("../MongoDB/ChatMingledb");
const passwordUtils = require("./passwordUtils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Local strategy for verifying email and password
const localOptions = {
  usernameField: "userEmail",
  passwordField: "userPassword",
};

const localVerify = async (username, password, done) => {
  try {
    console.log("Verifying user with email:", username);

    let user = await ChatMingle.getUserByEmail(username);
    console.log("User from the database:", user);

    if (!user) {
      console.log("User not found with email:", username);
      return done(null, false);
    }

    if (!user.salt || !user.hash) {
      console.log(
        "User does not have a salt or hash. Proceeding without validation."
      );
      return done(null, false);
    }

    const isValid = await bcrypt.compare(password, user.hash);

    console.log("Entered Password:", password);
    console.log("User Hash:", user.hash);
    console.log("Is Valid:", isValid);

    if (isValid) {
      console.log("User validated successfully:", user);
      return done(null, user);
    } else {
      console.log("Invalid password for user:", user);
      return done(null, false);
    }
  } catch (error) {
    console.error("Error during user verification:", error);
    return done(error);
  }
};

const localStrategy = new LocalStrategy(localOptions, localVerify);
passport.use(localStrategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let entity = await ChatMingle.getUserById(id);
    console.log("User found:", entity);
    done(null, entity);
  } catch (error) {
    console.error("Error deserializing user:", error);
    done(error, null);
  }
});

// JWT strategy for handling token-based authentication
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtVerify = async (payload, done) => {
  try {
    const user = await ChatMingle.getUserById(payload.sub);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
passport.use(jwtStrategy);

module.exports = passport;
