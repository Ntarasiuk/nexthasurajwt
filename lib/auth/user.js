// import crypto from 'crypto'
import axios from "axios";
import bcrypt from "bcrypt";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT;
const HASURA_CONSOLE_PASSWORD = process.env.HASURA_CONSOLE_PASSWORD;

export async function createUser({ email, password, name }) {
  // Here you should create the user and save the salt and hashed password (some dbs may have
  // authentication methods that will do it for you so you don't have to worry about it):

  const hash = await bcrypt.hash(password, 10);
  const { data } = await axios(GRAPHQL_ENDPOINT, {
    method: "post",
    headers: {
      "x-hasura-admin-secret": HASURA_CONSOLE_PASSWORD,
    },
    data: {
      query: `
        mutation InsertUser($object: user_insert_input!) {
          insert_user_one(object: $object) {
            id
            email
            name
            memberships {
              id
              role
            }
            created_at
          }
        }
        `,
      variables: {
        object: {
          email: email,
          name,
          password: hash,
          memberships: {data: {role: 'user'}, 
          }
        },
      },
    },
  });
  const user = data?.data?.insert_user_one;
  console.log(user);
  return { email, createdAt: new Date() };
}

export async function findUser({ email, password }) {
  const { data, error } = await axios(GRAPHQL_ENDPOINT, {
    method: "post",
    headers: {
      "x-hasura-admin-secret": "HasuraTest",
    },
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
        email: email,
      },
    },
  });
  const user = data?.data?.user?.[0];
  console.log(password, user.password)

  if (!user.password) {
    console.warn('Either the user is missing or the password isn\'t present')
    throw Error(error);
  }
  console.log(user)
  const compare = await bcrypt.compare(password, user.password);

  console.log(compare)
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
    throw new Error("Password is incorrect!");
  }
}
