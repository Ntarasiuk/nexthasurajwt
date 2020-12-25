# Hasura 😈 + NextJS ⚛ + Apollo 🚀 + JWT 🔐

### This is a starter template for a React app with a database + permissions ( JWT).

## Roadmap
---

- [x] Hasura Database with Apollo integration
- [x] Authentication based on [best practices](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql) (use JWT in memory, use refresh tokens on the front end - with silent refresh!)
- [x] Organization and Member authentication in Hasura
- [x] Google Social login added
- [ ] Invitation with email
- [ ] Password reset with email
- [ ] Change design framework to Material UI or Chakra

## Next JS
---

To start, use yarn or npm

```bash
yarn install
or
npm install
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

``` css
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
APP_HOST= /* required. e.g. http://localhost:3000 */
NEXT_PUBLIC_GRAPHQL_API_ENDPOINT= /* your graphql endpoint from hasura */
HASURA_CONSOLE_PASSWORD= /* admin password from hasura */
HASURA_GRAPHQL_JWT_SECRET=

```

[Set up JWT on Hasura](https://hasura.io/docs/1.0/graphql/core/auth/authentication/jwt.html#configuring-jwt-mode)

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
- refresh_tokens
- organization

and add the following permissions

- orgAdmin
- user
- anonymous

for some access control ideas, [see here](https://hasura.io/docs/1.0/graphql/core/auth/authorization/common-roles-auth-examples.html)

Migrate user settings:

```bash
cd hasura/
hasura migrate apply --endpoint "https://<endpoint>.hasura.app" --admin-secret "<admin-secret>"
hasura metadata apply --endpoint "https://<endpoint>.hasura.app" --admin-secret "<admin-secret>"
```

Some inspirational links that helped me:

- [https://hasura.io/blog/best-practices-of-using-jwt-with-graphql](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql)
- [https://github.com/vnovick/graphql-jwt-tutorial](https://github.com/vnovick/graphql-jwt-tutorial)
- [https://github.com/vercel/next.js/tree/canary/examples/with-apollo](https://github.com/vercel/next.js/tree/canary/examples/with-apollo)