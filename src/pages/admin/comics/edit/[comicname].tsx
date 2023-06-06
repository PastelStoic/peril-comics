import { useRouter } from 'next/router';
import { useState } from 'react';
import { ImageSearchBar, TagSearchBar } from 'src/components/asyncsearchbar';
import PageSelector from 'src/components/pageSelector';
import { trpc } from 'src/utils/trpc';
import type { RouterOutputs } from 'src/utils/trpc';
import Image from 'next/image';
import { env } from 'src/env/client.mjs';
import { useForm, type SubmitHandler } from "react-hook-form"
import type { CloudflareUploadResult } from "src/types/cloudflare";

type ImageType = {
  files: FileList,
}

async function uploadCloudflareImage(uploadURL: string, formData: FormData): Promise<CloudflareUploadResult | null> {
  try {
    const uploadResult = await fetch(uploadURL, {
      method: "POST",
      body: formData,
    });
    return await uploadResult.json() as CloudflareUploadResult;
  } catch (error) {
    console.log(error);
    return null;
  }
}

function ImageUploadForm(props: {comicId: string}) {
  const getUploadUrl = trpc.images.getUploadUrl.useMutation();
  const uploadImageMutation = trpc.images.uploadImage.useMutation();
  const { register, handleSubmit, reset } = useForm<ImageType>();

  const onSubmit: SubmitHandler<ImageType> = async data => {
    const uploadURLResult = await getUploadUrl.mutateAsync();
    const uploadURL = uploadURLResult?.result?.uploadURL;
    if (!uploadURL) {
      alert("Failed to obtain upload code.");
      return;
    }
    const imageFile = data.files.item(0);
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("file", imageFile);
    
    const resultData = await uploadCloudflareImage(uploadURL, formData);
    if (resultData?.result) {
      const id = resultData.result.id;
      const result = await uploadImageMutation.mutateAsync({
        name: resultData.result.filename,
        id,
        comicId: props.comicId,
      });
      if (result) {
        alert("Upload successful!");
        reset();
      } else alert("Sorry, there was an error with your upload.");
    } else alert("Sorry, there was an error with your upload.");
  }  
  
  return (
    <>
    <form className="m-2" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="files">Image</label>
      <input className="m-1" type="file" accept="image/*" {...register("files", {required: true})} /> <br/>
      <button className="m-1 p-1 cursor-pointer outline rounded-md" type="submit">Upload</button>
    </form>
    </>
  );
}

type Image = NonNullable<RouterOutputs['comics']['getByTitle']>['images'][0];

// should the remove button go in the big editor?
function ImageEditor(props: {image: Image}) {
  const img = props.image;
  const [ tags, setTags ] = useState(img.tags);
  const changeLayerMutation = trpc.images.changeImageLayer.useMutation();
  const changePagesMutation = trpc.images.changeImagePages.useMutation();
  const removeTagMutation = trpc.images.removeTagFromImage.useMutation();
  const addTagMutation = trpc.images.addTagToImage.useMutation();

  function toggleTagInversion(tagName: string, inverted: boolean) {
    console.log(`Tag ${tagName} for image ${img.name} has been set to inverted: ${inverted}`);
  }

  function removeTag(tagName: string) {
    if (tagName.length === 0) return;
    setTags(tags.filter(t => t.ref_name !== tagName));
    removeTagMutation.mutate({imageId: img.id, tagName});
    console.log(`Tag ${tagName} for image id ${img.name} has been removed.`);
  }

  function addTag(tag: { label: string, value: string } | null) {
    if (!tag) return;
    tags.push({display_name: tag.label, ref_name: tag.value, inverted: false});
    setTags([...tags]);
    addTagMutation.mutate({imageId: img.id, tagName: tag.value});
    console.log(`Tag ${tag.label} for image id ${img.name} has been added.`);
  }

  function changeLayer(layer: number) {
    if (isNaN(layer) || layer < 0) return;
    changeLayerMutation.mutate({imageId: img.id, layer});
    console.log(`Setting image ${img.name} to layer ${layer}`);
  }

  function changeStartPage(page: number) {
    if (isNaN(page) || page < 1 || page > img.endPage) return;
    changePagesMutation.mutate({imageId: img.id, startPage: page, endPage: img.endPage});
    console.log(`Setting image ${img.name} to start page ${page}`);
  }

  function changeEndPage(page: number) {
    if (isNaN(page) || page < 1 || page < img.startPage) return;
    changePagesMutation.mutate({imageId: img.id, startPage: img.startPage, endPage: page});
    console.log(`Setting image ${img.name} to end page ${page}`);
  }

  return (
    <>
    <Image 
      src={`https://imagedelivery.net/${env.NEXT_PUBLIC_CLOUDFLARE_IMAGEHASH}/${img.image.image_id}/public`}
      blurDataURL={`https://imagedelivery.net/${env.NEXT_PUBLIC_CLOUDFLARE_IMAGEHASH}/${img.image.image_id}/thumbnail`} 
      alt="Image"/>
    <p>{img.name}</p>
    <input id='layer' type="number" min={0} className='text-black rounded-md p-1' defaultValue={img.layer} onChange={(event) => changeLayer(Number(event.target.value))} />
    <label htmlFor="layer">Layer</label>
    <br/>
    <input id='startpage' type="number" min={1} className='text-black rounded-md p-1' defaultValue={img.startPage} onChange={(event) => changeStartPage(Number(event.target.value))} />
    <label htmlFor="startpage">Start page</label>
    <br/>
    <input id='endpage' type="number" min={1} className='text-black rounded-md p-1' defaultValue={img.endPage} onChange={(event) => changeEndPage(Number(event.target.value))} />
    <label htmlFor="endpage">End page</label>
    <br/>
    {tags.map(t => (
      <div key={t.ref_name} className="border-white border-2">
        <p>{t.display_name}</p>
        <input type="checkbox" onChange={(event) => toggleTagInversion(t.ref_name, event.target.checked)} defaultChecked={t.inverted}/><span>Inverted</span>
        <br />
        <button onClick={() => removeTag(t.ref_name)}>Remove</button>
      </div>
    ))}
    <p>Add tag</p>
    <TagSearchBar onChange={(newVal) => addTag(newVal)} />
    </>
  );
}

