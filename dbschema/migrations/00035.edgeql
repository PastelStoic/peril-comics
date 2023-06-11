CREATE MIGRATION m1hip5ushmf6p37lg6bipcne2rb3ddwo22l7gtl3sepu7jprm3vwja
    ONTO m14ganjhmc2yxigvppiinlovtsgyl47eorbquv2iqg523byhqrcdta
{
  CREATE TYPE default::ComicState {
      CREATE REQUIRED PROPERTY name -> std::str;
      CREATE MULTI PROPERTY tag_states -> tuple<std::str, std::bool>;
  };
  ALTER TYPE default::Comic {
      CREATE MULTI LINK states -> default::ComicState;
  };
};
