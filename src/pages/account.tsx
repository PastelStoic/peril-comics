import { useSession } from "next-auth/react";
import Link from "next/link";
import { env } from "src/env/client.mjs";
import { trpc } from "src/utils/trpc";
import { useForm, type SubmitHandler } from "react-hook-form"
import { useState } from "react";

type CodeSubmitForm = {
  code: string,
}

export default function Account() {
  const { data: session } = useSession();
  const [ codeUploadResult, setCodeUploadResult ] = useState('');
  const { data: gumroadData } = trpc.users.validateGumroadSupporter.useQuery();
  const codeUpload = trpc.users.checkGuestCode.useMutation();
  const { register, handleSubmit } = useForm<CodeSubmitForm>();

  const onSubmit: SubmitHandler<CodeSubmitForm> = async data => {
    if (!session?.user) {
      setCodeUploadResult("Sorry, your user data seems to be missing. If you're logged in, try logging out and back in.");
      return;
    }
    
    const result = await codeUpload.mutateAsync(data);
    if (result) {
      setCodeUploadResult('Your guest code has been accepted!');
    } else if (result === false) {
      setCodeUploadResult("Sorry, that code is invalid.");
    } else {
      setCodeUploadResult("Sorry, your request could not be processed.");
    }
  }

  const gumroad = {
    client_id: env.NEXT_PUBLIC_GUMROAD_CLIENT_ID,
    redirect_uri: "https://peril-comics.vercel.app/api/integrations/gumroad",
  };
  const gumroadAuthUrl = `https://gumroad.com/oauth/authorize?client_id=${gumroad.client_id}&redirect_uri=${gumroad.redirect_uri}&scope=view_profile`;

  if (!session) return (<div>Sorry, you need to be logged in.</div>);

  return (
    <div className="p-10">
      <p className="underline m-1">{gumroadData?.isLinked ? `Linked with Gumroad at $${Math.round((gumroadData?.supportAmount ?? 0) * 0.01)}` : <Link href={gumroadAuthUrl}>Link Gumroad</Link>}</p>
      <form className="outline rounded-md w-full md:w-1/3" onSubmit={handleSubmit(onSubmit)}>
        <label className="m-1" htmlFor="code">Enter guest code</label>
        <br />
        <input className="bg-slate-600 rounded-md indent-2 m-1" {...register("code", {required: true})}/>
        <br />
        <input className="rounded-md bg-white text-black m-1" type="submit" />
        <p>{codeUploadResult}</p>
      </form>
    </div>
  );
}