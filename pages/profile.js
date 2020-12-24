import { gql, useSubscription } from "@apollo/react-hooks";
import React from "react";
import Layout from "components/layout";
import { withApollo } from "lib/apollo/withApollo";
import { withAuthSync } from "utils/auth";
const GET_USER_ORGANIZATION = gql`
  query {
  
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
      <div className="grid place-items-center ">
        <div>
          <p>This is a Query</p>
          <pre>{JSON.stringify(data, null, 4)}</pre>
  {error ? <p className="text-red-500">There's an error! {JSON.stringify(error)}</p> :null }
        </div>
      </div>
    </Layout>
  );
}

export default withAuthSync(withApollo(profile))
