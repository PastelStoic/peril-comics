CREATE MIGRATION m1e6o47ic27onbb45p2ijqn5gmg34s32vr73aqouce6eh23isjmtgq
    ONTO m1slpvwkr7ndf5ur3o3amauyxm6ronbv6x5gvon6dqktekkadtbima
{
  ALTER TYPE default::ComicImage {
      ALTER PROPERTY bucket_key {
          USING ((<std::str>.id ++ .name));
      };
  };
};
