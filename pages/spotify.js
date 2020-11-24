import Head from "next/head";
import router from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home({ spotify, playerName }) {
  let spotifyPlayer = null;

  useEffect(() => {
    console.log(spotify);
    if (!spotify) return router.push("/api/spotify");
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = spotify;
      const player = new Spotify.Player({
        name: playerName,
        getOAuthToken: (cb) => {
          cb(token);
        },
      });

      // Error handling
      player.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });
      player.addListener("authentication_error", ({ message }) => {
        console.error(message);
        if (message) console.log("error?");
      });
      player.addListener("account_error", ({ message }) => {
        console.error(message);
      });
      player.addListener("playback_error", ({ message }) => {
        console.error(message);
      });

      // Playback status updates
      player.addListener("player_state_changed", (state) => {
        console.log(state);
      });

      // Ready
      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      // Connect to the player!
      player.connect();

      spotifyPlayer = player;
    };
  }, []);

  const play = async ({
    spotify_uri,
    playerInstance: {
      _options: { id },
    },
  }) => {
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
      method: "PUT",
      body: JSON.stringify({ uris: [spotify_uri] }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${spotify}`,
      },
    }).then((e) => {
      console.log(e.data);
    });
  };

  const playSomething = (uri) => {
    play({
      playerInstance: spotifyPlayer || new Spotify.Player({ name: playerName }),
      spotify_uri: uri,
    });
  };

  const showArtistAlbums = async (artistId) => {
    const artistsData = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/albums`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${spotify}`,
        },
      }
    )
      .catch(({ error }) => {
        if (error?.status === 401) {
          alert("not logged in");
        }
        console.log(err?.error);
      })
      .then((e) => e.json());
    console.log(artistsData);
  };
  const [searchText, setSearchText] = useState("");
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const getSearchInfo = async (value) => {
    setSearchText(value || "");
    await fetch(
      `https://api.spotify.com/v1/search?q=${value}&type=track%2Cartist&market=US&limit=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${spotify}`,
        },
      }
    )
      .catch(({ error }) => {
        if (error?.status === 401) {
          alert("not logged in");
        }
        console.log(err?.error);
      })
      .then((e) => e.json())
      .then((e) => {
        console.log(e);
        if (e?.error?.status === 401) {
          console.log("not logged in!");
          return router.push("/api/spotify");
        }
        if (e?.error?.status === 500) {
          console.log(e.error);
          return;
        }
        setArtists(e?.artists?.items || []);
        setTracks(e?.tracks?.items || []);
      });
  };
  return (
    <div className={styles.container}>
      <Head>
        <script src="https://sdk.scdn.co/spotify-player.js"></script>
        <title>Spotify</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Spotify Test</h1>

        <img id="current-track" />
        <h3 id="current-track-name"></h3>

        <div className={styles.description}>
          <p>Search Songs</p>
          <input
            className={styles.search}
            label="Search Songs"
            value={searchText}
            onChange={(e) => getSearchInfo(e.target.value)}
          />
        </div>
        <div className={styles.description}>
          {tracks?.length ? (
            <>
              <h2 style={{ marginBottom: 0 }}>Artists</h2>
              <div className={styles.grid}>
                {artists.map((artist) => (
                  <div
                    onClick={() => showArtistAlbums(artist.id)}
                    className={styles.card}
                  >
                    <img
                      src={artist?.images[0]?.url}
                      width={175}
                      height={175}
                      style={{ borderRadius: "50%" }}
                    />

                    <p style={{ width: 175 }}>{artist?.name}</p>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {tracks?.length ? (
            <>
              <h2 style={{ marginBottom: 0 }}>Songs</h2>

              <div className={styles.grid}>
                {tracks.map((track) => (
                  <div
                    onClick={() => playSomething(track.uri)}
                    className={styles.card}
                  >
                    <img
                      src={track?.album?.images[0]?.url}
                      width={175}
                      height={175}
                    />
                    <p className={styles.track} style={{ width: 175 }}>
                      {track?.name}
                    </p>
                    <p className={styles.artist}>{track?.artists[0]?.name}</p>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.linkedin.com/in/ntarasiuk"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Nate Tarasiuk
        </a>
      </footer>
    </div>
  );
}
export async function getServerSideProps(ctx) {
  // get cookies
  const cookies = parseCookies(ctx);

  // get player name from ENV Variables
  const spotifyPlayerName = process.env.PLAYER_NAME;

  return {
    props: {
      spotify: (cookies && cookies.spotify) || null,
      playerName: spotifyPlayerName,
    },
  };
}
