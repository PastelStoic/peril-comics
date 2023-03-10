import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "src/styles/Home.module.css";
import type { RouterOutputs } from "src/utils/trpc";
import { env } from 'src/env/client.mjs';

const layerVarients = {
  enabled: {opacity: 1},
  disabled: {opacity: 0}
}

type Comic = RouterOutputs["comics"]["getByTitle"];
type ReaderProps = {
  comicData: Comic
}

type Image = NonNullable<Comic>["images"][0];

function ComicReader({comicData} : ReaderProps) {
  const [page, setPage] = useState(1);
  const [comictags, setTags] = useState(new Map<string, boolean>(comicData?.tags.map(t => [t.ref_name, t.enabled])));
  if (!comicData) return <div>An error occured loading data.</div>;

  function isImageEnabled(image: Image) {
    // loops through every tag, looking for a matching value in comictags 
    return image.tags.every(t => {
      const setting = comictags.get(t.ref_name) ?? false;
      if (t.inverted) return !setting;
      return setting;
    });
  }

  function imagesThisLayer() {
    if (!comicData?.images) return [];
    return comicData.images
      .filter(i => page >= i.startPage && page <= i.endPage)
      .sort((a, b) => a.layer - b.layer);
  }

  function toggleTag(tagname: string) {
    const enabled = comictags.get(tagname) ?? true;
    comictags.set(tagname, !enabled);
    setTags(new Map(comictags));
  }

  return (
    <>
    <p className="italic">Hold ctrl while scrolling to zoom.</p>
    <div className="sticky top-0 z-10">
      {comicData.tags.map(t => (<button 
      className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-white text-black" 
      key={t.ref_name} 
      onClick={() => toggleTag(t.ref_name)}>
        {t.display_name}</button>))
      }
    </div>
    <div className={styles.container}>
      <div className={styles.overlapGrid}>
        {imagesThisLayer().map(i => (
            <motion.div
              key={i.layer}
              variants={layerVarients}
              initial={isImageEnabled(i) ? "enabled" : "disabled"}
              animate={isImageEnabled(i) ? "enabled" : "disabled"}
              transition={{ duration: 1 }}
            >
              {i.image && <Image
                src={`https://imagedelivery.net/${env.NEXT_PUBLIC_CLOUDFLARE_IMAGEHASH}/${i.image.image_id}/public`}
                blurDataURL={`https://imagedelivery.net/${env.NEXT_PUBLIC_CLOUDFLARE_IMAGEHASH}/${i.image.image_id}/thumbnail`}
                placeholder="blur"
                alt="comic page"
                width={1000}
                height={2000}
              />}
            </motion.div>
          ))}
      </div>
    </div>
    {page > 1 && <button onClick={() => setPage(page - 1)} className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-white text-black">Back</button>}
    {page < comicData.pages && <button onClick={() => setPage(page + 1)} className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-white text-black">Next</button>}
    </>
  );
}

export default ComicReader;