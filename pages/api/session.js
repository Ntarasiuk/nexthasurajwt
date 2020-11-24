const { parseCookies, setCookie, destroyCookie } = require("nookies");
import Iron from "@hapi/iron";

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export default async function session(req, res) {
  try {
    const parsedCookies = parseCookies({ req });
    const token = parsedCookies?.token;

    const accessToken =
      token && (await Iron.unseal(token, TOKEN_SECRET, Iron.defaults));

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    });
  }
}
