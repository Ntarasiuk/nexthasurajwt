const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
import bcrypt from "bcrypt";

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const hash = await bcrypt.hash(password, 10);
        const user = await axios(GRAPHQL_ENDPOINT, {
          method: "post",
          data: {
            query: `
                query InsertUser($email: String, $password: String) {
                  insert_user_one(object: $object) {
                      id
                      name
                      email
                    }
                  }
                `,
            variables: {
              email: username,
              password: hash,
            },
          },
        });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
