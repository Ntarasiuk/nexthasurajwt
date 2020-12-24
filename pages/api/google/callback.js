import axios from "axios";
import { findOrCreateUser } from "lib/auth/user";
import { setCookie } from "nookies";
import { login } from "utils/auth";
const jwt = require("jsonwebtoken");
const qs = require("querystring");
const btoa = require("btoa");
const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;
const host = process.env.APP_HOST;
export default async function handler(req, res) {
  const {
    query: { code },
  } = req;
  const accountCreds = await axios
    .post(
      "https://oauth2.googleapis.com/token",
      qs.stringify({
        grant_type: "authorization_code",
        code,
        client_id,
        client_secret,
        redirect_uri: `${host}/api/google/callback`,
      })
    )
    .then((e) => e.data);
  var decoded = jwt.decode(accountCreds.id_token);

  console.log(decoded)
  try {

  const user = await findOrCreateUser({
    email: decoded?.email,
    name: decoded?.name,
    picture: decoded?.picture,
    sub: decoded?.sub,
    locale: decoded?.locale,
    provider: 'google'
  });

  console.log(user);
   
    return res.redirect(`${host}/login?email=${user.email}&sub=${user.sub}`)
    
  } catch (err) {
    console.warn(err);
    return res.status(500).end(err.message);
  }
}
