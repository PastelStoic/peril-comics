CREATE MIGRATION m1vvfxiiea4sbshzlnfnajvfh42r5yxw3h5w5ncptfuebbyxkpytra
    ONTO m1njyh5ym7qkeybl54pphp74gyiqf4a74ir2x2wm5kbrfdwnz3qe5q
{
  ALTER TYPE default::Account {
      DROP CONSTRAINT std::exclusive ON ((.user, .provider));
      ALTER PROPERTY providerAccountId {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::Account {
      CREATE CONSTRAINT std::exclusive ON ((.provider, .providerAccountId));
  };
  ALTER TYPE default::Account {
      ALTER LINK user {
          ON TARGET DELETE DELETE SOURCE;
          RESET OPTIONALITY;
      };
  };
  ALTER TYPE default::Account {
      CREATE PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
  };
  ALTER TYPE default::Account {
      CREATE REQUIRED PROPERTY userId -> std::str {
          SET REQUIRED USING (SELECT
              <std::str>.user.id
          );
      };
  };
  ALTER TYPE default::Session {
      ALTER LINK user {
          ON TARGET DELETE DELETE SOURCE;
          RESET OPTIONALITY;
      };
  };
  ALTER TYPE default::Session {
      CREATE PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
  };
  ALTER TYPE default::Session {
      CREATE REQUIRED PROPERTY userId -> std::str {
          SET REQUIRED USING (SELECT
              <std::str>.user.id
          );
      };
  };
  ALTER TYPE default::User {
      DROP LINK blocked_tags;
  };
  ALTER TYPE default::User {
      CREATE PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY email {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY email {
          DROP CONSTRAINT std::exclusive ON (std::str_lower(__subject__));
      };
  };
  ALTER TYPE default::VerificationToken {
      CREATE PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
      ALTER PROPERTY token {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
