import { createUser } from "lib/auth/user";

export default async function signup(req, res) {
  try {   
    const user = await createUser(req.body);
    
    res.status(200).send({
      message: 'Signup successful',
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).end(error.message);
  }
}
