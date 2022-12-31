CREATE MIGRATION m1nr6pvbgvdmh75nc7f74x4m6644ceqtxht735tdd6ztirv4a45xwq
    ONTO initial
{
  CREATE TYPE default::CloudflareImage {
      CREATE REQUIRED PROPERTY image_id -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY image_name -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::Tag {
      CREATE REQUIRED PROPERTY display_name -> std::str;
      CREATE REQUIRED PROPERTY is_hidden -> std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY ref_name -> std::str;
  };
  CREATE TYPE default::Comic {
      CREATE OPTIONAL LINK thumbnail -> default::CloudflareImage;
      CREATE MULTI LINK tags -> default::Tag {
          CREATE PROPERTY enabled -> std::bool {
              SET default := false;
          };
      };
      CREATE REQUIRED PROPERTY description -> std::str;
      CREATE REQUIRED PROPERTY is_private -> std::bool {
          SET default := true;
      };
      CREATE REQUIRED PROPERTY published_date -> std::datetime {
          SET default := (std::datetime_of_transaction());
      };
      CREATE REQUIRED PROPERTY title -> std::str;
  };
  CREATE TYPE default::ComicImage {
      CREATE LINK comic -> default::Comic;
      CREATE MULTI LINK tags -> default::Tag {
          CREATE PROPERTY inverted -> std::bool {
              SET default := false;
          };
      };
      CREATE REQUIRED LINK image -> default::CloudflareImage;
      CREATE REQUIRED PROPERTY endPage -> std::int32;
      CREATE REQUIRED PROPERTY layer -> std::int32;
      CREATE REQUIRED PROPERTY name -> std::str;
      CREATE REQUIRED PROPERTY startPage -> std::int32;
  };
  ALTER TYPE default::Comic {
      CREATE MULTI LINK images := (.<comic[IS default::ComicImage]);
      CREATE REQUIRED PROPERTY pages := ((std::max(.images.endPage) ?? 0));
  };
  CREATE FUNCTION default::getTagsForComic(comic: default::Comic) -> SET OF default::Tag USING (SELECT
      DISTINCT ((FOR img IN comic.images
      UNION 
          img.tags))
  );
  CREATE TYPE default::Account {
      CREATE REQUIRED PROPERTY provider -> std::str;
      CREATE REQUIRED PROPERTY providerAccountId -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE CONSTRAINT std::exclusive ON ((.provider, .providerAccountId));
      CREATE PROPERTY access_token -> std::str;
      CREATE PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY expires_at -> std::int64;
      CREATE PROPERTY id_token -> std::str;
      CREATE PROPERTY refresh_token -> std::str;
      CREATE PROPERTY scope -> std::str;
      CREATE PROPERTY session_state -> std::str;
      CREATE PROPERTY token_type -> std::str;
      CREATE REQUIRED PROPERTY type -> std::str;
  };
  CREATE TYPE default::User {
      CREATE PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY email -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY emailVerified -> std::datetime;
      CREATE PROPERTY image -> std::str;
      CREATE PROPERTY name -> std::str;
      CREATE REQUIRED PROPERTY role -> std::str {
          SET default := 'user';
      };
  };
  ALTER TYPE default::Account {
      CREATE REQUIRED LINK user -> default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY userId := (<std::str>.user.id);
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK accounts := (.<user[IS default::Account]);
  };
  CREATE TYPE default::Session {
      CREATE REQUIRED LINK user -> default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED PROPERTY userId := (<std::str>.user.id);
      CREATE PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY expires -> std::datetime;
      CREATE REQUIRED PROPERTY sessionToken -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK sessions := (.<user[IS default::Session]);
  };
  CREATE TYPE default::VerificationToken {
      CREATE REQUIRED PROPERTY identifier -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY token -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE CONSTRAINT std::exclusive ON ((.identifier, .token));
      CREATE PROPERTY createdAt -> std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY expires -> std::datetime;
  };
};
