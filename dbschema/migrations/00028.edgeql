CREATE MIGRATION m14pwum6kvoc7iqkdwdwkd34wn3zquc4c4rty3zdvekorxnisgol5q
    ONTO m15nmgowpqsso2gttnu5obvqosnyhwnrzfy4vrxli3n6euv4kgl5ba
{
  ALTER TYPE default::Comic {
      ALTER LINK tags {
          ALTER PROPERTY inverted {
              RENAME TO enabled;
          };
      };
  };
};
