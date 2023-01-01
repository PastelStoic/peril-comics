CREATE MIGRATION m1b2q7hg3ov5qjn3743zoemv7gqhzr6piuxmmxneqlxuu2avpicioa
    ONTO m1e6o47ic27onbb45p2ijqn5gmg34s32vr73aqouce6eh23isjmtgq
{
  ALTER TYPE default::ComicImage {
      DROP PROPERTY bucket_key;
  };
  ALTER TYPE default::ComicImage {
      CREATE REQUIRED PROPERTY s3_bucket_path -> std::str {
          SET REQUIRED USING ('');
      };
  };
};
