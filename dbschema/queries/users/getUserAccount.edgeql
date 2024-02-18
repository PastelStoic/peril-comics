select Account {
  providerAccountId,
  access_token,
} filter .user.id = <uuid>$userId and .provider ilike <str>$provider
limit 1