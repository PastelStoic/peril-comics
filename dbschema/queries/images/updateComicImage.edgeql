with newTags := array_unpack(<array<str>>$tags)
update ComicImage filter .id = <uuid>$id
set {
  name := <str>$name,
  startPage := <int32>$startPage,
  endPage := <int32>$endPage,
  layer := 1,
  tags := (select Tag filter .ref_name in newTags)
}