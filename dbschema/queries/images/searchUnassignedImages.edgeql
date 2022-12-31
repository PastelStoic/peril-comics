with searchText := <optional str>$text
select CloudflareImage {
  id,
  image_name,
  image_id,
} filter (not exists .<image[is ComicImage]) and 
(not exists .<thumbnail[is Comic]) and
((.image_name ilike '%' ++ searchText ++ '%') if exists searchText else true)