CREATE MIGRATION m1slpvwkr7ndf5ur3o3amauyxm6ronbv6x5gvon6dqktekkadtbima
    ONTO m1eipai6smrmeevg2a44l3yeme55f2g3wmvb2xd23w66dm5sqnvhlq
{
  ALTER TYPE default::ComicImage {
      ALTER PROPERTY bucket_key {
          SET REQUIRED USING ('');
      };
  };
  ALTER TYPE default::ComicImage {
      DROP PROPERTY url;
  };
};
