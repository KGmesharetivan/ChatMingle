const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ChatMingle = require("../MongoDB/ChatMingledb");
const passwordUtils = require("./passwordUtils");
require("dotenv").config();

const customFields = {
  usernameField: "userEmail",
  passwordField: "userPassword",
};

const verifyCallback = async (username, password, done) => {
  let user = await ChatMingle.getUserByEmail(username);
  if (!user) {
    if (!user) {
      return done(null, false);
    }
  }

  if (!user.salt) {
    return done(null, user);
  }

  const isValid = passwordUtils.validatePassword(
    password,
    user.hash,
    user.salt
  );

  if (isValid) {
    return done(null, user);
  } else {
    return done(null, false);
  }
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user._id || user.googleId);
});

passport.deserializeUser(async (id, done) => {
  let entity = await ChatMingle.getUserById(id);
  done(null, entity);
});

module.exports = passport;
