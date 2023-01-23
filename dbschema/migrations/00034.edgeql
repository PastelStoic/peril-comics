CREATE MIGRATION m14ganjhmc2yxigvppiinlovtsgyl47eorbquv2iqg523byhqrcdta
    ONTO m1kcq4p7tpa36i6cmio622kssk2jq5ad2rpot6eo42k35cemxqzhka
{
  ALTER TYPE default::Account {
      DROP PROPERTY userId;
  };
  ALTER TYPE default::Session {
      DROP PROPERTY userId;
  };
};