export default function ComicEditor() {
  const [ page, setPage ] = useState(1);
  const router = useRouter();
  const comicName = router.query.comicname;

  if (!comicName) return (<>Sorry, we weren&apos;t able to access the comic title.</>);

  const { data: comic, error } = trpc.comics.getByTitle.useQuery({title: comicName.toString()});
  const removeImageMutation = trpc.images.deleteImage.useMutation();
  const addImageMutation = trpc.images.addImageToComic.useMutation();
  const updateComicMutation = trpc.comics.updateComic.useMutation();
  
  function updateTitle(title: string) {
    if (!comic) return;
    updateComicMutation.mutate({id: comic.id, title, description: comic.description, private: comic.is_private});
    console.log(`Setting comic ${comic?.id} to title ${title}`);
  }

  function updateDescription(description: string) {
    if (!comic) return;
    updateComicMutation.mutate({id: comic.id, title: comic.title, description, private: comic.is_private});
    console.log(`Setting comic ${comic?.id} to description ${description}`);
  }

  function toggleComicPrivate(is_private: boolean) {
    if (!comic) return;
    updateComicMutation.mutate({id: comic.id, title: comic.title, description: comic.description, private: is_private});
    console.log(`Setting comic ${comic?.title} privacy to ${is_private}`);
  }

  function removeImage(id: string) {
    removeImageMutation.mutate({id});
    router.reload();
    console.log(`Removing image id ${id} from comic.`);
  }

  function addImage(imageId?: string) {
    if (!comic || !imageId) return;
    addImageMutation.mutate({comicId: comic.id, imageId, page});
    router.reload();
  }

  if (error) return <>{error.message}</>;
  if (!comic) return <>Loading...</>;

  return (
    <>
    <p>Title</p>
    <input type="text" className='text-black rounded-md p-1' defaultValue={comic.title} onChange={(event) => updateTitle(event.target.value)} />
    <p>Description</p>
    <textarea className='text-black rounded-md p-1' defaultValue={comic.description} onChange={(event) => updateDescription(event.target.value)} />
    <p>Preview of the page?</p>
    <div className='grid-cols-1 md:grid-cols-4'>
      {comic.images.filter(i => i.startPage <= page && i.endPage >= page).map(i => <div className='w-96 outline-dashed p-1 m-3' key={i.name}>
        <ImageEditor image={i} />
        <button onClick={() => removeImage(i.id)}>Remove from comic</button>
        </div>)
      }
    </div>
    <PageSelector totalPages={comic.pages} currentPage={page} onPageSet={setPage} />
    <input type="checkbox" onChange={(event) => toggleComicPrivate(event.target.checked)} defaultChecked={comic.is_private}/><span>Inverted</span>
    <ImageUploadForm comicId={comic.id}/>
    </>
  );
}