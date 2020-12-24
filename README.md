# Hasura 😈 + NextJS ⚛ + Apollo 🚀 + JWT 🔐

## Next JS
---
This is a starter template for a SSR React app with a database + permissions ( JWT).


```bash
yarn install
```

.vscode settings are ready to use. Just press F5 or start the debugger to get goin!
or use  `yarn dev`

Authenticated routes will use the `withAuthSync` HOC, and to add the Apollo HOC to a page, just export `withApollo` at the bottom of a page


``` javascript
export default withAuthSync(withApollo(pageName));
```

## Environment setup
---
Edit `.env.example` with the values and change the name to `.env.local`

Here are some links to get started with other authentication providers

- [GitHub OAuth](https://docs.github.com/en/free-pro-team@latest/developers/apps/creating-an-oauth-app)
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Twitter OAuth](https://developer.twitter.com/en/docs/apps/overview)
- [Facebook OAuth](https://developers.facebook.com/docs/facebook-login/web)

## Hasura
---
Create an account and make a Heroku instance

[https://cloud.hasura.io/](https://cloud.hasura.io/)

Once you have the instance url, change the file `/hasura/config.yaml` with the url, and then you can apply the migration

This will add the following tables
- user
- user_roles
- membership
- organization

and add the following permissions
- admin
- user
- anonymous

Migrate user settings:

```bash
cd hasura/
hasura migrate apply --endpoint "<endpoint>" --admin-secret "<admin-secret>"
hasura metadata apply --endpoint "<endpoint>" --admin-secret "<admin-secret>"
```


Some inspirational links that helped me:
- https://hasura.io/blog/best-practices-of-using-jwt-with-graphql
- https://github.com/vnovick/graphql-jwt-tutorial
- https://github.com/vercel/next.js/tree/canary/examples/with-apollo