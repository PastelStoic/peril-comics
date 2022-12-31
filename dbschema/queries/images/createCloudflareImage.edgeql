insert CloudflareImage {
  image_id := <str>$id,
  image_name := <str>$name,
} 
unless conflict on .image_name 
else (
  update CloudflareImage set {
    image_id := <str>$id,
  }
)