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
  const { data: patreonData } = trpc.users.validatePatreonSupporter.useQuery();
  const { data: subscribestarData } = trpc.users.validateSubscribestarSupporter.useQuery();
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

  const subStar = {
    client_id: env.NEXT_PUBLIC_SUBSCRIBESTAR_CLIENT_ID,
    redirect_uri: "https://peril-comics.vercel.app/api/integrations/subscribestar",
    scopes: "subscriber.read+user.read",
  };
  const substarAuthUrl = `https://subscribestar.adult/oauth2/authorize?client_id=${subStar.client_id}&redirect_uri=${subStar.redirect_uri}&response_type=code&scope=${subStar.scopes}`;

  const patreon = {
    client_id: env.NEXT_PUBLIC_PATREON_CLIENT_ID,
    redirect_uri: "https://peril-comics.vercel.app/api/integrations/patreon",
  };
  const patreonAuthUrl = `https://patreon.com/oauth2/authorize?response_type=code&client_id=${patreon.client_id}&redirect_uri=${patreon.redirect_uri}`;

  const gumroad = {
    client_id: env.NEXT_PUBLIC_PATREON_CLIENT_ID,
    redirect_uri: "https://peril-comics.vercel.app/api/integrations/gumroad",
  };
  const gumroadAuthUrl = `https://gumroad.com/oauth/authorize?client_id=${gumroad.client_id}&redirect_uri=${gumroad.redirect_uri}&scope=view_profile`;

  if (!session) return (<div>Sorry, you need to be logged in.</div>);

  return (
    <div className="p-10">
      <p className="underline m-1">{patreonData?.isLinked ? `Linked with Patreon at $${Math.round((patreonData?.supportAmount ?? 0) * 0.01)}` : <Link href={patreonAuthUrl}>Link Patreon</Link>}</p>
      <p className="underline m-1">{subscribestarData?.isLinked ? `Linked with Subscribestar at $${Math.round((subscribestarData?.supportAmount ?? 0) * 0.01)}` : <Link href={substarAuthUrl}>Link Subscribestar</Link>}</p>
      <p className="underline m-1">{subscribestarData?.isLinked ? `Linked with Subscribestar at $${Math.round((subscribestarData?.supportAmount ?? 0) * 0.01)}` : <Link href={gumroadAuthUrl}>Link Gumroad</Link>}</p>
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