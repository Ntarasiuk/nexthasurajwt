import Layout from "components/layout";
import React, { useEffect, useState } from "react";
import TeamForm from "components/TeamForm";
import { withApollo } from "lib/apollo/withApollo";
import { gql, useMutation, useQuery } from "@apollo/react-hooks";
import { useUser } from "lib/hooks";
import { useRouter } from "next/router";
import Axios from "axios";
function TeamPage() {
  const router = useRouter();
  const user = useUser();
  const [errorMsg, setErrorMsg] = useState("");

  // check if user is first time user
  const { data, error } = useQuery(
    gql`
      query($sub: uuid!) {
        user_by_pk(id: $sub) {
          id
          first_time_login
        }
      }
    `,
    { variables: { sub: user?.sub } }
  );

  useEffect(() => {
    if (data?.user_by_pk && !data?.user_by_pk?.first_time_login) {
      router.push("/");
    }
  }, [data?.user_by_pk]);

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
        await Axios.post("/api/refresh", { id: user?.sub });
        // redirect to home
        await updateFirstTimeLogin({variables: {id: user?.sub}})
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

export default withApollo({ ssr: false })(TeamPage);
