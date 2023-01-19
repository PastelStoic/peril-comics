/**
 * All indexed at 1, for users sake
 * @param props 
 * @returns 
 */
export default function PageSelector(props: {totalPages: number, currentPage: number, onPageSet: (page: number) => void}) {
  function buildPageButtons() {
    const buttons = [];
    for (let page = 1; page <= props.totalPages; page++) {
      buttons.push(
        <button key={page} className={`rounded-md ${page === props.currentPage ? "bg-blue-600" : ""}`} onClick={() => props.onPageSet(page)}>{page}</button>
      );
      // if total pages exceeds x (5?) stop at page 2 or 3, then show a ... in the middle, then end with the last 2 or 3 pages.
    }
    if (props.totalPages > 5) {
      buttons.unshift(<button key={0} onClick={() => props.onPageSet(1)}>Start</button>);
      buttons.push(<button key={"max"} onClick={() => props.onPageSet(props.totalPages)}>End</button>);
    }
    return buttons;
  }

  if (props.totalPages <= 1) return <></>;

  return (
    <>
      {buildPageButtons()}
    </>
  );
}