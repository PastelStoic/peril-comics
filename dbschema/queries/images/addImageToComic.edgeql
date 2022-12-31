with usedImage := (select CloudflareImage filter .id = <uuid>$imageId)
insert ComicImage {
  name := usedImage.image_name,
  image := usedImage,
  startPage := <int32>$page,
  endPage := <int32>$page,
  layer := 1,
  comic := (select Comic filter .id = <uuid>$comicId),
}