import { useState } from "react";
import Image from "next/image";
import styles from "src/styles/Home.module.css";
import type { RouterOutputs } from "src/utils/trpc";
import { env } from 'src/env/client.mjs';

type Comic = RouterOutputs["comics"]["getByTitle"];
type ReaderProps = {
  comicData: Comic,
  currentPage: number,
}

type Image = NonNullable<Comic>["images"][0];

function ComicReader({comicData} : ReaderProps) {
  const [page, setPage] = useState(1);
  const [comicState, setComicState] = useState(comicData.states[0]?.name ?? "");
  const [comictags, setTags] = useState(new Map<string, boolean>(comicData?.tags.map(t => [t.ref_name, (comicData.states[0]?.tag_states.find(s => s[0] == t.ref_name)?.[1] ?? t.enabled)])));
  if (!comicData) return <div>An error occured loading data.</div>;

  function isImageEnabled(image: Image) {
    // loops through every tag, looking for a matching value in comictags 
    return image.tags.every(t => {
      const setting = comictags.get(t.ref_name) ?? false;
      if (t.inverted) return !setting;
      return setting;
    }) && 
    // also check that the comic state is one of the image states
    (image.display_versions.length == 0 || image.display_versions.includes(comicState));
  }

  function imagesThisLayer() {
    if (!comicData?.images) return [];
    return comicData.images
      .filter(i => currentPage >= i.startPage && currentPage <= i.endPage)
      .sort((a, b) => a.layer - b.layer);
  }

  function toggleTag(tagname: string) {
    const enabled = comictags.get(tagname) ?? true;
    comictags.set(tagname, !enabled);
    setTags(new Map(comictags));
  }

  function switchComicState(stateName: string) {
    const newState = comicData.states.find(s => s.name == stateName);
    if (!newState) return;
    newState.tag_states.forEach(t => comictags.set(t[0], t[1]));
    setTags(new Map(comictags));
    setComicState(stateName);
  }

  return (
    <>
    <p className="italic">Hold ctrl while scrolling to zoom.</p>
    <div className="sticky top-0 z-10">
      {comicData.tags.filter(t => t.creates_button).map(t => (<button 
      className={`px-4 py-2 rounded-md border-2 border-zinc-800 text-black ${(comictags.get(t.ref_name) ?? false) ? "bg-white" : "bg-slate-600"}`} 
      key={t.ref_name} 
      onClick={() => toggleTag(t.ref_name)}>
        {t.display_name}</button>))
      }
      {comicData.states.length > 0 && 
      <>
      <label htmlFor="stateselector" className="m-1">Version</label>
      <select id="stateselector" className="m-1 p-1 rounded-md bg-white text-black" onChange={s => switchComicState(s.currentTarget.value)}>
        {comicData.states.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
      </select></>
      }
    </div>
    <div className={styles.container}>
      <div className={styles.overlapGrid}>
        {imagesThisLayer().map(i => (
            <div key={i.id} className={isImageEnabled(i) ? "opacity-100" : "opacity-0"}>{i.image && <Image
                src={`https://imagedelivery.net/${env.NEXT_PUBLIC_CLOUDFLARE_IMAGEHASH}/${i.image.image_id}/public`}
                blurDataURL={`https://imagedelivery.net/${env.NEXT_PUBLIC_CLOUDFLARE_IMAGEHASH}/${i.image.image_id}/thumbnail`}
                placeholder="blur"
                alt="comic page"
                width={1000}
                height={2000}
                className={isImageEnabled(i) ? "opacity-100" : "opacity-0"}
              />}</div>
          ))}
      </div>
    </div>
    </>
  );
}

export default ComicReader;