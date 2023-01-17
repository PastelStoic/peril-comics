// a master list of all comics, the number of pages and images in each, the tags for each comic, and a button to edit
// possibly viewership stats?

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
    </>
  );
}