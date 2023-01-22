import { useForm, type SubmitHandler } from "react-hook-form"
import { trpc } from "src/utils/trpc";
import type { CloudflareUploadResult } from "src/types/cloudflare";

type ImageType = {
  name: string, 
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

function ImageUploadForm() {
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
        name: data.name ?? resultData.result.filename,
        id,
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
      <label htmlFor="name">Image name</label>
      <input className="m-1 p-1 rounded-md text-black" {...register('name', {required: true})} /> <br/>
      <button className="m-1 p-1 cursor-pointer outline rounded-md" type="submit">Upload</button>
    </form>
    </>
  );
}

export default function ImageMain() {
  const { data: images } = trpc.images.getUnassignedImages.useQuery({});

  return (
  <>
  <p>List of existing images with pagination, also searchable</p>
  <p>Each image can have its name edited? maybe</p>
  {images && images.map(i => (
    <div key={i.id}>
      <p>Image preview here</p>
      <p>{i.image_name}</p>
    </div>
  ))}
  <p>Upload new</p>
  <ImageUploadForm />
  </>)
}