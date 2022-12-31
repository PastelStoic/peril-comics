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
} filter (<bool>$includeHidden or not .is_private)