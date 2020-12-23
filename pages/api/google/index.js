import jwt from "jsonwebtoken";
import passport from "passport";
import { usePassportGoogle } from "lib/auth/auth";
import { setTokenCookie } from "lib/auth/authCookies";
import { encryptSession } from "lib/auth/iron";
const TOKEN_SECRET = process.env.TOKEN_SECRET;

export default async function handler(req, res) {
  try {
    await usePassportGoogle();

    function next() {
      console.log(arguments);
    }
    console.log("used Google");
    return await passport.authenticate("google", {
      scope: ["email", "profile"],
    })(req, res, next);
  } catch (error) {
    console.warn(error);
    res.status(401).end(error.message);
  }
}
