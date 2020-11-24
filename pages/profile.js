import { gql, useSubscription } from "@apollo/react-hooks";
import React from "react";
import Header from "../components/header";
import { withApollo } from "../lib/apollo/withApollo";
import styles from "../styles/Home.module.css";
const GET_USER_ORGANIZATION = gql`
  subscription MySubscription {
    membership {
      organization {
        name
        created_at
      }
    }
  }
`;
function profile() {
  const { data, error, loading } = useSubscription(GET_USER_ORGANIZATION);
  return (
    <>
      <Header />
      <div className={styles.container}>
        <p>this is a subscription query</p>
        <pre>{JSON.stringify(data, null, 4)}</pre>
        <pre>{JSON.stringify(error, null, 4)}</pre>
      </div>
    </>
  );
}

export default withApollo({ ssr: true })(profile);
