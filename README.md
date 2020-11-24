# Hasura 😈 + NextJS ⚛ + Passport 🔐

This is a starter template for a SSR React app with a database + permissions (with JWT) configured.


```bash
yarn install
```

## Hasura

create an account and make a Heroku instance

[https://cloud.hasura.io/](https://cloud.hasura.io/)

once you have the instance url, change the file `/hasura/config.yaml` with the url, and then you can apply the migration

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