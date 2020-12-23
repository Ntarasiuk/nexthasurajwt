import { gql, useSubscription } from "@apollo/react-hooks";
import React from "react";
import Layout from "components/layout";
import { withApollo } from "lib/apollo/withApollo";
const GET_USER_ORGANIZATION = gql`
  subscription MySubscription {
  
    membership {
      role
      user{
        id
        name
      }
      organization {
        id
        name
        created_at
      }
    }
  }
`;
function profile() {
  const { data, error, loading } = useSubscription(GET_USER_ORGANIZATION);
  return (
    <Layout title="Profile">
      <div className="grid min-h-screen place-items-center ">
        <div>
          <p>This is a Subscription Query</p>
          <pre>{JSON.stringify(data, null, 4)}</pre>
  {error ? <p className="text-red-500">There's an error! {JSON.stringify(error)}</p> :null }
        </div>
      </div>
    </Layout>
  );
}

export default withApollo({ ssr: true })(profile);
