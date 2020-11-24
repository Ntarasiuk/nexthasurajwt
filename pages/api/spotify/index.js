const client_id = process.env.SPOTIFY_CLIENT_ID;

export default function handler(req, res) {
  var scopes =
    "user-read-private user-read-email streaming user-modify-playback-state";
  res.redirect(
    "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=" +
      client_id +
      (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
      "&redirect_uri=" +
      encodeURIComponent("http://localhost:3000/api/spotify/callback")
  );
}
