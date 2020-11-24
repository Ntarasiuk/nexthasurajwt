import jwt from "jsonwebtoken";
import nextConnect from "next-connect";
import passport from "passport";
import { setTokenCookie } from "../../lib/auth/authCookies";
import { encryptSession } from "../../lib/auth/iron";
import { localStrategy } from "../../lib/auth/passportLocal";
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const authenticate = (method, req, res) =>
  new Promise((resolve, reject) => {
    passport.authenticate(method, { session: false }, (error, token) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    })(req, res);
  });

passport.use(localStrategy);

export default nextConnect()
  .use(passport.initialize())
  .post(async (req, res) => {
    try {
      const user = await authenticate("local", req, res);
      // session is the payload to save in the token, it may contain basic info about the user
      const session = { ...user };
      // The token is a string with the encrypted session
      const token = jwt.sign(session, TOKEN_SECRET);

      const encryptedToken = await encryptSession(token);
      setTokenCookie(res, encryptedToken);
      res.status(200).send({ done: true });
    } catch (error) {
      console.error(error);
      res.status(401).send(error.message);
    }
  });
