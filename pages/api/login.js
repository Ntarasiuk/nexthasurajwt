import bcrypt from "bcryptjs";
import Joi from "joi";
import auth_tools from "utils/backend/auth-tools";
import { JWT_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } from "utils/backend/config";
import cookies from "utils/backend/cookies";
import { graphql_client } from "utils/backend/graphql-client";
import { v4 as uuidv4 } from "uuid";

const handler = async (req, res) => {
  // validate email and password
  const schema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    res.status(400).json(error.details[0].message);
  }

  const { email, password } = value;

  let query = `
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
        }
      }
    }
  `;

  let hasura_data;
  try {
    hasura_data = await graphql_client.request(query, {
      email,
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({
      error: {
        message: "Unable to find user",
      },
    });
  }

  if (hasura_data[`user`].length === 0) {
    // console.error("No user with this 'email'");
    return res.status(401).json({
      error: {
        message: "Invalid 'email' or 'password'",
      },
    });
  }

  // check if we got any user back
  const user = hasura_data[`user`][0];

  // see if password hashes matches
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    console.error("Password does not match");
    res.status(401).json({
      error: {
        message: "Invalid 'email' or 'password'",
      },
    });
  }
  console.warn("user: " + JSON.stringify(user, null, 2));

  const jwt_token = auth_tools.generateJwtToken(user);
  const jwt_token_expiry = new Date(
    new Date().getTime() + JWT_TOKEN_EXPIRES * 60 * 1000
  );

  // generate refresh token and put in database
  query = `
  mutation (
    $refresh_token_data: refresh_tokens_insert_input!
  ) {
    insert_refresh_tokens (
      objects: [$refresh_token_data]
    ) {
      affected_rows
    }
  }
  `;

  const refresh_token = uuidv4();
  try {
    await graphql_client.request(query, {
      refresh_token_data: {
        user_id: user.id,
        refresh_token: refresh_token,
        expires_at: new Date(
          new Date().getTime() + REFRESH_TOKEN_EXPIRES * 60 * 1000
        ), // convert from minutes to milli seconds
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: {
        message: "Could not update 'refresh token' for user",
      },
    });
  }

  res.cookie("refresh_token", refresh_token, {
    maxAge: REFRESH_TOKEN_EXPIRES * 60 * 1000, // convert from minute to milliseconds
    httpOnly: true,
    path: "/",
    secure: false,
  });

  // return jwt token and refresh token to client

  res.status(200).json({
    jwt_token,
    refresh_token,
    jwt_token_expiry,
  });
};

export default cookies(handler);
