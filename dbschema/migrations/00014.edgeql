CREATE MIGRATION m13kbdycpxifi4unfypscmnjlkf2q2r6oauerzyqljo7scydxyxacq
    ONTO m12tlsfjpl3uafe2gfqlr7n3swph4bywcuucvlrwaerfcoq7yttubq
{
  ALTER TYPE default::ComicImage {
      CREATE PROPERTY bucket_key -> std::str;
      ALTER PROPERTY url {
          RESET OPTIONALITY;
      };
  };
};
