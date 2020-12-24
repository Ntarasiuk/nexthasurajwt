import { gql } from "apollo-boost";

export const USER_QUERY = gql`
query{
    user
        {
          id
          first_time_login
          name
          picture
          memberships {
            id
          }
        }
}
`