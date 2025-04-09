import passport from "passport";
import { Profile, VerifyCallback } from "passport-google-oauth20";
const GoogleStrategy = require("passport-google-oauth20").Strategy;
import dotenv from "dotenv";
dotenv.config();
import {
  createUser,
  getUserByEmail,
  getUserByGoogleId,
  getUserById,
  User,
} from "../models/userModel";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      passReqToCallback: true, // This requires the req parameter in callback
    },
    async function (
      req: any, // Add the request parameter
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) {
      try {
        const googleId = profile.id;
        const email = profile.emails![0].value;

        let userByGoogleId: User | null = await getUserByGoogleId(googleId);
        let userByEmail: User | null = await getUserByEmail(email);

        if (!userByGoogleId && !userByEmail) {
          const newUser: User = {
            googleId: googleId,
            username: profile.name!.givenName,
            usersurname: profile.name!.familyName,
            photo: profile.photos![0].value,
            email: email,
          };

          await createUser(newUser);
        }

        const user = await getUserByGoogleId(googleId);

        return done(null, user as User);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser(function (user: any, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id: string, done) {
  getUserById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, undefined);
    });
});
