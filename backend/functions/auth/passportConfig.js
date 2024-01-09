import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import ChatMingle from "../MongoDB/ChatMingledb.js";
import bcrypt from "bcryptjs";

// Local strategy for verifying email and password
const localOptions = {
  usernameField: "userEmail",
  passwordField: "userPassword",
};

const localVerify = async (username, password, done) => {
  try {
    let user = await ChatMingle.getUserByEmail(username);

    if (!user || !user.salt || !user.hash) {
      return done(null, false);
    }

    const isValid = await bcrypt.compare(password, user.hash);

    return isValid ? done(null, user) : done(null, false);
  } catch (error) {
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
    done(null, entity);
  } catch (error) {
    done(error, null);
  }
});

// JWT strategy for handling token-based authentication
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey:
    "fb541366046928fd9acfd2bcb1db8bf06d0d124342d136d56e079e27164113d9",
};

const jwtVerify = async (payload, done) => {
  try {
    const user = await ChatMingle.getUserById(payload.sub);
    return user ? done(null, user) : done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
passport.use(jwtStrategy);

export default passport;
