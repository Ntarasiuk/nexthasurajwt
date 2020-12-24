const jwt = require('jsonwebtoken');

const {
  JWT_TOKEN_EXPIRES,
  HASURA_GRAPHQL_JWT_SECRET,
  USER_FIELDS,
} = require('./config');

function uniq(value, index, self) {
  return self.indexOf(value) === index;
}


const handleClaims = (user) => {
  const roles = user?.memberships?.map((e) => e.role).filter(uniq).length > 0
    ? user?.memberships?.map((e) => e.role).filter(uniq)
    : null;

  const roleFallback = user.id ? 'user' : 'anonymous' 
  const activeOrg = user?.memberships?.filter((e) => e.active)
    ? user?.memberships?.filter((e) => e.active)[0]
    : null;

  return {
    name: user?.name,
    email: user?.email,
    picture: user?.picture,
    sub: user?.id,
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": roles || [roleFallback],
      "x-hasura-default-role": activeOrg?.role || roleFallback,
      "x-hasura-user-id": user?.id,
      "x-hasura-org-id": activeOrg?.organization?.id || '',
    },
  };
};

module.exports = {
  generateJwtToken: function(user) {
    let custom_claims = handleClaims(user)
    return jwt.sign(custom_claims, HASURA_GRAPHQL_JWT_SECRET.key, {
      algorithm: HASURA_GRAPHQL_JWT_SECRET.type,
      expiresIn: `${JWT_TOKEN_EXPIRES}m`,
    });
  },
};