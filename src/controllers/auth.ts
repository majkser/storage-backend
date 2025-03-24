import passport from "passport";
import { Profile, VerifyCallback } from "passport-google-oauth20";
const GoogleStrategy = require("passport-google-oauth20").Strategy;
import dotenv from "dotenv";
dotenv.config();
import {
  createUser,
  getUserByEmail,
  getUserByGoogleId,
  User,
} from "../models/userModel";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      passReqToCallback: true, // This requires the req parameter in callback
    },
    async function (
      req: any, // Add the request parameter
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) {
      const googleId = profile.id;
      const email = profile.emails![0].value;

      let userByGoogleId: User | null = await getUserByGoogleId(googleId);
      let userByEmail: User | null = await getUserByEmail(email);

      if (!userByGoogleId && !userByEmail) {
        const newUser: User = {
          googleId: googleId,
          userName: profile.name!.givenName,
          userSurname: profile.name!.familyName,
          email: email,
        };

        await createUser(newUser);
      }

      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(null, profile);
      // });
    }
  )
);

passport.serializeUser(function (user: Express.User, done) {
  done(null, user);
});

passport.deserializeUser(function (user: Express.User, done) {
  done(null, user);
});
