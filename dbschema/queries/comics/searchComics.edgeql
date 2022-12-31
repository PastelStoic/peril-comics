select Comic {
  id,
  title,
  description,
  thumbnail: {
    image_id,
  },
  pages,
  tags: {
    display_name,
    is_hidden,
  },
} filter .title ilike <str>$searchText and (<bool>$includeHidden or not .is_private)