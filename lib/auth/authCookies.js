const { parseCookies, setCookie, destroyCookie } = require("nookies");
import Iron from "@hapi/iron";
import { serialize } from "cookie";

const TOKEN_NAME = "token";
const MAX_AGE = 60 * 60 * 24; // 24 hours

export function setTokenCookie(res, token) {
  setCookie({ res }, TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export function removeTokenCookie(res) {
  const cookie = serialize(TOKEN_NAME, "", {
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
}

export function getTokenCookie(req) {
  const cookies = parseCookies({ req });
  return cookies[TOKEN_NAME];
}

export async function getTokenCookieClient(ctx) {
  const parsedCookies = parseCookies(ctx);
  const token = parsedCookies?.token;
  console.log(token);
  const accessToken =
    token && (await Iron.unseal(token, TOKEN_SECRET, Iron.defaults));

  return accessToken;
}
