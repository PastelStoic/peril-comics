import { useState } from 'react';
import AsyncTagSelect from 'src/components/searchBars/asyncTagSearch';
import PageSelector from 'src/components/pageSelector';

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
  tags: {
    display_name: string,
    ref_name: string,
    inverted: boolean,
  }[],
}
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
      id: "",
      name: "image 1",
      layer: 0,
      page: 1,
      tags: [
        {
          display_name: "Opacity",
          ref_name: "opacity",
          inverted: false,
        },
        {
          display_name: "Underwear",
          ref_name: "underwear",
          inverted: false,
        },
      ],
    },
  ],
};

// a way for people to pick an image from a list. Previews would be tricky - maybe just a name?
function ImageSelector() {
  return (
    <>
    </>
  )
}

// should the remove button go in the big editor?
function ImageEditor(props: {image: Image}) {
  const img = props.image;

  function toggleTagInversion(tagName: string, inverted: boolean) {
    console.log(`Tag ${tagName} for image ${img.name} has been set to inverted: ${inverted}`);
  }
  function removeTag(tagName: string) {
    if (tagName.length === 0) return;
    console.log(`Tag ${tagName} for image id ${img.name} has been removed.`);
  }
  function addTag(tagName: string) {
    if (tagName.length === 0) return;
    console.log(`Tag ${tagName} for image id ${img.name} has been added.`);
  }
  function removeImage() {
    console.log(`Removing image ${img.name} from comic.`);
  }

  return (
    <>
    <p>Image goes here</p>
    <p>{img.name}</p>
    <p>{img.layer}</p>
    {img.tags.map(t => (
      <div key={t.ref_name} className="border-white border-2">
        <p>{t.display_name}</p>
        <input type="checkbox" onChange={(event) => toggleTagInversion(t.ref_name, event.target.checked)} defaultChecked={t.inverted}/><span>Inverted</span>
        <button onClick={() => removeTag(t.ref_name)}>Remove</button>
      </div>
    ))}
    <p>Add tag</p>
    <AsyncTagSelect onChange={(newVal) => addTag(newVal?.value ?? "")} />
    <button onClick={removeImage}>Remove from comic</button>
    </>
  );
}

export default function ComicEditor() {
  // function to edit title and description
  // add and remove tags, and toggle default for each
  // replace/add thumnbnail
  // toggle for public
  const [ page, setPage ] = useState(1);
  function updateTitle(title: string) {
    console.log(`Setting comic ${comicData.id} to title ${title}`);
  }
  function updateDescription(description: string) {
    console.log(`Setting comic ${comicData.id} to title ${description}`);
  }

  return (
    <>
    <p>Title</p>
    <input type="text" minLength={3} onChange={(event) => updateTitle(event.target.value)} />
    <p>Description</p>
    <input type="text" minLength={3} onChange={(event) => updateDescription(event.target.value)} />
    <p>Thumbnail</p>
    <p>Preview of the page?</p>
    {comicData.images.filter(i => i.page === page).map(i => <div key={i.name}><ImageEditor image={i} /></div>)}
    <PageSelector totalPages={1} currentPage={page} onPageSet={setPage} />
    <p>Toggle to make public or private</p>
    </>
  );
}