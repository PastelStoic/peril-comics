CREATE MIGRATION m1ww6vr5qddvc54wudeteq6g3d5e6qbdub2rqe3xbv5wxcgka5syza
    ONTO m1bfcl4zqr4jkqsm3l7nqesmd5a34alodgubk6i6n73gzudmdc5g7q
{
  ALTER TYPE default::CloudflareImage {
      ALTER PROPERTY image_id {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::Comic {
      CREATE OPTIONAL LINK thumbnail -> default::CloudflareImage;
  };
  ALTER TYPE default::Comic {
      DROP PROPERTY thumbnail_url;
  };
  ALTER TYPE default::ComicImage {
      CREATE REQUIRED LINK image -> default::CloudflareImage {
          SET REQUIRED USING (std::assert_exists((SELECT
              default::CloudflareImage FILTER
                  (default::CloudflareImage.image_name ILIKE default::ComicImage.name)
          LIMIT
              1
          )));
      };
  };
  ALTER TYPE default::ComicImage {
      DROP PROPERTY url;
  };
};
