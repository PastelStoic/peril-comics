CREATE MIGRATION m1k7q4t34pfemseqjybrnkzpt43bdk4pqzcn5myj6xszfhgy5gu4aa
    ONTO m14pwum6kvoc7iqkdwdwkd34wn3zquc4c4rty3zdvekorxnisgol5q
{
  CREATE FUNCTION default::getTagsForComic(comic: default::Comic) -> SET OF default::Tag USING (SELECT
      DISTINCT ((FOR img IN comic.images
      UNION 
          img.tags))
  );
};
