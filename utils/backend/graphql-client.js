import { GraphQLClient } from 'graphql-request';


const { NEXT_PUBLIC_GRAPHQL_API_ENDPOINT, HASURA_CONSOLE_PASSWORD } = process.env

export const graphql_client = new GraphQLClient(NEXT_PUBLIC_GRAPHQL_API_ENDPOINT, {
  headers: {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': HASURA_CONSOLE_PASSWORD,
  },
});