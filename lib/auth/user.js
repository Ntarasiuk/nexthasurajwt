// import crypto from 'crypto'
import axios from "axios";
import bcrypt from "bcrypt";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT;
const HASURA_CONSOLE_PASSWORD = process.env.HASURA_CONSOLE_PASSWORD;

function uniq(value, index, self) {
  return self.indexOf(value) === index;
}

export const handleClaims = (user) => {
  const roles = user?.memberships?.map((e) => e.role).filter(uniq).length > 0
    ? user?.memberships?.map((e) => e.role).filter(uniq)
    : null;

  const roleFallback = user.id ? 'user' : 'anonymous' 
  const activeOrg = user?.memberships?.filter((e) => e.active)
    ? user?.memberships?.filter((e) => e.active)[0]
    : null;

  return {
    name: user?.name,
    email: user?.email,
    picture: user?.picture,
    sub: user?.id,
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": roles || [roleFallback],
      "x-hasura-default-role": activeOrg?.role || roleFallback,
      "x-hasura-user-id": user?.id,
      "x-hasura-org-id": activeOrg?.organization?.id,
    },
  };
};

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
            picture
            created_at
          }
        }
        `,
      variables: {
        object: {
          email: email,
          name,
          password: hash,
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
              picture
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
  console.log(password, user.password);

  if (!user) {
    throw Error(`No user found with: ${email}`);
  }
  if (!user.password) {
    throw Error("Either the user is missing or the password isn't present");
  }
  const compare = await bcrypt.compare(password, user.password);

  console.log(compare);
  if (compare) {
    return handleClaims(user);
  } else {
    throw new Error("Password is incorrect!");
  }
}

export async function findOrCreateUser(userData) {
  const { data } = await axios(GRAPHQL_ENDPOINT, {
    method: "post",
    headers: {
      "x-hasura-admin-secret": HASURA_CONSOLE_PASSWORD,
    },
    data: {
      query: `
        mutation InsertUser($object: user_insert_input!) {
          insert_user_one(object: $object, on_conflict: {constraint: user_email_key, update_columns: [name, picture, sub, last_seen, provider]}) {
            id
            email
            name
            picture
            created_at
            sub
        
          }
        }
        `,
      variables: {
        object: {
          ...userData,
        },
      },
    },
  });
  const user = data?.data?.insert_user_one;

  if (!user) {
    console.warn("User is missing");
    throw Error("User is missing");
  }
  return user

}
export async function findUserById(id) {
  const { data } = await axios(GRAPHQL_ENDPOINT, {
    method: "post",
    headers: {
      "x-hasura-admin-secret": HASURA_CONSOLE_PASSWORD,
    },
    data: {
      query: `
        query FindUser($id: uuid!) {
          user_by_pk(id: $id) {
            id
            email
            name
            picture
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
        id
      },
    },
  });
  const user = data?.data?.user_by_pk;

  if (!user) {
    console.warn("User is missing");
    throw Error("User is missing");
  }

 return handleClaims(user);

}
