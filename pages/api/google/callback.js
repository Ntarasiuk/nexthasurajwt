import passport from "passport";
import jwt from "jsonwebtoken";
import { setTokenCookie } from "../../../lib/auth/authCookies";
import { encryptSession } from "../../../lib/auth/iron";
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const host = process.env.APP_HOST;

export default async function handler(req, res) {
  function next() {
    console.log(arguments);
  }

  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    async (err, user, info) => {
      console.log(err, user, info);
      const token = jwt.sign(user, TOKEN_SECRET);
      const encryptedToken = await encryptSession(token);
      setTokenCookie(res, encryptedToken);
      //   res.status(200).json({ done: true });
      res.redirect(host);
    }
  )(req, res, next);
}
