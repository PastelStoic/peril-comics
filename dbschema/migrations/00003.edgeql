CREATE MIGRATION m1bxgo6xhcfsocbmvaktukhd34oq3xd65war2gvwjsud3ngjvibmha
    ONTO m1wqivbe75e646rsocrqbxyzcoceyhlmtynp44ylu52e3emv2jvfpq
{
  CREATE TYPE default::User {
      CREATE MULTI LINK accounts -> default::Account {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE MULTI LINK sessions -> default::AccountSession {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY email -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY email_verified -> std::datetime;
      CREATE PROPERTY image -> std::str;
      CREATE PROPERTY name -> std::str;
  };
};
