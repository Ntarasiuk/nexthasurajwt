import Layout from "components/layout";
import React, { useEffect, useState } from "react";
import TeamForm from "components/TeamForm";
import { withApollo } from "lib/apollo/withApollo";
import { gql, useMutation, useQuery } from "@apollo/react-hooks";
import { useUser } from "lib/hooks";
import { useRouter } from "next/router";
import Axios from "axios";
import { withAuthSync } from "utils/auth";
function TeamPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  // check if user is first time user
  const { data, error } = useQuery(
    gql`
      query {
        user {
          id
          first_time_login
          
        }
      }
    `
  );
  let user = data?.user?.[0];

  

  const [insertTeam] = useMutation(gql`
    mutation($name: String!) {
      insert_organization_one(
        object: {
          name: $name
          memberships: { data: { active: true, role: orgAdmin } }
        }
      ) {
        id
        name
        memberships {
          id
          role
        }
      }
    }
  `);

  const [updateFirstTimeLogin] = useMutation(gql`
    mutation($id: uuid!) {
      update_user_by_pk(
        pk_columns: { id: $id }
        _set: { first_time_login: false }
      ) {
        id
        first_time_login
      }
    }
  `);

  async function handleSubmit(e) {
    e.preventDefault();

    if (errorMsg) setErrorMsg("");

    const body = {
      name: e.currentTarget?.name?.value?.trim(),
    };

    if (!body.name) {
      setErrorMsg(`No name provided`);
      return;
    }

    try {
      // create team with first
      const insertedTeam = await insertTeam({
        variables: {
          name: body.name,
        },
      });
      if (insertedTeam?.data?.insert_organization_one?.id) {
        // TODO: update claims
        await Axios("/api/refresh-token");
        // redirect to home
        await updateFirstTimeLogin({ variables: { id: user?.id } });
        router.push("/");
      }
    } catch (error) {
      console.error("An unexpected error happened occurred:", error);
      setErrorMsg(error.message);
    }
  }

  return (
    <Layout title="Team Setup">
      <div className="team">
        {JSON.stringify(error)}
        <TeamForm onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
}

export default withAuthSync(withApollo(TeamPage));
