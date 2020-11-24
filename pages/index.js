import Head from "next/head";
import Link from "next/link";
import Header from "../components/header";
import { useUser } from "../lib/hooks";
import styles from "../styles/Home.module.css";

export default function Home() {
  const user = useUser();
  console.log(user);
  return (
    <>
      <Header />
      <div className={styles.container}>
        <Head>
          <title>Next | Hasura | Passport</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <h1 className={styles.title}>Hasura, Next, Passport JWT</h1>

          <div className={styles.description}>
            {user ? (
              <>
                <p>Hello, {user.name}</p>
                <Link href="/api/logout">
                  <button>Logout</button>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <a>Login</a>
              </Link>
            )}
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
    </>
  );
}
