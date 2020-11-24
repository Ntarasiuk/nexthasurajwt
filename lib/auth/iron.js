import Iron from "@hapi/iron";
import { getTokenCookie } from "./authCookies";

var jwt = require("jsonwebtoken");

// Use an environment variable here instead of a hardcoded value for production
const TOKEN_SECRET = process.env.TOKEN_SECRET;

export function encryptSession(session) {
  return Iron.seal(session, TOKEN_SECRET, Iron.defaults);
}

export async function getSession(req) {
  const token = getTokenCookie(req);
  if (!token) return;
  // unseal with Iron
  const unsealed =
    token && (await Iron.unseal(token, TOKEN_SECRET, Iron.defaults));

  // decode JWT
  var decoded = jwt.verify(unsealed, TOKEN_SECRET);

  if (decoded) return decoded;
}
