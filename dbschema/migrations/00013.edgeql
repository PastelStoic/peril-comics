CREATE MIGRATION m12tlsfjpl3uafe2gfqlr7n3swph4bywcuucvlrwaerfcoq7yttubq
    ONTO m1p4q4nfmewu2dxowoncvcl7qflz3rberlcuolo4plmohqjuqvkvua
{
  ALTER TYPE default::Comic {
      ALTER LINK images {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::ComicImage {
      CREATE LINK comic := (.<images[IS default::Comic]);
  };
};
