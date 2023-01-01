CREATE MIGRATION m1cer5xrkmemzmfj4xtt4pbm5lxucoluvxjf5zmf5nf5qspvidtraa
    ONTO m1unbhck5gwmrp5e2anprpwmjf4vqc6nbxq7vj3vvfscbjxjrdbskq
{
  ALTER TYPE default::Tag {
      CREATE REQUIRED PROPERTY is_hidden -> std::bool {
          SET default := false;
      };
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK blocked_tags -> default::Tag;
  };
};
