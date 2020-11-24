import jwt from "jsonwebtoken";
import { setTokenCookie } from "../../lib/auth/authCookies";
import { encryptSession } from "../../lib/auth/iron";
import { findUser } from "../../lib/auth/user";
const TOKEN_SECRET = process.env.TOKEN_SECRET;

export default async function login(req, res) {
  try {
    const session = await findUser(req.body);
    const token = jwt.sign(session, TOKEN_SECRET);
    const encryptedToken = await encryptSession(token);
    setTokenCookie(res, encryptedToken);
    res.status(200).send({ done: true });
  } catch (error) {
    console.error(error);
    res.status(401).end(error.message);
  }
}
