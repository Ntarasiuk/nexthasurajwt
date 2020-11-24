import axios from "axios";
import { setCookie } from "nookies";
const qs = require("querystring");
const btoa = require("btoa");
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const host = process.env.APP_HOST;
export default async function handler(req, res) {
  const {
    query: { code },
  } = req;
  const accountCreds = await axios
    .post(
      "https://accounts.spotify.com/api/token",
      qs.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${host}/api/spotify/callback`,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(`${client_id}:${client_secret}`),
        },
      }
    )
    .then((e) => e.data);
  console.log(accountCreds);

  setCookie({ res }, "spotify", accountCreds.access_token, {
    maxAge: accountCreds.expires_in,
    path: "/",
  });

  res.redirect(host);
}
