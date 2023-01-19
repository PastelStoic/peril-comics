// build list of all images, paginated and searchable
// can also filter those that are in a particular comic, or not in any comic
// each has a title, a date uploaded, and a button to delete it from the system.
// if the image is part of a comic, the delete will fail
// there will also be a link to the "upload new" page 
// is this needed? might it not be better to have uploads/deletes be directly part of the comic editor page? 

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form"
import { trpc } from "src/utils/trpc";
import type { CloudflareUploadResult } from "src/types/cloudflare";

type ImageType = {
  name: string,
  files: FileList,
}

async function getCloudflareUploadUrl(uploadURL: string, formData: FormData): Promise<CloudflareUploadResult | null> {
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

export default function UploadImage() {
  const [ resultText, changeResultText ] = useState('');
  const getUploadUrl = trpc.images.getUploadUrl.useMutation();
  const uploadImageMutation = trpc.images.uploadImage.useMutation();
  const { register, handleSubmit, reset } = useForm<ImageType>();

  const onSubmit: SubmitHandler<ImageType> = async data => {
    const uploadURLResult = await getUploadUrl.mutateAsync();
    const uploadURL = uploadURLResult?.result?.uploadURL;
    if (!uploadURL) return; // give proper error message
    const imageFile = data.files.item(0);
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const uploadResult = await fetch(uploadURL, {
        method: "POST",
        body: formData,
      });
      const resultData = await uploadResult.json() as CloudflareUploadResult;
      if (resultData.result) {
        const id = resultData.result.id;
        const result = await uploadImageMutation.mutateAsync({
          name: data.name ?? resultData.result.filename,
          id,
        });
        if (result) {
          changeResultText("Upload successful!");
          reset();
        } else changeResultText("Sorry, there was an error with your upload.");
      }
    } catch (error) {
      console.error(error);
      changeResultText("Sorry, there was an error with your upload.");
    }
    // redirect
  }

  return (<>
    <form className="m-2" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="files">Image</label>
      <input className="m-1" type="file" accept="image/*" {...register("files", {required: true})} /> <br/>
      <label htmlFor="name">Image name</label>
      <input className="m-1 p-1 rounded-md text-black" {...register('name', {required: true})} /> <br/>
      <button className="m-1 p-1 cursor-pointer outline rounded-md" type="submit">Upload </button>
    </form>
    <p>{resultText}</p>
  </>)
}