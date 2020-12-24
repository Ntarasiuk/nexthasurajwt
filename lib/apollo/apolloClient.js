import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import fetch from "isomorphic-unfetch";
import { SubscriptionClient } from "subscriptions-transport-ws";
import config from "config";
import { logout } from "utils/auth";




// const requestAccessToken = async () => {
//   if (accessToken) return;
//   const res = await fetch(`/api/session`);
//   if (res.ok) {
//     const json = await res.json();
//     accessToken = json.accessToken;
//   } else {
//     accessToken = "public";
//   }
// };

const logoutLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
   graphQLErrors.forEach(({ extensions }) => {
     console.log(extensions)
     if (extensions.code === 'invalid-jwt'){
       logout()
     }
   }) 
  }
 if (networkError && networkError.statusCode === 401) logout();
})


const createHttpLink = (accessToken) => {
  
  const httpLink = new HttpLink({
    uri: config.graphqlLocalApiEndpoint,
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }, // auth token is fetched on the server side
    fetch,
  });
  return httpLink;
};

export default function createApolloClient(initialState, headers, accessToken) {
  let appJWTToken = accessToken?.token

  return new ApolloClient({
    ssrMode: false,
    link: logoutLink.concat(createHttpLink(appJWTToken)),
    cache: new InMemoryCache().restore(initialState),
  });
}
