import jwt from "jsonwebtoken";
import { setTokenCookie } from "lib/auth/authCookies";
import { encryptSession } from "lib/auth/iron";
import { usePassportLocal } from "lib/auth/auth";
import { findUserById } from "lib/auth/user";
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const passport = require("passport");



export default async function login(req, res) {
  try {
    // await usePassportLocal();
    const {id } = req.body
    const user = await findUserById(id)
  
    const token = jwt.sign(user, TOKEN_SECRET);
    const encryptedToken = await encryptSession(token);
    console.log(encryptedToken)
    setTokenCookie(res, encryptedToken);
    res.status(200).json({ done: true });

  } catch (error) {
    console.log(error)
    res.status(401).end(error.message);
  }

}
