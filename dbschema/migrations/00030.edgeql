CREATE MIGRATION m17p6iwhajeuctn6cj4rtb2yvlxyiyczbjni6qddebmug3td52cj6q
    ONTO m1k7q4t34pfemseqjybrnkzpt43bdk4pqzcn5myj6xszfhgy5gu4aa
{
  ALTER TYPE default::Session {
      ALTER LINK user {
          SET REQUIRED USING (SELECT
              default::User 
          LIMIT
              1
          );
      };
  };
  ALTER TYPE default::Session {
      ALTER PROPERTY userId {
          USING (.user.id);
      };
  };
};
