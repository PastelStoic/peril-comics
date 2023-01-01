CREATE MIGRATION m1wqivbe75e646rsocrqbxyzcoceyhlmtynp44ylu52e3emv2jvfpq
    ONTO m1ctypurzx3lyol75feibmufijbmnr2mpe37xcafj75ii3ys5md2vq
{
  ALTER TYPE default::Comic {
      ALTER LINK tags {
          USING (SELECT
              DISTINCT ((FOR image IN .images
              UNION 
                  (SELECT
                      {image.tags}
                  )))
          );
      };
  };
};
