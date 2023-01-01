CREATE MIGRATION m1ctypurzx3lyol75feibmufijbmnr2mpe37xcafj75ii3ys5md2vq
    ONTO initial
{
  CREATE TYPE default::Account {
      CREATE REQUIRED PROPERTY access_token -> std::str;
      CREATE REQUIRED PROPERTY account_type -> std::str;
      CREATE REQUIRED PROPERTY expires_at -> std::int32;
      CREATE PROPERTY id_token -> std::str;
      CREATE REQUIRED PROPERTY provider -> std::str;
      CREATE REQUIRED PROPERTY provider_account_id -> std::str;
      CREATE REQUIRED PROPERTY refresh_token -> std::str;
      CREATE PROPERTY scope -> std::str;
      CREATE PROPERTY session_state -> std::str;
      CREATE PROPERTY token_type -> std::str;
  };
  CREATE TYPE default::AccountSession {
      CREATE MULTI LINK accounts -> default::Account {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE MULTI LINK sessions -> default::AccountSession {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY expires_at -> std::datetime;
      CREATE PROPERTY image -> std::str;
      CREATE REQUIRED PROPERTY session_token -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::Tag {
      CREATE REQUIRED PROPERTY display_name -> std::str;
      CREATE REQUIRED PROPERTY ref_name -> std::str;
  };
  CREATE TYPE default::ComicImage {
      CREATE REQUIRED PROPERTY endPage -> std::int32;
      CREATE MULTI LINK tags -> default::Tag;
      CREATE REQUIRED PROPERTY layer -> std::int32;
      CREATE REQUIRED PROPERTY name -> std::str;
      CREATE REQUIRED PROPERTY startPage -> std::int32;
      CREATE REQUIRED PROPERTY url -> std::str;
  };
  CREATE TYPE default::Comic {
      CREATE MULTI LINK images -> default::ComicImage;
      CREATE PROPERTY pages := (std::max(.images.endPage));
      CREATE MULTI LINK tags -> default::Tag;
      CREATE REQUIRED PROPERTY description -> std::str;
      CREATE REQUIRED PROPERTY title -> std::str;
  };
  CREATE TYPE default::VerificationToken {
      CREATE REQUIRED PROPERTY expires_at -> std::datetime;
      CREATE REQUIRED PROPERTY identifier -> std::str;
      CREATE REQUIRED PROPERTY token -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
