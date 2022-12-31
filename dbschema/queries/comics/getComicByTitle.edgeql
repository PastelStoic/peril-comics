select Comic {
  id,
  title,
  description,
  pages,
  is_private,
  tags: {
    display_name,
    ref_name,
    enabled := @enabled ?? true,
  },
  images: {
    id,
    image: {
      image_id,
    },
    name,
    layer,
    startPage,
    endPage,
    tags: {
      display_name,
      ref_name,
      inverted := @inverted ?? false,
    },
  } order by .layer,

} filter .title ilike <str>$title limit 1;