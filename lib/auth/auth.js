const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
import { createUser, findOrCreateUser, findUser } from "./user";
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
var GoogleStrategy = require("passport-google-oauth20");

export const usePassportGoogle = () => {
  console.log("Using Google Authentication")
  return new Promise(async (resolve, reject) => {
    try {
      await passport.use(
        new GoogleStrategy(
          {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
          },
          async (accessToken, refreshToken, profile, done) => {
            console.log(profile);
         
            if (profile) {
              const userData = {
                email: profile?._json?.email,
                name: profile._json?.name,
                picture: profile._json?.picture,
                sub: `google-oauth2|${profile._json?.sub}`,
              }
              const user = await findOrCreateUser(userData);
          
              return done(null, user);

            }
          }
        )
      );
      await passport.initialize();
      return resolve(true);
    } catch (error) {
      console.warn(error)
      return reject(new Error(error))
    }
  });
};

export const usePassportLocal = (params) => {
  return new Promise(async (resolve, reject) => {
    console.warn("RUNNING: passport strategies");
    try {
      const name = params?.name;
      await passport.use(
        "signup",
        new localStrategy(
          {
            usernameField: "email",
            passwordField: "password",
          },
          async (email, password, done) => {
            try {
              const user = await createUser({ email, password, name });
              return done(null, user);
            } catch (error) {
              done(error);
            }
          }
        )
      );

      await passport.use(
        "login",
        new localStrategy(
          {
            usernameField: "email",
            passwordField: "password",
          },
          async (email, password, done) => {
            try {
              const user = await findUser({ email, password });

              if (!user) {
                return done(null, false, { message: "User not found" });
              }
              return done(null, user, { message: "Logged in Successfully" });
            } catch (error) {
              console.log(error);
              return done(error);
            }
          }
        )
      );

      await passport.use(
        new JWTstrategy(
          {
            secretOrKey: TOKEN_SECRET,
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter(TOKEN_SECRET),
          },
          async (token, done) => {
            console.log(token, done);
            try {
              return done(null, token.user);
            } catch (error) {
              done(error);
            }
          }
        )
      );

      console.warn("RUNNING: passport initialization");
      await passport.initialize();
      return resolve(true);
    } catch (error) {
      return new Error(error);
    }
  });
};
