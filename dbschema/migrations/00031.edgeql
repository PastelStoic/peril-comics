CREATE MIGRATION m1gobepquh46jid5nniotrxoew3fidfpe7kugdgz4jmesdhon5ihta
    ONTO m17p6iwhajeuctn6cj4rtb2yvlxyiyczbjni6qddebmug3td52cj6q
{
  ALTER TYPE default::Session {
      ALTER PROPERTY userId {
          USING (<std::str>.user.id);
      };
  };
};
