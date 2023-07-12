CREATE MIGRATION m1gp4m4yyg4d3tuteacufmm4nzw6qvhf4yakzrsxbft4v2efmi2qjq
    ONTO m1booydsxz635fagk5zinuqiuclnttyxhqaruzojlyojvosmemhs4q
{
  ALTER TYPE default::Comic {
      CREATE REQUIRED PROPERTY is_free -> std::bool {
          SET default := false;
      };
  };
};
