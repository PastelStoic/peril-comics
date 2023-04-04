INSERT Account {
  user := (SELECT User FILTER .id = <uuid>$id),
  type := "oauth",
  provider := <str>$provider,
  token_type := <str>$token_type,
  expires_at := <int64>$expires_in,
  access_token := <str>$access_token,
  refresh_token := <str>$refresh_token,
  providerAccountId := <str>$providerAccountId,
  scope := <str>$scope,
} UNLESS CONFLICT ON .providerAccountId
ELSE (UPDATE Account SET {
  expires_at := <int64>$expires_in,
  access_token := <str>$access_token,
  refresh_token := <str>$refresh_token,
})