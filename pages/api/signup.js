import passport from "passport";
import { usePassportLocal } from "lib/auth/auth";

export default async function signup(req, res) {
  try {
    const {name} = req.body
    await usePassportLocal({name});

    function next() {
      console.log(arguments);
    }
    return await passport.authenticate('signup', { session: true },
    async (err, user, info) => {
      console.log(err, user, info)
      res.status(200).send({
        message: 'Signup successful',
        user
      });
    }
    )(req, res, next)
    // await createUser(req.body);
    // res.c({ done: true });
  } catch (error) {
    console.error(error);
    res.status(500).end(error.message);
  }
}
