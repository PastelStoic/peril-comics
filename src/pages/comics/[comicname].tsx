import { useRouter } from "next/router";
import ComicReader from "src/components/comicreader";
import { trpc } from "src/utils/trpc";
import { useSession } from "next-auth/react";
import Link from "next/link";

const ComicPage = () => {
  const router = useRouter();
  const { data: comic, isLoading, error } = trpc.comics.getByTitle.useQuery({title: router.query.comicname?.toString() ?? "notitle"});
  const updateComic = trpc.comics.updateComic.useMutation();
  const { data: session } = useSession();

  function changePage(newPage: number) {
    router.push({
      pathname: `/comics/${router.query.comicname}/`,
      query: {
        page: newPage,
      }
    })
  }

  function getPage() {
    return Number(router.query.page) ?? 1;
  }

  function togglePrivate() {
    if (!comic) return;
    updateComic.mutate({
      id: comic.id,
      title: comic.title,
      description: comic.description,
      private: !comic.is_private,
    });
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!comic) return <div>Sorry, that comic could not be found.</div>;
  if (!session) return <div><p>Please log in to view content.</p></div>;

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-3xl pt-4">{comic.title}</h1>
      <p className="pb-2">{comic.description}</p>
      <div className="w-128">
          <ComicReader comicData={comic} currentPage={getPage()} />
          {getPage() > 1 && <button onClick={() => changePage(getPage() - 1)} className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-white text-black">Back</button>}
          {getPage() < comic.pages && <button onClick={() => changePage(getPage() + 1)} className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-white text-black">Next</button>}
          {session.user?.role === "admin" && 
          <div>
            <Link href={`/admin/comics/${router.query.comicname}`}><p className="border-2 border-white rounded-md m-2 cursor-pointer">Edit this comic</p></Link>
            <button className="border-2 border-white rounded-md m-2 cursor-pointer" onClick={togglePrivate}>{comic.is_private ? "Make Public" : "Make Private"}</button>
          </div>
          }
        </div>
    </main>
  );
}

export default ComicPage;