import Link from "next/link";
import { useState } from "react";
import PageSelector from "src/components/pageSelector";
import { trpc } from "src/utils/trpc";

export default function ComicsMain() {
  const [ currentPage, setCurrentPage ] = useState(1);
  const { data, error } = trpc.comics.search.useQuery({page: currentPage});

  if (error) return(<>{error.message}</>);
  if (!data) return(<>Loading...</>);

  return (
    <>
    {data.map(c => (
      <div className="m-2" key={c.title}>
        <p>Comic thumnnail</p>
        <p><Link href={`/admin/comics/${c.title}`}>{c.title}</Link></p>
        <p>{c.tags.map(t => t.display_name).join(", ")}</p>
      </div>
    ))}
    <PageSelector totalPages={Math.ceil(data.length / 5)} currentPage={currentPage} onPageSet={setCurrentPage}/>
    </>
  );
}