CREATE MIGRATION m1p4q4nfmewu2dxowoncvcl7qflz3rberlcuolo4plmohqjuqvkvua
    ONTO m1b2q7hg3ov5qjn3743zoemv7gqhzr6piuxmmxneqlxuu2avpicioa
{
  ALTER TYPE default::ComicImage {
      ALTER PROPERTY s3_bucket_path {
          RENAME TO url;
      };
  };
};
