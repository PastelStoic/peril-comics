CREATE MIGRATION m1booydsxz635fagk5zinuqiuclnttyxhqaruzojlyojvosmemhs4q
    ONTO m1sd5aqaxlnkbaavvzimhou3ukdcvqyhxw4brw426degto7m2zn4va
{
  ALTER TYPE default::ComicImage {
      CREATE MULTI PROPERTY display_versions -> std::str;
  };
};
