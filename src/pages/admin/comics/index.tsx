// a master list of all comics, the number of pages and images in each, the tags for each comic, and a button to edit
// possibly viewership stats?

import PageSelector from "src/components/pageSelector";

export default function ComicsMain() {
  const allComics = [
    {
      id: "id",
      title: "comic",
    },
  ];

  return (
    <>
    {allComics.map(c => (
      <div key={c.title}>
        <p>Comic thumnnail</p>
        <p>Title</p>
        <p>Tags</p>
      </div>
    ))}
    <PageSelector totalPages={6} currentPage={1} onPageSet={page => console.log(`Setting page to ${page}`)}/>
    </>
  );
}