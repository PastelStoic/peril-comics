import Image from "next/image";
import Link from "next/link"
import { env } from 'src/env/client.mjs';
import type { RouterOutputs } from "src/utils/trpc";
import type Unpacked from "src/types/unpacked";

type ComicCardData = Unpacked<RouterOutputs["comics"]["search"]>;

type ReaderProps = {
  comicData: ComicCardData,
  className?: string,
}

// lock icon to show which ones the user owns?
function ComicCard({comicData, className} : ReaderProps) {
  if (!comicData) return (<div></div>);
  return (
    <div className={`p-2 flex flex-col m-2 ` + className}>
      {comicData.thumbnail && 
        <Image 
        className="object-contain rounded-lg self-center"
        src={`https://imagedelivery.net/${env.NEXT_PUBLIC_CLOUDFLARE_IMAGEHASH}/${comicData.thumbnail.image_id}/thumbnail`} 
        alt="Thumbnail" 
        height={200} 
        width={200}
        />
      }
      <div className="justify-self-end text-center">
        <Link key={comicData.title} href={"/comics/" + comicData.title}>
          <p className="text-xl cursor-pointer underline text-blue-600">{comicData.title}</p>
        </Link>
        <p>{comicData.description}</p>
        <p className="italic text-sm">{comicData?.tags.filter(t => !t.is_hidden).map(t => t.display_name).join(", ")}</p>
      </div>
    </div>
  );
}

export default ComicCard;