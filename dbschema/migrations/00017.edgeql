CREATE MIGRATION m1q6bpmblsuw642bl3ybxxe4iy2uejc7qpwfuzyqefhxndgvyj366a
    ONTO m1qtj42bo7hb2tbx7wfnoyj6wezf476sq66acq5qxlkhz3kxaueqpa
{
  ALTER TYPE default::Comic {
      ALTER LINK images {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::ComicImage {
      ALTER PROPERTY bucket_key {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::File {
      CREATE REQUIRED PROPERTY bucketKey -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY contentType -> std::str;
      CREATE REQUIRED PROPERTY uploadedAt -> std::datetime {
          SET default := (std::datetime_current());
          SET readonly := true;
      };
  };
};
