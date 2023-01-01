CREATE MIGRATION m15nmgowpqsso2gttnu5obvqosnyhwnrzfy4vrxli3n6euv4kgl5ba
    ONTO m1rakw6x4kwnyfnzamns7t6npfkbzlsg6ytsxvd7tydyaawhhwuvbq
{
  ALTER TYPE default::CloudflareImage {
      ALTER PROPERTY image_name {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::Comic {
      ALTER LINK tags {
          RESET EXPRESSION;
          RESET EXPRESSION;
          RESET OPTIONALITY;
          SET TYPE default::Tag;
          CREATE PROPERTY inverted -> std::bool {
              SET default := false;
          };
      };
  };
  ALTER TYPE default::Comic {
      CREATE REQUIRED PROPERTY published_date -> std::datetime {
          SET default := (std::datetime_of_transaction());
      };
  };
  ALTER TYPE default::ComicImage {
      ALTER LINK tags {
          CREATE PROPERTY inverted -> std::bool {
              SET default := false;
          };
      };
  };
};
