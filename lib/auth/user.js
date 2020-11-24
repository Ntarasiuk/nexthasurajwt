// import crypto from 'crypto'
import axios from "axios";
import bcrypt from "bcrypt";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT;

export async function createUser({ username, password }) {
  // Here you should create the user and save the salt and hashed password (some dbs may have
  // authentication methods that will do it for you so you don't have to worry about it):

  console.log({ username, password });
  const hash = await bcrypt.hash(password, 10);

  const { data } = await axios(GRAPHQL_ENDPOINT, {
    method: "post",
    data: {
      query: `
        mutation InsertUser($object: user_insert_input!) {
          insert_user_one(object: $object) {
            id
            email
            name
            created_at
          }
        }
        `,
      variables: {
        object: {
          email: username,
          password: hash,
        },
      },
    },
  });
  const user = data?.insert_user_one;

  return { username, createdAt: new Date() };
}

export async function findUser({ username, password }) {
  const { data } = await axios(GRAPHQL_ENDPOINT, {
    method: "post",
    data: {
      query: `
        query FindUser($email: String) {
          user(where: {email: {_eq: $email}}) {
              id
              name
              password
              email
              created_at
              memberships {
                role
                active
                organization {
                  id
                  name
                }
                id
              }
            }
          }
        `,
      variables: {
        email: username,
      },
    },
  });
  const user = data?.data?.user?.[0];
  if (!user) throw new Error("User not found!");

  const compare = await bcrypt.compare(password, user.password);
  if (compare) {
    const roles = user?.memberships?.map((e) => e.role)
      ? user?.memberships?.map((e) => e.role)
      : ["anonymous"];
    const activeOrg = user?.memberships?.filter((e) => e.active)
      ? user?.memberships?.filter((e) => e.active)[0]
      : ["anonymous"];
    return {
      name: user?.name,
      email: user?.email,
      sub: user?.id,
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": roles,
        "x-hasura-default-role": activeOrg?.role,
        "x-hasura-user-id": user?.id,
        "x-hasura-org-id": activeOrg?.organization?.id,
      },
    };
  } else {
    throw new Error("User not found!");
  }
}
