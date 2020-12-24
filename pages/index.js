import Head from "next/head";
import Link from "next/link";
import Layout from "components/layout";
import { useUser } from "lib/hooks";
import styles from "styles/Home.module.css";
import { gql, useQuery } from "@apollo/react-hooks";
import { useEffect } from "react";
import { withApollo } from "lib/apollo/withApollo";
import { useRouter } from "next/router";
import { withAuthSync } from "utils/auth";
import { USER_QUERY } from "./queries/user";

function Home() {
  const router = useRouter()
  // check if user is first time user
  const { data, error } = useQuery(
    USER_QUERY
  );
let user = data?.user?.[0]
useEffect(() => {
  if(user && (user?.first_time_login || user?.memberships.length === 0)) {
    router.push('/team')
  }
}, [user])


  return (
    <>
      <Layout>
        <Head>
          <title>Next | Hasura | JWT</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="grid place-items-center text-center ">
          <div>
            <h1 className="text-4xl py-5">😈 + ⚛ + 🚀 + 🔐</h1>
            <p>Hasura, NextJS, Apollo, JWT</p>
            <div className={styles.description}>
              {user ? (
                <>
                  {user.picture ? <img class="w-24 h-24 mt-6 rounded-full mx-auto" src={user.picture} alt="" width="384" height="512" /> :null }

                  <p>Hello, {user.name}</p>
                  <Link href="/api/logout">
                    <button
                      type="button"
                      className="my-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md  text-sm font-medium text-white bg-black shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none"
                    >
                      Logout
                    </button>
                  </Link>
                </>
              ) : (
                <Link href="/login">
                  <a>
                    <button
                      type="button"
                      className="my-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-black shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none"
                    >
                      Login
                    </button>
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default withAuthSync(withApollo(Home));
