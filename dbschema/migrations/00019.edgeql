CREATE MIGRATION m1njyh5ym7qkeybl54pphp74gyiqf4a74ir2x2wm5kbrfdwnz3qe5q
    ONTO m1ndjwhmd6v2s4elhguufj3c274g3q4mlnfurrhtbkcowrhiald4da
{
  DROP TYPE default::File;
  ALTER TYPE default::User {
      ALTER PROPERTY email {
          SET REQUIRED USING ('fake@temp.com');
      };
  };
};
