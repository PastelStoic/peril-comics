CREATE MIGRATION m1eipai6smrmeevg2a44l3yeme55f2g3wmvb2xd23w66dm5sqnvhlq
    ONTO m1cer5xrkmemzmfj4xtt4pbm5lxucoluvxjf5zmf5nf5qspvidtraa
{
  ALTER TYPE default::ComicImage {
      CREATE PROPERTY bucket_key -> std::str;
  };
};
