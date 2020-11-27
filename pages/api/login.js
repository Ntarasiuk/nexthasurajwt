import jwt from "jsonwebtoken";
import { setTokenCookie } from "../../lib/auth/authCookies";
import { encryptSession } from "../../lib/auth/iron";
import { usePassport } from "../../lib/auth/auth";
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const passport = require("passport");



export default async function login(req, res) {
  try {

    await usePassport();

    function next() {
      console.log(arguments);
    }
    return await passport.authenticate("login", {session: true}, async (err, user, info) => {
      console.log(info);
      try {
        if (err || !user) {
          const error = new Error(err);
          console.log(error);
          return res.status(401).end(error.message);
        }

        req.login(user, { session: false }, async (error) => {
          const token = jwt.sign(user, TOKEN_SECRET);
          const encryptedToken = await encryptSession(token);
          setTokenCookie(res, encryptedToken);
          res.status(200).json({ done: true });
        });
      } catch (error) {
        res.statusCode = 401;
        res.status(401).end(error.message);
      }
    })(req, res, next);
  } catch (error) {
    res.status(401).end(error.message);
  }

  //   const session = await findUser(req.body);
  //   const token = jwt.sign(session, TOKEN_SECRET);
  //   const encryptedToken = await encryptSession(token);
  //   setTokenCookie(res, encryptedToken);
  //   res.status(200).send({ done: true });
  // } catch (error) {
  //   console.error(error);
  //   res.status(401).end(error.message);
}
