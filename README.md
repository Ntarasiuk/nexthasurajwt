# Hasura 😈 + NextJS ⚛ + Apollo 🚀 + Passport 🔐

## Next JS
---
This is a starter template for a SSR React app with a database + permissions (Passport JWT).


```bash
yarn install
```

.vscode settings are ready to use. Just press F5 or start the debugger to get goin!
or use  `yarn dev`

To add the Apollo HOC to a page, just export `withApollo` at the bottom of a page

``` javascript
export default withApollo({ ssr: true })(pageName);
```


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
- https://github.com/vnovick/graphql-jwt-tutorial
- https://github.com/vercel/next.js/tree/canary/examples/with-apollo
- https://github.com/vercel/next.js/tree/canary/examples/with-passport
- https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport