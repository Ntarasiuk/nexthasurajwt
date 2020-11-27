const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
import bcrypt from "bcrypt";
import { createUser, findUser } from "./user";
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const TOKEN_SECRET = process.env.TOKEN_SECRET;


export const usePassport = () => {
  return new Promise(async (resolve, reject) => {

console.warn('RUNNING: passport strategies')
try {
  await passport.use(
    "signup",
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await createUser({ email, password });
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
          console.log(error)
          return done(error);
        }
      }
    )
  );

  await passport.use(
    new JWTstrategy(
      {
        secretOrKey: TOKEN_SECRET,
        jwtFromRequest: ExtractJWT.fromUrlQueryParameter(TOKEN_SECRET)
      },
      async (token, done) => {
        console.log(token, done)
        try {
          return done(null, token.user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  console.warn('RUNNING: passport initialization')
  await passport.initialize()
  return resolve(true)

} catch (error) {
  return new Error(error)
}
  
});
};
