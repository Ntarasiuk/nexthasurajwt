const client_id = process.env.GOOGLE_CLIENT_ID;

export default function handler(req, res) {
  var scopes =
    "openid+profile+email";
  res.redirect(
    "https://accounts.google.com/o/oauth2/v2/auth" +
      "?response_type=code" +
      "&access_type=offline" +
      "&client_id=" +
      client_id +
      (scopes ? "&scope=" + scopes : "") +
      "&redirect_uri=" + "http://localhost:3000/api/google/callback"
  );
}