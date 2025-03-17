import { dot } from "node:test/reporters";
import passport from "passport";
import { Profile, VerifyCallback } from "passport-google-oauth20";
const GoogleStrategy = require("passport-google-oauth20").Strategy;
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000",
    },
    function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      cb: VerifyCallback
    ) {
      //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(null, profile);
      //  });
    }
  )
);

passport.serializeUser(function (user: Express.User, done) {
  done(null, user);
});

passport.deserializeUser(function (user: Express.User, done) {
  done(null, user);
});
