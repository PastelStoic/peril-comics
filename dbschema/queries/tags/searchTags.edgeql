select Tag {
  display_name,
  ref_name,
} filter ((<optional str>$name ilike .display_name) if exists <optional str>$name else true)