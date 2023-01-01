CREATE MIGRATION m1b7o36bfkkumhfngsu3eqd3ffylvxkqhtbnp2p5nfit7tswxyxz7q
    ONTO m1bxgo6xhcfsocbmvaktukhd34oq3xd65war2gvwjsud3ngjvibmha
{
  ALTER TYPE default::Account {
      ALTER PROPERTY access_token {
          RESET OPTIONALITY;
      };
  };
  ALTER TYPE default::Account {
      ALTER PROPERTY account_type {
          RENAME TO providerAccountId;
      };
  };
  ALTER TYPE default::Account {
      ALTER PROPERTY expires_at {
          RESET OPTIONALITY;
          SET TYPE std::int64;
      };
  };
  ALTER TYPE default::Account {
      ALTER PROPERTY provider {
          RESET OPTIONALITY;
      };
  };
  ALTER TYPE default::Account {
      ALTER PROPERTY providerAccountId {
          RESET OPTIONALITY;
      };
  };
  ALTER TYPE default::Account {
      ALTER PROPERTY provider_account_id {
          RENAME TO type;
      };
  };
  ALTER TYPE default::Account {
      ALTER PROPERTY refresh_token {
          RESET OPTIONALITY;
      };
  };
  ALTER TYPE default::Account {
      ALTER PROPERTY type {
          RESET OPTIONALITY;
      };
  };
  ALTER TYPE default::Account {
      CREATE PROPERTY userId -> std::str;
  };
  ALTER TYPE default::AccountSession {
      DROP LINK accounts;
      DROP LINK sessions;
  };
  ALTER TYPE default::AccountSession RENAME TO default::Session;
  ALTER TYPE default::Session {
      ALTER PROPERTY expires_at {
          RENAME TO expires;
      };
  };
  ALTER TYPE default::Session {
      ALTER PROPERTY image {
          RENAME TO userId;
      };
  };
  ALTER TYPE default::Session {
      ALTER PROPERTY session_token {
          RENAME TO sessionToken;
      };
  };
  ALTER TYPE default::Session {
      ALTER PROPERTY userId {
          SET REQUIRED USING ('user');
      };
  };
  ALTER TYPE default::User {
      ALTER LINK accounts {
          DROP CONSTRAINT std::exclusive;
      };
      ALTER LINK sessions {
          DROP CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY email_verified {
          RENAME TO emailVerified;
      };
  };
  ALTER TYPE default::User {
      CREATE PROPERTY phone -> std::str;
      CREATE PROPERTY role -> std::str;
  };
  ALTER TYPE default::VerificationToken {
      ALTER PROPERTY identifier {
          RESET OPTIONALITY;
      };
  };
  ALTER TYPE default::VerificationToken {
      ALTER PROPERTY token {
          RESET OPTIONALITY;
      };
      CREATE CONSTRAINT std::exclusive ON ((.identifier, .token));
  };
  ALTER TYPE default::VerificationToken {
      ALTER PROPERTY expires_at {
          RENAME TO expires;
      };
  };
  ALTER TYPE default::VerificationToken {
      ALTER PROPERTY expires {
          RESET OPTIONALITY;
      };
  };
};
