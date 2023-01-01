import Link from "next/link";

const imgFirst = "flex flex-col items-center h-screen w-screen bg-no-repeat bg-cover bg-[url('https://media.discordapp.net/attachments/1013480960983060491/1017960730168934500/shop-top-new-2020-FLAT.jpg?width=1663&height=935')]";
const imgSecond = "flex flex-col items-center h-screen w-screen bg-no-repeat bg-cover bg-[url('https://img1.wsimg.com/isteam/ip/5d0f9553-b972-4928-9e80-b14567783772/appetite.jpg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:2046,h:2046')]";

function Home() {
  return (
    <>
    <div className={imgFirst}>
      <h1 className="text-center text-6xl drop-shadow-sm tracking-wide w-2/3 pt-20 pb-5">THE NEXT GENERATION OF PERIL COMICS</h1>
      <h2 className="text-center text-4xl pt-4 w-1/2 pb-5">WHAT&apos;S YOUR PERIL?</h2>
      <div className="bg-red-700 rounded-md px-2 py-1 text-2xl">
        <Link href="/store">Check out the new stuff</Link>
      </div>
    </div>
    <div className={imgSecond}>
    </div>
    </>
  );
}

export default Home;