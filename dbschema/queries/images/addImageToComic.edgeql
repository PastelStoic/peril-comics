with usedImage := (select (
  insert CloudflareImage {
    image_id := <str>$cloudflare_id,
    image_name := <str>$image_name,
  } unless conflict on .image_name else (
    update CloudflareImage set {
      image_id := <str>$id,
    })
  ))
insert ComicImage {
  name := <str>$image_name,
  image := usedImage,
  startPage := <int32>$page,
  endPage := <int32>$page,
  layer := 1,
  comic := (select Comic filter .id = <uuid>$comicId),
}