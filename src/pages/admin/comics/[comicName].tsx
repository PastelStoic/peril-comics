/*
A list of all the images in a comic. 
Each has an editor to change their name and tags, each tag also having an "inverted" option.
They also have "delete" buttons. 
At the bottom is an "upload new image" option.

Maybe make every image have its own form?
 */

type Image = {
  name: string,
  layer: number,
}

function ImageEditor(props: {image: Image}) {
  const img = props.image;
  // function to update info

  return (
    <>
      <p>Image goes here</p>
      <p>{img.name}</p>
      <p>{img.layer}</p>
    </>
  );
}

export default function ComicEditor() {
  const comicData = 
  {
    id: "id",
    title: "comic",
    description: "Tifa is ambushed by a strange predatory monster.",
    is_private: false,
    tags: [
      {
        display_name: "Opacity",
        ref_name: "opacity",
        is_hidden: true,
        enabled: true,
      },
      {
        display_name: "Underwear",
        ref_name: "underwear",
        is_hidden: true,
        enabled: true,
      },
    ],
    images: [
      {
        name: "image 1",
        layer: 0,
        tags: [
          {
            display_name: "Opacity",
            ref_name: "opacity",
            inverted: false,
          },
          {
            display_name: "Underwear",
            ref_name: "underwear",
            is_hidden: false,
          },
        ],
      },
    ],
  };

  return (
    <>
    <p>{comicData.title}</p>
    <p>Thumbnail</p>
    <p>Preview of the page?</p>
    <p>List of all images in the page, each of them with data to edit</p>
    {comicData.images.map(i => <div key={i.name}><ImageEditor image={i} /></div>)}
    <p>Page selectors go here</p>
    <p>Toggle to make public or private</p>
    </>
  );
}