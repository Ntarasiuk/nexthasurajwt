import { gql, useSubscription } from "@apollo/react-hooks";
import React from "react";
import Layout from "../components/layout";
import { withApollo } from "../lib/apollo/withApollo";
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
    <Layout>
      <div className="grid min-h-screen place-items-center ">
        <div>
          <p>this is a subscription query</p>
          <pre>{JSON.stringify(data, null, 4)}</pre>
          <pre>{JSON.stringify(error, null, 4)}</pre>
        </div>
      </div>
    </Layout>
  );
}

export default withApollo({ ssr: true })(profile);
