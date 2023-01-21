select Tag {
  display_name,
  ref_name,
} filter (((.display_name ilike '%' ++ <optional str>$name ++ '%')) if exists <optional str>$name else true)
limit 5
# order by frequency of use?