CREATE MIGRATION m1xvcsfpjk2g5nwaobs3fnbtvumdyp5jrovmysvun6zokfo5xtnhea
    ONTO m1b7o36bfkkumhfngsu3eqd3ffylvxkqhtbnp2p5nfit7tswxyxz7q
{
  ALTER TYPE default::Account {
      CREATE REQUIRED LINK user -> default::User {
          SET REQUIRED USING (SELECT
              default::User 
          LIMIT
              1
          );
      };
  };
  ALTER TYPE default::Account {
      ALTER PROPERTY provider {
          SET REQUIRED USING ('p');
      };
  };
  ALTER TYPE default::Account {
      ALTER PROPERTY providerAccountId {
          SET REQUIRED USING ('p');
      };
  };
  ALTER TYPE default::Account {
      ALTER PROPERTY type {
          SET REQUIRED USING ('p');
      };
  };
  ALTER TYPE default::Account {
      DROP PROPERTY userId;
  };
  ALTER TYPE default::Session {
      CREATE REQUIRED LINK user -> default::User {
          SET REQUIRED USING (SELECT
              default::User 
          LIMIT
              1
          );
      };
  };
  ALTER TYPE default::Session {
      DROP PROPERTY userId;
  };
  ALTER TYPE default::User {
      ALTER LINK accounts {
          USING (.<user[IS default::Account]);
      };
  };
  ALTER TYPE default::User {
      ALTER LINK sessions {
          USING (.<user[IS default::Session]);
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY email {
          DROP CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY email {
          CREATE CONSTRAINT std::exclusive ON (std::str_lower(__subject__));
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY email {
          SET OPTIONAL;
      };
  };
  ALTER TYPE default::User {
      DROP PROPERTY phone;
  };
  ALTER TYPE default::User {
      DROP PROPERTY role;
  };
  ALTER TYPE default::VerificationToken {
      ALTER PROPERTY expires {
          SET REQUIRED USING (<std::datetime>'2018-05-17T15:01:22+00');
      };
      ALTER PROPERTY identifier {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::VerificationToken {
      ALTER PROPERTY identifier {
          SET REQUIRED USING ('p');
      };
      ALTER PROPERTY token {
          DROP CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::VerificationToken {
      ALTER PROPERTY token {
          SET REQUIRED USING ('p');
      };
  };
};
