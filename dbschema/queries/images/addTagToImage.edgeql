update ComicImage filter .id = <uuid>$imageId
set {
  tags += (select Tag filter .ref_name = <str>$tagName)
}