import { trpc } from "../utils/trpc";
import ComicCard from "src/components/comiccard";

function Store() {
  const { data: comics, isLoading } = trpc.comics.search.useQuery({});
  if (isLoading) return (<div>Loading comics...</div>);

  return (
    <div className="basis-4/5 m-5 bg-black">
      <h1 className="text-center text-3xl m-2">Browse the latest and greatest peril comics.</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 place-items-center p-4">
        {comics?.map(c => <ComicCard className="w-72 h-80" key={c.title} comicData={c} />)}
      </div>
    </div>
  );
}

export default Store;