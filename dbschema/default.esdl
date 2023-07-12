module default {
  type Comic {
    multi link images := (.<comic[is ComicImage]);
    multi link tags -> Tag {
        property enabled -> bool {
            default := false;
        };
    };
    optional link thumbnail -> CloudflareImage;
    required property description -> str;
    required property is_private -> bool {
        default := true;
    };
    required property pages := ((max(.images.endPage) ?? 0));
    required property published_date -> datetime {
        default := (datetime_of_transaction());
    };
    required property title -> str;
    multi link states -> ComicState;
    required property is_free -> bool {
      default := false;
    }
  };

  type ComicState {
    required property name -> str;
    multi property tag_states -> tuple<str, bool>;
  }

  type ComicImage {
    required property name -> str;
    required link image -> CloudflareImage;
    required property layer -> int32;
    required property startPage -> int32;
    required property endPage -> int32;
    multi link tags -> Tag {
      property inverted -> bool {
        default := false;
      }
    }
    multi property display_versions -> str;
    link comic -> Comic;
  }

  type Tag {
    required property display_name -> str;
    required property ref_name -> str;
    required property is_hidden -> bool {
      default := false;
    }
    required property creates_button -> bool {
      default := true;
    }
  }

  type CloudflareImage {
    required property image_id -> str {
      constraint exclusive;
    }
    required property image_name -> str {
      constraint exclusive;
    }
  }

  function getTagsForComic(comic: Comic) -> set of Tag 
  using (
    select distinct (for img in comic.images union (img.tags))
    );
}
