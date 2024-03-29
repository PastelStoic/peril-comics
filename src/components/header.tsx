'use client';

import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import perilcomicslogo from 'public/perilcomicslogo.webp';

function AccountMenu() {
  const { data: session } = useSession();
  if (session) return (<>
    <Link href="/account">
      <p className="mx-1 px-1 py-2 cursor-pointer">Account</p>
    </Link>
    <button className="mx-1 px-1 py-2" onClick={() => signOut()}>
    Log out
    </button>
    {session.user?.role === "admin" && <Link href={"/admin"}>Admin home page</Link>}
  </>);
  return (
    <button className="mx-2 px-1 py-2" onClick={() => signIn("discord")}>
    Login with Discord
    </button>
  )
}

function Header() {
  return (
    <header>
      <nav className="flex flex-row items-center text-white w-screen">
        <div className="flex-none mr-4">
          <Link href="/">
            <Image 
            src={perilcomicslogo}
            alt="Peril Comics Logo"
            height={100}
            width={116}
            />
          </Link>
        </div>
        <AccountMenu />
      </nav>
    </header>
  );
}

export default Header;