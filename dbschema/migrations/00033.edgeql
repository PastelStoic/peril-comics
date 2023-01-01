CREATE MIGRATION m1kcq4p7tpa36i6cmio622kssk2jq5ad2rpot6eo42k35cemxqzhka
    ONTO m1hstbuu6lqw6sbqhu7miz4jfortmrr5h3firts5iqe6hzjrdgpwcq
{
  ALTER TYPE default::Account {
      ALTER LINK user {
          SET REQUIRED USING (SELECT
              default::User 
          LIMIT
              1
          );
      };
  };
  ALTER TYPE default::Account {
      ALTER PROPERTY userId {
          USING (<std::str>.user.id);
      };
  };
  ALTER TYPE default::Session {
      ALTER PROPERTY userId {
          USING (<std::str>.user.id);
          SET REQUIRED USING (SELECT
              <std::str>.user.id
          );
      };
  };
};
